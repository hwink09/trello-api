import Joi from "joi";
import { StatusCodes } from "http-status-codes";

const createNew = async (req, res, next) => {
  /**
   * Note: Mặc định không cần phải custom message ở phía BE vì để cho FE tự validate và custom phía FE cho đẹp
   * BE chỉ cần validate ĐẢM BẢO DỮ LIỆU CHUẨN XÁC và trả về message mặc định từ thư viện là được
   * Quan trọng: Việc validate dữ liệu là BẮT BUỘC phải có ở phía BE vì đây là điểm cuối để lưu trữ dữ liệu vào database
   * Và thông thường trong thực tế, điều tốt nhất cho hệ thống là hãy luôn validate dữ liệu ở cả BE và FE
   */
  const correctCondition = Joi.object({
    title: Joi.string().required().min(3).max(50).trim().strict().messages({
      "any.required": "Title is required",
      "string.empty": "Title is not allowed to be empty",
      "string.min": "Title length must be at least 3 characters long",
      "string.max": "Title length must be less than or equal to 50 chars long",
      "string.trim": "Title must not have leading or trailing whitespce",
    }),
    description: Joi.string().required().min(3).max(255).trim().strict().messages({
      "any.required": "Description is required",
      "string.empty": "Description is not allowed to be empty",
      "string.min": "Description length must be at least 3 characters long",
      "string.max": "Description length must be less than or equal to 255 chars long",
      "string.trim": "Description must not have leading or trailing whitespce",
    }),
  });

  try {
    // console.log(req.body);
    // abortEarly: false để trường hợp có nhiều lỗi validation thì trả về tất cả
    await correctCondition.validateAsync(req.body, { abortEarly: false });
    // next()
    res
      .status(StatusCodes.CREATED)
      .json({ message: "POST: API create new board" });
  } catch (error) {
    res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({
      errors: new Error(error).message,
    });
  }
};

export const boardValidation = {
  createNew,
};
