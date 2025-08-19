const { ICON_URL } = require('./constants')

function formatEventAlertMessage(data, action, sentryBaseUrl = 'https://sentry.io') {
  const eventData = data.data || {}
  const event = eventData.event || {}
  const issueAlert = eventData.issue_alert || {}
  const triggeredRule = eventData.triggered_rule || '未知规则'

  // 根据官方文档，使用正确的字段
  const title = event.title || '未知告警'
  const level = event.level || 'info'
  let webUrl = event.web_url || '' // 官方文档：data['event']['web_url']

  // 如果 webUrl 是相对路径，则拼接基础 URL
  if (webUrl && !webUrl.startsWith('http')) {
    webUrl = `${sentryBaseUrl}${webUrl.startsWith('/') ? '' : '/'}${webUrl}`
  }

  const eventId = event.event_id || ''
  const culprit = event.culprit || ''


  const levelEmoji = {
    'fatal': '🔴',
    'error': '🔴',
    'warning': '🟡',
    'info': '🔵',
    'debug': '⚪'
  }[level] || '⚪'

  const contexts = event.contexts || {}
  const browserInfo = contexts.browser ? `${contexts.browser.name} ${contexts.browser.version}` : '未知'
  const osInfo = contexts.os ? `${contexts.os.name} ${contexts.os.version}` : '未知'

  return {
    msgtype: 'template_card',
    template_card: {
      card_type: 'text_notice',
      source: {
        icon_url: ICON_URL,
        desc: 'Sentry 事件告警'
      },
      main_title: {
        title: `${levelEmoji} Sentry 事件告警`,
        desc: `触发规则: ${issueAlert.title || triggeredRule}` // 官方文档：data['issue_alert']['title']
      },
      horizontal_content_list: [
        {
          keyname: '告警级别',
          value: level.toUpperCase()
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
        quote_text: issueAlert.title || triggeredRule
      }
    }
  }
}

module.exports = { formatEventAlertMessage }
