const { ICON_URL } = require('./constants')

function formatIssueMessage(data, action, sentryBaseUrl = 'https://sentry.io') {
  const issue = data.data?.issue || {}
  const project = issue.project || {}

  const title = issue.title || '未知问题'
  const level = issue.level || 'info'

  // 构建 issue URL，因为 permalink 可能为 null
  let url = issue.permalink || ''
  if (!url && issue.id && project.slug) {
    url = `${sentryBaseUrl}/organizations/test-org/issues/${issue.id}/`
  }

  const projectName = project.name || '未知项目'

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



  return {
    msgtype: 'template_card',
    template_card: {
      card_type: 'text_notice',
      source: {
        icon_url: ICON_URL,
        desc: 'Sentry 监控系统'
      },
      main_title: {
        title: `${levelEmoji} Sentry 问题通知`,
        desc: `${projectName} - ${actionText}`
      },
      horizontal_content_list: [
        {
          keyname: '问题级别',
          value: level.toUpperCase()
        },
        {
          keyname: '操作类型',
          value: actionText
        },
        {
          keyname: '首次出现',
          value: issue.firstSeen || '未知'
        },
        {
          keyname: '最后出现',
          value: issue.lastSeen || '未知'
        },
        {
          keyname: '出现次数',
          value: `${issue.count || 0} 次`
        }
      ],
      card_action: {
        type: 1,
        url: url || sentryBaseUrl
      },
      quote_area: {
        quote_text: title
      }
    }
  }
}

module.exports = { formatIssueMessage }
