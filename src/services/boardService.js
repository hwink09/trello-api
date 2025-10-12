import { slugify } from '~/utils/formatters'
import { boardModel } from '~/models/boardModel'
import ApiError from '~/utils/ApiError'
import { StatusCodes } from 'http-status-codes'
import { cloneDeep } from 'lodash'

import { columnModel } from '~/models/columnModel'
import { cardModel } from '~/models/cardModel'
import { DEFAULT_ITEMS_PER_PAGE, DEFAULT_PAGE } from '~/utils/constants'

/* eslint-disable no-useless-catch */
const createNew = async (userId, reqBody) => {
  try {
    const newBoard = {
      ...reqBody,
      slug: slugify(reqBody.title)
    }

    // Gọi tới Model để xử lí lưu bản ghi newBoard vào trong DB
    const createdBoard = await boardModel.createNew(userId, newBoard)

    // Lấy bản ghi board sau khi gọi
    const getNewBoard = await boardModel.findOneById(createdBoard.insertedId)

    // Làm thêm các xử lí logic khác với các Collection khác tùy đặc thù dự án...
    // Bắn email, notification về cho admin khi có 1 board mới được tạo...

    // Trả kết quả về, trong service luôn phải có return
    return getNewBoard
  } catch (error) {
    throw error
  }
}

const getBoards = async (userId, page, itemsPerPage) => {
  try {
    if (!page) page = DEFAULT_PAGE
    if (!itemsPerPage) itemsPerPage = DEFAULT_ITEMS_PER_PAGE

    const result = await boardModel.getBoards(
      userId,
      parseInt(page, 10),
      parseInt(itemsPerPage, 10)
    )
    return result
  } catch (error) {
    throw error
  }
}

const getDetails = async (userId, boardId) => {
  try {
    const board = await boardModel.getDetails(userId, boardId)
    if (!board) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Board not found')
    }

    // 1. DeepClone board ra một cái mới để xử lí, không ảnh hưởng tới board ban đầu, tùy mục đích có cần hay không
    const resBoard = cloneDeep(board)
    // 2. Đưa card về đúng column của nó
    resBoard.columns.forEach((column) => {
      column.cards = resBoard.cards.filter((card) =>
        card.columnId.equals(column._id)
      )
      // column.cards = resBoard.cards.filter(
      //   (card) => card.columnId.toString() === column._id.toString()
      // );
    })
    //xóa mảng cards khỏi board ban đầu
    delete resBoard.cards

    return resBoard
  } catch (error) {
    throw error
  }
}

const update = async (boardId, reqBody) => {
  try {
    const updateData = {
      ...reqBody,
      updatedAt: Date.now()
    }
    const updatedBoard = await boardModel.update(boardId, updateData)

    return updatedBoard
  } catch (error) {
    throw error
  }
}

const moveCardToDifferentColumn = async (reqBody) => {
  try {
    //B1: cập nhật mảng cardOrderIds của Column ban đầu chứa nó (xóa _id của Card ra khỏi mảng)
    await columnModel.update(reqBody.prevColumnId, {
      cardOrderIds: reqBody.prevCardOrderIds,
      updatedAt: Date.now()
    })
    // B2: Cập nhật mảnh CardOrderIds của Column tiếp theo (thêm _id của Card vào mảng)
    await columnModel.update(reqBody.nextColumnId, {
      cardOrderIds: reqBody.nextCardOrderIds,
      updatedAt: Date.now()
    })
    // B3: Cập nhật lại trường columnId mới của cái card đã kéo
    await cardModel.update(reqBody.currentCardId, {
      columnId: reqBody.nextColumnId
    })

    return { updateResult: 'Successfully' }
  } catch (error) {
    throw error
  }
}

export const boardService = {
  createNew,
  getBoards,
  getDetails,
  update,
  moveCardToDifferentColumn
}
