// 模板常量配置
const TEMPLATE_CONSTANTS = {
  ICON_URL: process.env.SENTRY_ICON_URL || 'https://sentry.io/static/favicon-46f8676a36982f8eb852ac6860387755.ico',
  DEFAULT_SENTRY_BASE_URL: process.env.SENTRY_BASE_URL || 'https://sentry.io',
  MESSAGE_TYPE: 'template_card',
  CARD_TYPE: 'text_notice'
}

module.exports = TEMPLATE_CONSTANTS
