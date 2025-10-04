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
import { JwtProvider } from '~/providers/JwtProvider'

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

const verifyAccount = async (reqBody) => {
  try {
    // Query user trong DB
    const existUser = await userModel.findOneByEmail(reqBody.email)

    // Các bước kiểm tra cần thiết
    if (!existUser)
      throw new ApiError(StatusCodes.NOT_FOUND, 'Account not found!')
    if (existUser.isActive)
      throw new ApiError(StatusCodes.NOT_ACCEPTABLE, 'Account already active!')
    if (reqBody.token !== existUser.verifyToken)
      throw new ApiError(
        StatusCodes.NOT_ACCEPTABLE,
        'Verification token is invalid!'
      )

    // Nếu như mọi thứ ok thì update lại user để verify
    const updateData = {
      isActive: true,
      verifyToken: null
    }
    // Thực hiện update thông tin user
    const updatedUser = await userModel.update(existUser._id, updateData)

    return pickUser(updatedUser)
  } catch (error) {
    throw error
  }
}

const login = async (reqBody) => {
  try {
    // Query user trong DB
    const existUser = await userModel.findOneByEmail(reqBody.email)

    // Các bước kiểm tra cần thiết
    if (!existUser)
      throw new ApiError(StatusCodes.NOT_FOUND, 'Account not found!')
    if (!existUser.isActive)
      throw new ApiError(StatusCodes.NOT_ACCEPTABLE, 'Account is not active!')
    if (!bcryptjs.compareSync(reqBody.password, existUser.password)) {
      throw new ApiError(
        StatusCodes.NOT_ACCEPTABLE,
        'Your email or password is incorrect!'
      )
    }

    /**
     * Nếu mọi thứ ok thì bắt đầu tạo tokens đăng nhập để trả về cho phía FE
     */
    // Tạo thông tin để đính kèm trong JWT Token bao gồm _id và email của user
    const userInfo = {
      _id: existUser._id,
      email: existUser.email
    }
    // Tạo ra 2 loại token, accessToken và refreshToken để trả về phía FE
    const accessToken = await JwtProvider.generateToken(
      userInfo,
      env.ACCESS_TOKEN_SECRET_SIGNATURE,
      env.ACCESS_TOKEN_LIFE
    )

    const refreshToken = await JwtProvider.generateToken(
      userInfo,
      env.REFRESH_TOKEN_SECRET_SIGNATURE,
      env.REFRESH_TOKEN_LIFE
    )
    // Trả về thông tin của user kèm theo 2 cái token vừa tạo ra
    return {
      accessToken,
      refreshToken,
      ...pickUser(existUser)
    }
  } catch (error) {
    throw error
  }
}

const refreshToken = async (clientRefreshToken) => {
  try {
    // verify (giải mã) cái refresh token xem có hợp lệ không
    const refreshTokenDecoded = await JwtProvider.verifyToken(
      clientRefreshToken,
      env.REFRESH_TOKEN_SECRET_SIGNATURE
    )

    // Vì chỉ lưu những thông tin unique và cố định user trong token rồi => có thể lấy luôn từ decoded ra, tiết kiệm query vào DB để lấy data mới
    const userInfo = {
      _id: refreshTokenDecoded._id,
      email: refreshTokenDecoded.email
    }

    // Tạo accessToken mới
    const accessToken = await JwtProvider.generateToken(
      userInfo,
      env.ACCESS_TOKEN_SECRET_SIGNATURE,
      env.ACCESS_TOKEN_LIFE
    )

    return { accessToken }
  } catch (error) {
    throw error
  }
}

const update = async (userId, reqBody) => {
  try {
    // Query user trong DB và kiểm tra cho chắc chắn
    const existUser = await userModel.findOneById(userId)
    if (!existUser)
      throw new ApiError(StatusCodes.NOT_FOUND, 'Account not found!')
    if (!existUser.isActive)
      throw new ApiError(StatusCodes.NOT_ACCEPTABLE, 'Account is not active!')

    // Khởi tạo kết quả updated User ban đầu là empty
    let updatedUser = {}
    // Trường hợp change password
    if (reqBody.current_password && reqBody.new_password) {
      // Kiểm tra current_password có đúng không
      if (!bcryptjs.compareSync(reqBody.current_password, existUser.password)) {
        throw new ApiError(
          StatusCodes.NOT_ACCEPTABLE,
          'Your current password is incorrect!'
        )
      }
      // Nếu current_password đúng thì mới cho phép update
      updatedUser = await userModel.update(userId, {
        password: bcryptjs.hashSync(reqBody.new_password, 8)
      })
    } else {
      // Trường hợp update thông tin đơn thuần
      updatedUser = await userModel.update(userId, reqBody)
    }
    return pickUser(updatedUser)
  } catch (error) {
    throw error
  }
}

export const userService = {
  createNew,
  verifyAccount,
  login,
  refreshToken,
  update
}
