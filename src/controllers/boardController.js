import { StatusCodes } from 'http-status-codes'
import { boardService } from '~/services/boardService'

const createNew = async (req, res, next) => {
  try {
    const userId = req.jwtDecoded._id
    // Điều hướng dữ liệu sang Service
    const createdBoard = await boardService.createNew(userId, req.body)

    // throw new ApiError(StatusCodes.BAD_REQUEST, "Hwink test error");

    // Có kết quả thì trả về Client
    res.status(StatusCodes.CREATED).json(createdBoard)
  } catch (error) {
    next(error)
  }
}

const getBoards = async (req, res, next) => {
  try {
    const userId = req.jwtDecoded._id
    // page và itemPerPage sẽ được truyền vào từ query url phía FE nên BE lấy thông qua req.query
    const { page, itemsPerPage, q } = req.query
    const queryFilter = q
    const result = await boardService.getBoards(userId, page, itemsPerPage, queryFilter)

    res.status(StatusCodes.OK).json(result)
  } catch (error) {
    next(error)
  }
}

const getDetails = async (req, res, next) => {
  try {
    const userId = req.jwtDecoded._id
    const boardId = req.params.id
    // sau này sẽ có thêm userId sẽ chỉ lấy board thuộc về user đó
    const board = await boardService.getDetails(userId, boardId)

    res.status(StatusCodes.OK).json(board)
  } catch (error) {
    next(error)
  }
}

const update = async (req, res, next) => {
  try {
    const boardId = req.params.id
    const updatedBoard = await boardService.update(boardId, req.body)

    res.status(StatusCodes.OK).json(updatedBoard)
  } catch (error) {
    next(error)
  }
}

const moveCardToDifferentColumn = async (req, res, next) => {
  try {
    const result = await boardService.moveCardToDifferentColumn(req.body)
    res.status(StatusCodes.OK).json(result)
  } catch (error) {
    next(error)
  }
}

export const boardController = {
  createNew,
  getBoards,
  getDetails,
  update,
  moveCardToDifferentColumn
}
