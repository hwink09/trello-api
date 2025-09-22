import "dotenv/config";

export const env = {
  MONGODB_URI: process.env.MONGODB_URI,
  DATABASE_NAME: process.env.DATABASE_NAME,

  // Render sẽ cung cấp process.env.PORT, nếu không có thì dùng APP_PORT trong .env hoặc mặc định 8017
  APP_HOST: process.env.APP_HOST || "0.0.0.0",
  APP_PORT: process.env.PORT || process.env.APP_PORT || 8017,

  BUILD_MODE: process.env.BUILD_MODE,

  AUTHOR: process.env.AUTHOR || "Anonymous",
};
