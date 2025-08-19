const { ICON_URL } = require('./constants')

function formatMetricAlertMessage(data, action, sentryBaseUrl = 'https://sentry.io') {
  const metricAlert = data.data?.metric_alert || {}
  const alertRule = metricAlert.alert_rule || {}
  const descriptionTitle = data.data?.description_title || '未知指标告警'
  const descriptionText = data.data?.description_text || ''
  let webUrl = data.data?.web_url || ''

  // 如果 webUrl 是相对路径，则拼接基础 URL
  if (webUrl && !webUrl.startsWith('http')) {
    webUrl = `${sentryBaseUrl}${webUrl.startsWith('/') ? '' : '/'}${webUrl}`
  }

  const actionText = {
    'critical': '严重',
    'warning': '警告',
    'resolved': '已解决'
  }[action] || action

  const statusText = {
    0: '活跃',
    1: '已解决',
    2: '已关闭'
  }[metricAlert.status] || '未知状态'

  const statusEmoji = {
    0: '🔴',
    1: '🟢',
    2: '⚪'
  }[metricAlert.status] || '⚪'

  return {
    msgtype: 'template_card',
    template_card: {
      card_type: 'text_notice',
      source: {
        icon_url: ICON_URL,
        desc: 'Sentry 指标监控'
      },
      main_title: {
        title: `${statusEmoji} Sentry 指标告警`,
        desc: `${descriptionTitle}`
      },
      horizontal_content_list: [
        {
          keyname: '告警状态',
          value: statusText
        },
        {
          keyname: '操作类型',
          value: actionText
        },
        {
          keyname: '规则名称',
          value: alertRule.name || '未知规则'
        },
        {
          keyname: '聚合方式',
          value: alertRule.aggregate || '未知'
        },
        {
          keyname: '查询条件',
          value: alertRule.query || '无'
        }
      ],
      card_action: {
        type: 1,
        url: webUrl || sentryBaseUrl
      },
      quote_area: {
        quote_text: descriptionText
      }
    }
  }
}

module.exports = { formatMetricAlertMessage }
