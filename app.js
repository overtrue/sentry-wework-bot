const express = require('express')
const crypto = require('crypto')
const axios = require('axios')
require('dotenv').config()

const app = express()
const PORT = process.env.PORT || 3000

// 中间件
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true }))

class WeWorkBot {
  constructor(webhookUrl, chatId = null) {
    this.webhookUrl = webhookUrl
    this.chatId = chatId
  }

  async sendMessage(message) {
    // 如果消息已经是卡片格式，直接使用
    let data = message

    // 如果消息是字符串，转换为 markdown 格式（向后兼容）
    if (typeof message === 'string') {
      data = {
        msgtype: 'markdown',
        markdown: {
          content: message
        }
      }
    }

    // 如果有群ID，添加到请求中
    if (this.chatId) {
      data.chatid = this.chatId
    }

    // 调试模式：显示发送的消息内容
    if (process.env.DEBUG === 'true') {
      console.log('📤 准备发送到企业微信的消息:')
      console.log('Webhook URL:', this.webhookUrl)
      console.log('群ID:', this.chatId || '未设置')
      console.log('消息内容:')
      console.log('='.repeat(50))
      console.log(message)
      console.log('='.repeat(50))
      console.log('JSON 数据:', JSON.stringify(data, null, 2))
    }

    try {
      const response = await axios.post(
        this.webhookUrl,
        data,
        {
          headers: { 'Content-Type': 'application/json' },
          timeout: 10000
        }
      )

      if (process.env.DEBUG === 'true') {
        console.log('✅ 企业微信响应:', response.data)
      }

      // 检查企业微信接口返回的 errcode
      if (response.data && response.data.errcode !== undefined && response.data.errcode !== 0) {
        console.error('❌ 企业微信接口返回错误:')
        console.error('错误码:', response.data.errcode)
        console.error('错误信息:', response.data.errmsg || '未知错误')
        return null
      }

      return response.data
    } catch (error) {
      console.error('❌ 发送消息失败:')
      console.error('错误信息:', error.message)
      if (error.response) {
        console.error('响应状态:', error.response.status)
        console.error('响应数据:', error.response.data)
      }
      return null
    }
  }
}

function verifySignature(requestBody, signature, secret) {
  if (!secret) {
    return true // 如果没有设置密钥，跳过验证
  }

  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(JSON.stringify(requestBody))
    .digest('hex')

  return crypto.timingSafeEqual(
    Buffer.from(expectedSignature, 'hex'),
    Buffer.from(signature, 'hex')
  )
}

// 引入模板模块
const { formatSentryMessage } = require('./templates')

// 路由
app.post('/webhook', async (req, res) => {
  try {
    // 获取配置
    const webhookUrl = process.env.WEWORK_WEBHOOK_URL
    const chatId = process.env.WEWORK_CHAT_ID
    const secret = process.env.SENTRY_WEBHOOK_SECRET
    const sentryBaseUrl = process.env.SENTRY_BASE_URL

    if (!webhookUrl) {
      return res.status(400).json({ error: '未配置企业微信机器人 webhook URL' })
    }

    // 获取请求头
    const signature = req.headers['sentry-hook-signature'] || ''
    const resourceType = req.headers['sentry-hook-resource'] || ''
    const requestId = req.headers['request-id'] || ''

    // 验证签名
    if (!verifySignature(req.body, signature, secret)) {
      return res.status(401).json({ error: '签名验证失败' })
    }

    // 获取操作类型
    const action = req.body.action || 'unknown'

    // 格式化消息
    const message = formatSentryMessage(req.body, resourceType, action, sentryBaseUrl)

    // 发送到企业微信机器人
    const bot = new WeWorkBot(webhookUrl, chatId)
    const result = await bot.sendMessage(message)

    if (result) {
      console.log(`消息发送成功 - Request ID: ${requestId}`)
      res.json({ status: 'success', message: '消息已发送' })
    } else {
      console.log(`消息发送失败 - Request ID: ${requestId}`)
      res.status(500).json({ error: '消息发送失败' })
    }

  } catch (error) {
    console.error('处理 webhook 时出错:', error)
    res.status(500).json({ error: '内部服务器错误' })
  }
})

app.get('/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() })
})

// 错误处理中间件
app.use((err, req, res, next) => {
  console.error('服务器错误:', err)
  res.status(500).json({ error: '服务器内部错误' })
})

// 404 处理
app.use((req, res) => {
  res.status(404).json({ error: '未找到请求的资源' })
})

// 启动服务器
app.listen(PORT, () => {
  console.log(`🚀 Sentry 到企业微信机器人 webhook 服务已启动`)
  console.log(`📍 端口: ${PORT}`)
  console.log(`🔧 调试模式: ${process.env.DEBUG === 'true'}`)
  console.log(`📡 Webhook 端点: http://localhost:${PORT}/webhook`)
  console.log(`💚 健康检查: http://localhost:${PORT}/health`)
  console.log('')
  console.log('📋 当前配置:')
  console.log(`  企业微信 Webhook: ${process.env.WEWORK_WEBHOOK_URL ? '✅ ' + process.env.WEWORK_WEBHOOK_URL.substring(process.env.WEWORK_WEBHOOK_URL.indexOf('=') + 1) : '❌ 未配置'}`)
  console.log(`  群聊 ID: ${process.env.WEWORK_CHAT_ID ? '✅ ' + process.env.WEWORK_CHAT_ID : '❌ 未配置'}`)
  console.log(`  签名验证: ${process.env.SENTRY_WEBHOOK_SECRET ? '✅ 已配置' : '❌ 未配置'}`)
  const { DEFAULT_SENTRY_BASE_URL } = require('./templates/constants')
  console.log(`  Sentry 基础 URL: ${process.env.SENTRY_BASE_URL || DEFAULT_SENTRY_BASE_URL + ' (默认)'}`)
  console.log('')
})

// 优雅关闭
process.on('SIGTERM', () => {
  console.log('收到 SIGTERM 信号，正在关闭服务器...')
  process.exit(0)
})

process.on('SIGINT', () => {
  console.log('收到 SIGINT 信号，正在关闭服务器...')
  process.exit(0)
})
