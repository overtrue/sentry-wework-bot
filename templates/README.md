# Sentry 企业微信机器人模板

本目录包含了所有 Sentry 通知的模板文件，使用企业微信的卡片形式展示。

## 模板文件结构

- `index.js` - 模板索引文件，统一导出所有模板函数
- `issue.js` - 问题通知模板
- `event-alert.js` - 事件告警模板
- `metric-alert.js` - 指标告警模板
- `comment.js` - 评论通知模板
- `error.js` - 错误通知模板
- `installation.js` - 集成安装模板
- `generic.js` - 通用通知模板

## 企业微信卡片格式

所有模板都使用企业微信的 `template_card` 消息类型，包含以下特性：

### 卡片类型
- `text_notice` - 文本通知卡片

### 主要组件
- `source` - 来源信息（图标和描述）
- `main_title` - 主标题和副标题
- `horizontal_content_list` - 水平内容列表（键值对）
- `jump_list` - 跳转链接列表
- `card_action` - 卡片点击动作
- `emphasis_content` - 强调内容

### 样式特点
- 清晰的信息层次结构
- 丰富的元数据显示
- 可点击的链接和动作
- 统一的视觉风格

## 使用方法

```javascript
const { formatSentryMessage } = require('./templates')

// 格式化消息
const message = formatSentryMessage(data, resourceType, action)

// 发送消息（自动处理卡片格式）
await bot.sendMessage(message)
```

## 自定义模板

如需添加新的模板类型：

1. 在 `templates/` 目录下创建新的模板文件
2. 实现格式化函数
3. 在 `index.js` 中添加新的 case 分支
4. 导出新函数

## 企业微信官方文档

参考：[企业微信机器人消息类型](https://developer.work.weixin.qq.com/document/path/91770#%E6%96%87%E6%9C%AC%E9%80%9A%E7%9F%A5%E6%A8%A1%E7%89%88%E5%8D%A1%E7%89%87)
