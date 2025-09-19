import { slugify } from "~/utils/formatters";
import { boardModel } from "~/models/boardModel";
import ApiError from "~/utils/ApiError";
import { StatusCodes } from "http-status-codes";
import { cloneDeep } from "lodash";

/* eslint-disable no-useless-catch */
const createNew = async (reqBody) => {
  try {
    const newBoard = {
      ...reqBody,
      slug: slugify(reqBody.title),
    };

    // Gọi tới Model để xử lí lưu bản ghi newBoard vào trong DB
    const createdBoard = await boardModel.createNew(newBoard);

    // Lấy bản ghi board sau khi gọi
    const getNewBoard = await boardModel.findOneById(createdBoard.insertedId);

    // Làm thêm các xử lí logic khác với các Collection khác tùy đặc thù dự án...
    // Bắn email, notification về cho admin khi có 1 board mới được tạo...

    // Trả kết quả về, trong service luôn phải có return
    return getNewBoard;
  } catch (error) {
    throw error;
  }
};

const getDetails = async (boardId) => {
  try {
    const board = await boardModel.getDetails(boardId);
    if (!board) {
      throw new ApiError(StatusCodes.NOT_FOUND, "Board not found");
    }

    // 1. DeepClone board ra một cái mới để xử lí, không ảnh hưởng tới board ban đầu, tùy mục đích có cần hay không
    const resBoard = cloneDeep(board);
    // 2. Đưa card về đúng column của nó
    resBoard.columns.forEach((column) => {
      column.cards = resBoard.cards.filter((card) =>
        card.columnId.equals(column._id)
      );
      // column.cards = resBoard.cards.filter(
      //   (card) => card.columnId.toString() === column._id.toString()
      // );
    });
    //xóa mảng cards khỏi board ban đầu
    delete resBoard.cards;

    return resBoard;
  } catch (error) {
    throw error;
  }
};

const update = async (boardId, reqBody) => {
  try {
    const updateData = {
      ...reqBody,
      updatedAt: Date.now(),
    };
    const updatedBoard = await boardModel.update(boardId, updateData);

    return updatedBoard;
  } catch (error) {
    throw error;
  }
};

export const boardService = {
  createNew,
  getDetails,
  update,
};
