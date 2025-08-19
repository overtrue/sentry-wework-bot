const { ICON_URL } = require('./constants')

function formatInstallationMessage(data, action, sentryBaseUrl = 'https://sentry.io') {
  const installationData = data.data?.installation || {}
  const actor = data.actor || {}

  return {
    msgtype: 'template_card',
    template_card: {
      card_type: 'text_notice',
      source: {
        icon_url: ICON_URL,
        desc: 'Sentry 集成管理'
      },
      main_title: {
        title: '🔧 Sentry 集成安装通知',
        desc: `操作: ${action}`
      },
      horizontal_content_list: [
        {
          keyname: '操作类型',
          value: action
        },
        {
          keyname: '安装ID',
          value: installationData.uuid || '未知'
        },
        {
          keyname: '状态',
          value: installationData.status || '未知'
        },
        {
          keyname: '安装者',
          value: actor.name || '未知'
        }
      ],
      card_action: {
        type: 1,
        url: `${sentryBaseUrl}/settings/`
      },
      quote_area: {
        quote_text: 'Sentry 集成已成功安装'
      }
    }
  }
}

module.exports = { formatInstallationMessage }
