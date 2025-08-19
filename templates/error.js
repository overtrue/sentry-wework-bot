const { ICON_URL } = require('./constants')

function formatErrorMessage(data, action, sentryBaseUrl = 'https://sentry.io') {
  const errorData = data.data || {}
  const error = errorData.error || {}

  const title = error.title || '未知错误'
  const level = error.level || 'info'
  let webUrl = error.web_url || ''

  // 如果 webUrl 是相对路径，则拼接基础 URL
  if (webUrl && !webUrl.startsWith('http')) {
    webUrl = `${sentryBaseUrl}${webUrl.startsWith('/') ? '' : '/'}${webUrl}`
  }

  const eventId = error.event_id || ''
  const culprit = error.culprit || ''


  const levelEmoji = {
    'fatal': '🔴',
    'error': '🔴',
    'warning': '🟡',
    'info': '🔵',
    'debug': '⚪'
  }[level] || '⚪'

  const actionText = {
    'created': '创建',
    'updated': '更新',
    'resolved': '解决',
    'ignored': '忽略'
  }[action] || action

  const contexts = error.contexts || {}
  const browserInfo = contexts.browser ? `${contexts.browser.name} ${contexts.browser.version}` : '未知'
  const osInfo = contexts.os ? `${contexts.os.name} ${contexts.os.version}` : '未知'

  return {
    msgtype: 'template_card',
    template_card: {
      card_type: 'text_notice',
      source: {
        icon_url: ICON_URL,
        desc: 'Sentry 错误监控'
      },
      main_title: {
        title: `${levelEmoji} Sentry 错误通知`,
        desc: `${actionText} - ${level.toUpperCase()}`
      },
      horizontal_content_list: [
        {
          keyname: '错误级别',
          value: level.toUpperCase()
        },
        {
          keyname: '操作类型',
          value: actionText
        },
        {
          keyname: '事件ID',
          value: eventId
        },
        {
          keyname: '错误位置',
          value: culprit || '未知'
        },
        {
          keyname: '浏览器',
          value: browserInfo
        },
        {
          keyname: '操作系统',
          value: osInfo
        }
      ],
      card_action: {
        type: 1,
        url: webUrl || sentryBaseUrl
      },
      quote_area: {
        quote_text: title
      }
    }
  }
}

module.exports = { formatErrorMessage }
