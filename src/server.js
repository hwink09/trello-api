/* eslint-disable no-console */
import express from 'express'
import cors from 'cors'
import { corsOptions } from '~/config/cors'
import exitHook from 'async-exit-hook'
import { CONNECT_DB, CLOSE_DB } from '~/config/mongodb'
import { env } from '~/config/environment'
import { APIs_V1 } from '~/routes/v1'
import { errorHandlingMiddleware } from '~/middlewares/errorHandlingMiddleware'
import cookieParser from 'cookie-parser'
import socketIo from 'socket.io'
import http from 'http'
import { inviteUserToBoardSocket } from '~/sockets/inviteUserToBoardSocket'
import { WHITELIST_DOMAINS } from '~/utils/constants'
import swaggerUi from 'swagger-ui-express'
import swaggerDocument from '../swagger.json'

const START_SERVER = async () => {
  const app = express()
  // Fix cache from disk của Express
  app.use((req, res, next) => {
    res.set('Cache-Control', 'no-store')
    next()
  })

  // Cấu hình cookie-parser
  app.use(cookieParser())

  // Xử lí CORS
  app.use(cors(corsOptions))

  // Enable req.body json data
  app.use(express.json())

  // Swagger API Documentation
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, {
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'Trello Clone API Documentation'
  }))

  // use API V1
  app.use('/v1', APIs_V1)

  // Middleware xử lí lỗi tập trung
  app.use(errorHandlingMiddleware)

  // Tạo HTTP server từ Express app để tích hợp với Socket.io
  const server = http.createServer(app)

  // Khởi tạo biến io với server và cors configuration cho Socket.IO
  const io = socketIo(server, {
    cors: {
      origin: function (origin, callback) {
        // Cho phép dev environment
        if (env.BUILD_MODE === 'dev') {
          return callback(null, true)
        }

        // Cho phép requests không có origin (mobile apps, server-to-server)
        if (!origin) {
          return callback(null, true)
        }

        // Normalize và kiểm tra whitelist
        const normalizedOrigin = origin.endsWith('/') ? origin.slice(0, -1) : origin
        const isAllowed = WHITELIST_DOMAINS.some(domain => {
          const normalizedDomain = domain.endsWith('/') ? domain.slice(0, -1) : domain
          return normalizedDomain === normalizedOrigin
        })

        if (isAllowed) {
          return callback(null, true)
        }

        callback(new Error('Not allowed by CORS'))
      },
      credentials: true,
      methods: ['GET', 'POST']
    },
    // Cho phép cả polling và websocket transports
    transports: ['polling', 'websocket'],
    // Tăng timeout cho Render free tier (có thể sleep)
    pingTimeout: 60000,
    pingInterval: 25000
  })

  io.on('connection', (socket) => {
    console.log('New client connected:', socket.id)
    inviteUserToBoardSocket(socket)

    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id)
    })
  })

  // Môi trường production (cụ thể hiện tại support Render.com)
  if (env.BUILD_MODE === 'production') {
    // Dùng server.listen thay vì app.listen vì lúc này server đẫ bao gồm eexpress app + socket.io
    server.listen(process.env.PORT, () => {
      console.log(
        `3. Production: Hello ${env.AUTHOR}, Back-end Server is running successfully at Port: ${process.env.PORT}`
      )
    })
  } else {
    // Môi trường local dev
    // Dùng server.listen thay vì app.listen vì lúc này server đẫ bao gồm eexpress app + socket.io
    server.listen(env.LOCAL_DEV_APP_PORT, env.LOCAL_DEV_APP_HOST, () => {
      console.log(
        `3. Local DEV: Hello ${env.AUTHOR}, Back-end Server is running successfully at Host ${env.LOCAL_DEV_APP_HOST} and Port: ${env.LOCAL_DEV_APP_PORT}`
      )
    })
  }

  // thực hiện các tác vụ clean up trước khi dừng server
  exitHook(() => {
    console.log('4. Server is shutting down...')
    CLOSE_DB()
    console.log('5. Disconnected from MongoDB.')
  })
}

// chỉ khi kết nối đến db thành công thì mới start server back-end lên
// Immediately-invoked / Anonymous Asnyc Function (IIFE)
(async () => {
  try {
    console.log('1. Connecting to MongoDB CLoud Atlas...')
    await CONNECT_DB()
    console.log('2. Connected to MongoDB CLoud Atlas!')

    START_SERVER()
  } catch (error) {
    console.error('Error connecting to MongoDB:', error)
    process.exit(0)
  }
})()
