# 测试说明

## 测试脚本

现在只有一个统一的测试脚本 `test.js`，它可以从 `test-data` 目录读取所有测试数据。

## 使用方法

### 1. 运行所有测试
```bash
node test.js
```

### 2. 测试单个类型
```bash
node test.js event-alert
node test.js metric-alert
node test.js issue
node test.js comment
node test.js error
node test.js installation
```

### 3. 查看可用的测试类型
```bash
node test.js --list
# 或者
node test.js -l
```

## 测试数据类型

测试数据存储在 `test-data/` 目录中，包含以下类型：

- **event-alert.json** - 事件告警测试数据
- **metric-alert.json** - 指标告警测试数据
- **issue.json** - 问题创建测试数据
- **comment.json** - 评论创建测试数据
- **error.json** - 错误创建测试数据
- **installation.json** - 安装创建测试数据

## 添加新的测试数据

1. 在 `test-data/` 目录中创建新的 JSON 文件
2. 文件名格式：`{类型名}.json`
3. 确保 JSON 格式正确
4. 重启测试脚本即可自动加载

## 注意事项

- 运行测试前请确保服务已启动 (`npm start`)
- 测试脚本会自动检查服务健康状态
- 每个测试都有 10 秒超时设置
- 测试结果会显示详细的成功/失败信息

## 示例输出

```
🚀 开始运行所有 webhook 类型测试...

📁 已加载测试数据: event-alert
📁 已加载测试数据: metric-alert
📁 已加载测试数据: issue
📁 已加载测试数据: comment
📁 已加载测试数据: error
📁 已加载测试数据: installation

💚 服务健康检查通过: { status: 'ok' }

🧪 测试 event-alert webhook...
✅ event-alert 测试成功! 状态码: 200

🧪 测试 metric-alert webhook...
✅ metric-alert 测试成功! 状态码: 200

📊 测试结果摘要:
==================================================
event-alert           ✅ 通过
metric-alert          ✅ 通过
issue                 ✅ 通过
comment               ✅ 通过
error                 ✅ 通过
installation          ✅ 通过
==================================================
总计: 6 个测试, 通过: 6 个, 失败: 0 个
```
