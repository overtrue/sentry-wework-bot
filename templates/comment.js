const { ICON_URL } = require('./constants')

function formatCommentMessage(data, action, sentryBaseUrl = 'https://sentry.io') {
  const commentData = data.data || {}
  const actor = data.actor || {}

  const commentText = commentData.comment || '无内容'
  const projectName = commentData.project_slug || '未知项目'
  const authorName = actor.name || '未知用户'

  // 评论统一跳转到 base URL
  const issueUrl = sentryBaseUrl

  const actionText = {
    'created': '创建',
    'updated': '更新',
    'deleted': '删除'
  }[action] || action

  return {
    msgtype: 'template_card',
    template_card: {
      card_type: 'text_notice',
      source: {
        icon_url: ICON_URL,
        desc: 'Sentry 评论系统'
      },
      main_title: {
        title: '💬 Sentry 评论通知',
        desc: `${projectName} - ${actionText}`
      },
      horizontal_content_list: [
        {
          keyname: '项目名称',
          value: projectName
        },
        {
          keyname: '操作类型',
          value: actionText
        },
        {
          keyname: '评论者',
          value: authorName
        },
        {
          keyname: '问题ID',
          value: commentData.issue_id || '未知'
        }
      ],
      card_action: {
        type: 1,
        url: issueUrl || sentryBaseUrl
      },
      quote_area: {
        quote_text: commentText
      }
    }
  }
}

module.exports = { formatCommentMessage }
