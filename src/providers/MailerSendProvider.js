import { MailerSend, EmailParams, Sender, Recipient } from 'mailersend'
import { env } from '~/config/environment'

const MAILER_SEND_API_KEY = env.MAILER_SEND_API_KEY
const ADMIN_FROM_EMAIL = env.ADMIN_FROM_EMAIL
const ADMIN_SENDER_NAME = env.ADMIN_SENDER_NAME

// Tạo một instance của MailerSend với API key
const mailerSendInstance = new MailerSend({ apiKey: MAILER_SEND_API_KEY })

// Tạo biến sendFrom: người gửi email
const sendFrom = new Sender(ADMIN_FROM_EMAIL, ADMIN_SENDER_NAME)

// Function để gửi email
const sendEmail = async ({ to, toName, subject, html }) => {
  try {
    // Setup email và tên của người nhận, (hoặc nhiều người nhận)
    const recipient = [
      new Recipient(to, toName)
      // new Recipient(to, toName)
      // new Recipient(to, toName) // Muốn gửi nhiều thì nạp vip
    ]

    // Setup email params theo chuẩn của MailerSend
    const emailParams = new EmailParams()
      .setFrom(sendFrom)
      .setTo(recipient)
      .setReplyTo(sendFrom)
      .setSubject(subject)
      .setHtml(html)
    // .setText() // Email dạng text cực kì đơn giản (ít dùng)

    // Thực hiện gửi email
    const data = await mailerSendInstance.email.send(emailParams)
    return data
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log('🚀 ~ sendEmail ~ error:', error)
    throw error
  }
}

export const MailerSendProvider = {
  sendEmail
}
