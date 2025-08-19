# Sentry 到企业微信机器人 Webhook

这是一个将 Sentry 通知转发到企业微信机器人的 webhook 服务，使用 Node.js 实现。

## 功能特性

- 接收 Sentry webhook 通知
- 支持所有 Sentry webhook 类型：
  - [**Issue Alerts** (`event_alert`) - 事件告警](https://docs.sentry.io/organization/integrations/integration-platform/webhooks/event-alerts/)
  - [**Metric Alerts** (`metric_alert`) - 指标告警](https://docs.sentry.io/organization/integrations/integration-platform/webhooks/metric-alerts/)
  - [**Issues** (`issue`) - 问题事件](https://docs.sentry.io/organization/integrations/integration-platform/webhooks/issues/)
  - [**Comments** (`comment`) - 评论](https://docs.sentry.io/organization/integrations/integration-platform/webhooks/comments/)
  - [**Errors** (`error`) - 错误](https://docs.sentry.io/organization/integrations/integration-platform/webhooks/errors/)
  - [**Installation** (`installation`) - 安装](https://docs.sentry.io/organization/integrations/integration-platform/webhooks/installation/)
- 自动格式化消息为企业微信机器人支持的卡片格式（template_card）
- 模块化模板系统，易于维护和扩展
- 支持签名验证
- 支持指定群聊 ID
- 健康检查端点

## 安装和配置

### 1. 安装依赖

```bash
npm install
```

### 2. 配置环境变量

复制 `env.example` 为 `.env` 并填写配置：

```bash
cp env.example .env
```

编辑 `.env` 文件：

```env
# 企业微信机器人配置
WEWORK_WEBHOOK_URL=https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=YOUR_WEBHOOK_KEY
WEWORK_CHAT_ID=your_chat_id

# Sentry 配置
SENTRY_WEBHOOK_SECRET=your_sentry_webhook_secret
SENTRY_BASE_URL=https://sentry.io

# 应用配置
PORT=3000
DEBUG=false

# 模板配置
SENTRY_ICON_URL=https://sentry.io/static/favicon-46f8676a36982f8eb852ac6860387755.ico
```

### 3. 获取企业微信机器人 webhook URL

1. 在企业微信群中添加机器人
2. 获取机器人的 webhook URL
3. 将 URL 填入 `WEWORK_WEBHOOK_URL` 环境变量

### 4. 获取群 ID（可选）

如果需要发送到特定群聊，可以设置 `WEWORK_CHAT_ID`。

## 运行服务

```bash
# 生产环境
npm start

# 开发环境（自动重启）
npm run dev
```

服务将在 `http://localhost:3000` 启动（默认端口 3000，如果被占用会自动使用其他端口）。

## 测试

运行测试脚本来验证 webhook 功能：

```bash
# 基础测试（issue 类型）
npm test

# 事件告警测试
npm run test:event-alert

# 所有类型测试
npm run test:all
```

测试脚本会：
1. 检查服务健康状态
2. 发送模拟的 Sentry 数据到 webhook
3. 验证响应
4. 显示测试结果摘要

## API 端点

### POST /webhook

接收 Sentry webhook 通知。

**请求头要求：**
- `Content-Type: application/json`
- `Sentry-Hook-Signature`: 签名（如果配置了密钥）
- `Sentry-Hook-Resource`: 资源类型
- `Request-ID`: 请求 ID

### GET /health

健康检查端点。

## Sentry 配置

在 Sentry 中配置 webhook：

1. 进入 Sentry 组织设置
2. 选择 "Integrations" > "Integration Platform"
3. 创建新的 webhook 集成
4. 设置 webhook URL 为：`http://your-domain.com/webhook`
5. 配置需要的事件类型（issue、event_alert、metric_alert 等）

## 模板系统

项目使用模块化的模板系统，所有模板文件位于 `templates/` 目录中：

- `templates/index.js` - 模板索引文件
- `templates/issue.js` - 问题通知模板
- `templates/event-alert.js` - 事件告警模板
- `templates/metric-alert.js` - 指标告警模板
- `templates/comment.js` - 评论通知模板
- `templates/error.js` - 错误通知模板
- `templates/installation.js` - 集成安装模板
- `templates/generic.js` - 通用通知模板

### 企业微信卡片格式

所有通知都使用企业微信的 `template_card` 消息类型，提供：

- 清晰的信息层次结构
- 丰富的元数据显示
- 可点击的链接和动作
- 统一的视觉风格

详细说明请参考：[templates/README.md](templates/README.md)

## 消息格式示例

### Issue Alert (事件告警) 示例

企业微信卡片格式，包含：
- 告警级别和触发规则
- 事件ID和错误位置
- 环境信息（浏览器、操作系统）
- 可点击的详情链接

### Metric Alert (指标告警) 示例

企业微信卡片格式，包含：
- 告警状态和操作类型
- 规则名称和聚合方式
- 查询条件和描述信息
- 可点击的告警链接

### Issue (问题) 示例

企业微信卡片格式，包含：
- 问题级别和操作类型
- 项目名称和问题详情
- 首次/最后出现时间和次数
- 可点击的问题链接

### Comment (评论) 示例

企业微信卡片格式，包含：
- 项目名称和操作类型
- 评论者和问题标题
- 评论内容预览
- 可点击的问题链接

### Error (错误) 示例

企业微信卡片格式，包含：
- 错误级别和操作类型
- 事件ID和错误位置
- 环境信息（浏览器、操作系统）
- 可点击的错误链接

## 部署

### Docker 部署

项目已包含 `Dockerfile`，构建和运行：

```bash
docker build -t sentry-wework-bot .
docker run -p 5000:5000 --env-file .env sentry-wework-bot
```

### 使用 ngrok 进行本地测试

```bash
# 安装 ngrok
# 启动服务
npm start

# 在另一个终端启动 ngrok
ngrok http 3000

# 使用 ngrok 提供的 URL 配置 Sentry webhook
```

## 故障排除

### 常见问题

1. **消息发送失败**
   - 检查企业微信机器人 webhook URL 是否正确
   - 确认机器人有发送消息的权限

2. **签名验证失败**
   - 检查 `SENTRY_WEBHOOK_SECRET` 是否与 Sentry 配置一致
   - 如果不使用签名验证，可以留空

3. **服务无法启动**
   - 检查端口是否被占用
   - 确认 Node.js 版本 >= 22.0.0
   - 确认所有依赖已正确安装：`npm install`

### 日志

服务会输出详细的日志信息，包括：
- 接收到的 webhook 请求
- 消息发送状态
- 错误信息

## 许可证

MIT License
