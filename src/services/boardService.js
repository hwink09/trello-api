import { slugify } from "~/utils/formatters";
import { boardModel } from "~/models/boardModel";

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

export const boardService = {
  createNew,
};
