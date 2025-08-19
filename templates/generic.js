const { ICON_URL } = require('./constants')

function formatGenericMessage(data, resourceType, action, sentryBaseUrl = 'https://sentry.io') {
  return {
    msgtype: 'template_card',
    template_card: {
      card_type: 'text_notice',
      source: {
        icon_url: ICON_URL,
        desc: 'Sentry 系统通知'
      },
      main_title: {
        title: '📢 Sentry 通用通知',
        desc: `${resourceType} - ${action}`
      },
      horizontal_content_list: [
        {
          keyname: '资源类型',
          value: resourceType
        },
        {
          keyname: '操作类型',
          value: action
        },
        {
          keyname: '时间',
          value: new Date().toLocaleString('zh-CN')
        }
      ],
      card_action: {
        type: 1,
        url: sentryBaseUrl
      },
      quote_area: {
        quote_text: '点击查看详情'
      }
    }
  }
}

module.exports = { formatGenericMessage }
