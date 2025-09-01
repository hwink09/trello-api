import { StatusCodes } from "http-status-codes";
import { boardService } from "~/services/boardService";

const createNew = async (req, res, next) => {
  try {
    // Điều hướng dữ liệu sang Service
    const createdBoard = await boardService.createNew(req.body);

    // throw new ApiError(StatusCodes.BAD_REQUEST, "Hwink test error");

    // Có kết quả thì trả về Client
    res.status(StatusCodes.CREATED).json(createdBoard);
  } catch (error) {
    next(error);
  }
};

const getDetails = async (req, res, next) => {
  try {
    const boardId = req.params.id;
    // sau này sẽ có thêm userId sẽ chỉ lấy board thuộc về user đó
    const board = await boardService.getDetails(boardId);

    res.status(StatusCodes.OK).json(board);
  } catch (error) {
    next(error);
  }
};

export const boardController = {
  createNew,
  getDetails,
};
