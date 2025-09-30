import 'dotenv/config'

export const env = {
  MONGODB_URI: process.env.MONGODB_URI,
  DATABASE_NAME: process.env.DATABASE_NAME,

  LOCAL_DEV_APP_HOST: process.env.LOCAL_DEV_APP_HOST,
  LOCAL_DEV_APP_PORT: process.env.LOCAL_DEV_APP_PORT,

  BUILD_MODE: process.env.BUILD_MODE,

  AUTHOR: process.env.AUTHOR || 'Anonymous',

  WEBSITE_DOMAIN_DEV: process.env.WEBSITE_DOMAIN_DEV,
  WEBSITE_DOMAIN_PRODUCTION: process.env.WEBSITE_DOMAIN_PRODUCTION,

  // MailerSend
  MAILER_SEND_API_KEY: process.env.MAILER_SEND_API_KEY,
  ADMIN_FROM_EMAIL: process.env.ADMIN_FROM_EMAIL,
  ADMIN_SENDER_NAME: process.env.ADMIN_SENDER_NAME
}
