import { StatusCodes } from 'http-status-codes'
import { JwtProvider } from '~/providers/JwtProvider'
import { env } from '~/config/environment'
import ApiError from '~/utils/ApiError'

// Middleware xác thực người dùng (User) dựa vào accessToken
const isAuthorized = async (req, res, next) => {
  // lấy accessToken từ request cookies phía client - withCredentials trong file authorizeAxios
  const clientAccessToken = req.cookies?.accessToken

  // nếu không có accessToken trong request cookies
  if (!clientAccessToken) {
    next(
      new ApiError(StatusCodes.UNAUTHORIZED, 'Unauthorized! No token provided')
    )
    return
  }

  try {
    // 1. Giải mã token xem có hợp lệ không
    const accessTokenDecoded = await JwtProvider.verifyToken(
      clientAccessToken,
      env.ACCESS_TOKEN_SECRET_SIGNATURE
    )
    // 2. Quan trọng: Nếu token hợp lệ thì lưu thông tin giải mã được vào req.jwtDecoded, để sử dụng cho các tầng xử lí bên dưới
    req.jwtDecoded = accessTokenDecoded
    // 3. Cho phép request tiếp tục
    next()
  } catch (error) {
    console.log('🚀 ~ isAuthorized ~ error:', error)
    // Nếu accessToken hết hạn(expired) ... thì trả về lỗi cho FE gọi API refreshToken
    if (error?.message?.includes('jwt expired')) {
      next(new ApiError(StatusCodes.GONE,'Unauthorized! Token expired. Please refresh token'))
      return
    }
    // Nếu accessToken không hợp lệ bất kì điều gì khác vụ hết hạn thì cứ trả về 401 cho FE gọi API signout
    next(new ApiError(StatusCodes.UNAUTHORIZED, 'Unauthorized!'))
  }
}

export const authMiddleware = {
  isAuthorized
}
