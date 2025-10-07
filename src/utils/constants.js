import { env } from '~/config/environment'

// Những domain được phép truy cập tới tài nguyên của Server
export const WHITELIST_DOMAINS = [
  // "http://localhost:5173",
  'https://trello-web-omega-ten.vercel.app'
]

export const BOARD_TYPES = {
  PUBLIC: 'public',
  PRIVATE: 'private'
}

export const WEBSITE_DOMAIN =
  env.BUILD_MODE === 'production'
    ? env.WEBSITE_DOMAIN_PRODUCTION
    : env.WEBSITE_DOMAIN_DEV

export const DEFAULT_PAGE = 1
export const DEFAULT_ITEMS_PER_PAGE = 12