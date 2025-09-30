/* eslint-disable no-useless-catch */
import { StatusCodes } from 'http-status-codes'
import { userModel } from '~/models/userModel'
import ApiError from '~/utils/ApiError'
import bcryptjs from 'bcryptjs'
import { v4 as uuidv4 } from 'uuid'
import { pickUser } from '~/utils/formatters'
import { MailerSendProvider } from '~/providers/MailerSendProvider'
import { WEBSITE_DOMAIN } from '~/utils/constants'
import { env } from '~/config/environment'

const createNew = async (reqBody) => {
  try {
    // Kiểm tra xem email đã tồn tại hay chưa
    const existUser = await userModel.findOneByEmail(reqBody.email)
    if (existUser) {
      throw new ApiError(StatusCodes.CONFLICT, 'Email already exist!')
    }
    // Tạo data để lwu vào DB
    const nameFromEmail = reqBody.email.split('@')[0]
    const newUser = {
      email: reqBody.email,
      password: bcryptjs.hashSync(reqBody.password, 8), // Tham số thứ 8 là độ phức tạp, càng cao băm càng lâu
      username: nameFromEmail,
      displayName: nameFromEmail, // mặc định giống username sau này có thể update
      verifyToken: uuidv4()
    }

    // Thực hiện lưu vào DB
    const createdUser = await userModel.createNew(newUser)
    const getNewUser = await userModel.findOneById(createdUser.insertedId)

    // Gửi email cho người dùng xác thực tài khoản
    const verificationLink = `${WEBSITE_DOMAIN}/account/verification?token=${getNewUser.verifyToken}&email=${getNewUser.email}`
    const customSubject = `Email verification for ${getNewUser.email}`
    const htmlContent = `
      <h3>New user registration verification:</h3>
      <p><strong>User Email:</strong> ${getNewUser.email}</p>
      <p><strong>Display Name:</strong> ${getNewUser.displayName}</p>
      <h3>Verification link:</h3>
      <h3>${verificationLink}</h3>
      <h3>Sincerely, Hwinkdev</h3>
      <p><em>Note: This email was sent to admin due to MailerSend trial limitations.</em></p>
    `
    // Gọi tới provider để gửi email (tạm thời gửi đến admin do trial account, sau này sẽ gửi đến email của user)
    await MailerSendProvider.sendEmail({
      to: 'hwink.dev@gmail.com', // Email thật đã dùng để đăng ký MailerSend
      toName: 'Admin',
      subject: customSubject,
      html: htmlContent
    })
    // return trả về dữ liệu cho phía controller
    return pickUser(getNewUser)
  } catch (error) {
    throw error
  }
}

export const userService = {
  createNew
}
