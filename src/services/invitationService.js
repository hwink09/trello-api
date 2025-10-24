/* eslint-disable no-useless-catch */
import { StatusCodes } from 'http-status-codes'
import ApiError from '~/utils/ApiError'
import { userModel } from '~/models/userModel'
import { boardModel } from '~/models/boardModel'
import { invitationModel } from '~/models/invitationModel'
import { INVITATION_TYPES, BOARD_INVITATION_STATUS } from '~/utils/constants'
import { pickUser } from '~/utils/formatters'

const createNewBoardInvitation = async (reqBody, inviterId) => {
  try {
    // Người đi mời: chính là người đang request, tìm theo id lấy từ token
    const inviter = await userModel.findOneById(inviterId)
    // Nguời được mời: tìm theo email
    const invitee = await userModel.findOneByEmail(reqBody.inviteeEmail)
    // Tìm board để lấy data xử lí
    const board = await boardModel.findOneById(reqBody.boardId)

    // Nếu không tồn tại 1 trong 3 thì cứ reject
    if (!inviter || !board || !invitee) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Inviter, Invitee or Board not found.')
    }

    // Tạo data để lưu vào db
    // Có thể thử bỏ hoặc làm sai lệch type, boardInvitation, status để test xem Model validate ok chưa.
    const newInvitationData = {
      inviterId,
      inviteeId: invitee._id.toString(), // Chuyển từ ObjectId sang String vì sang bên Model có check lại data ở hàm create
      type: INVITATION_TYPES.BOARD_INVITATION,
      boardInvitation: {
        boardId: board._id.toString(),
        status: BOARD_INVITATION_STATUS.PENDING
      }
    }

    // Gọi sang Model để lưu vào db
    const createdInvitation = await invitationModel.createNewBoardInvitation(newInvitationData)
    const getInvitation = await invitationModel.findOneById(createdInvitation.insertedId)

    // Ngoài thông tin của cái board invitation mới tạo thì trả về đủ luôn cái board, inviter, invitee có FE xử lí
    const resInvitation = {
      ...getInvitation,
      inviter: pickUser(inviter),
      invitee: pickUser(invitee)
    }
    return resInvitation
  } catch (error) { throw error }
}

const getInvitations = async (userId) => {
  try {
    const getInvitations = await invitationModel.findByUser(userId)

    // Vì các dữ liệu inviter, invitee, board đang là giá trị mảng 1 phần tử nếu lấy ra được nên biến đổi nó thành Json Object luôn cho FE dễ dùng
    const resInvitations = getInvitations.map(i => ({
      ...i,
      inviter: i.inviter[0] || {},
      invitee: i.invitee[0] || {},
      board: i.board[0] || {}
    }))

    return resInvitations
  } catch (error) { throw error }
}

const updateBoardInvitation = async (invitationId, userId, status) => {
  try {
    // Tìm invitation theo id
    const getInvitation = await invitationModel.findOneById(invitationId)
    if (!getInvitation) throw new ApiError(StatusCodes.NOT_FOUND, 'Invitation not found.')

    // Có invitation rồi thì lấy full thông tin của board
    const boardId = getInvitation.boardInvitation.boardId
    const getBoard = await boardModel.findOneById(boardId)
    if (!getBoard) throw new ApiError(StatusCodes.NOT_FOUND, 'Board not found.')

    // Kiểm tra xem status code là ACCEPTED join board mà cái thằng user (invitee) đã là owner hoặc member của board rồi thì trả về thông báo lỗi
    // NOTE: 2 mảng memberIds và ownerIds đều là mảng các ObjectId nên khi so sánh với userId (string) thì phải chuyển sang String hết
    const boardOwnerAndMemberIds = [...getBoard.ownerIds, ...getBoard.memberIds].toString()
    if (status === BOARD_INVITATION_STATUS.ACCEPTED && boardOwnerAndMemberIds.includes(userId)) {
      throw new ApiError(StatusCodes.NOT_ACCEPTABLE, 'You are already a member of this board.')
    }

    // Tạo dữ liệu để update  bản ghi invitation
    const updateData = {
      boardInvitation: {
        ...getInvitation.boardInvitation,
        status: status
      }
    }

    // B1: Cập nhật lại status cho invitation
    const updatedInvitation = await invitationModel.update(invitationId, updateData)
    // B2: Nếu chấp nhận lời mời thì thêm user vào memberIds của board
    if (updatedInvitation.boardInvitation.status === BOARD_INVITATION_STATUS.ACCEPTED) {
      await boardModel.pushMembersIds(boardId, userId)
    }

    return updatedInvitation
  } catch (error) { throw error }

}

export const invitationService = {
  createNewBoardInvitation,
  getInvitations,
  updateBoardInvitation
}
