const { formatIssueMessage } = require('./issue')
const { formatEventAlertMessage } = require('./event-alert')
const { formatMetricAlertMessage } = require('./metric-alert')
const { formatCommentMessage } = require('./comment')
const { formatErrorMessage } = require('./error')
const { formatInstallationMessage } = require('./installation')
const { formatGenericMessage } = require('./generic')

function formatSentryMessage(data, resourceType, action, sentryBaseUrl = 'https://sentry.io') {
  switch (resourceType) {
    case 'issue':
      return formatIssueMessage(data, action, sentryBaseUrl)
    case 'event_alert':
      return formatEventAlertMessage(data, action, sentryBaseUrl)
    case 'metric_alert':
      return formatMetricAlertMessage(data, action, sentryBaseUrl)
    case 'comment':
      return formatCommentMessage(data, action, sentryBaseUrl)
    case 'error':
      return formatErrorMessage(data, action, sentryBaseUrl)
    case 'installation':
      return formatInstallationMessage(data, action, sentryBaseUrl)
    default:
      return formatGenericMessage(data, resourceType, action, sentryBaseUrl)
  }
}

module.exports = {
  formatSentryMessage
}

