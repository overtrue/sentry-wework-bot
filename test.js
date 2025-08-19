const axios = require('axios')
const fs = require('fs')
const path = require('path')

// 测试配置
const WEBHOOK_URL = 'http://localhost:3000/webhook'
const TEST_DATA_DIR = './test-data'

// 从test-data目录读取所有测试数据
function loadTestData() {
  const testData = {}

  try {
    const files = fs.readdirSync(TEST_DATA_DIR)

    files.forEach(file => {
      if (file.endsWith('.json')) {
        const type = file.replace('.json', '')
        const filePath = path.join(TEST_DATA_DIR, file)
        const content = fs.readFileSync(filePath, 'utf8')

        try {
          testData[type] = JSON.parse(content)
          console.log(`📁 已加载测试数据: ${type}`)
        } catch (parseError) {
          console.error(`❌ 解析 ${file} 失败:`, parseError.message)
        }
      }
    })

    return testData
  } catch (error) {
    console.error('❌ 读取测试数据目录失败:', error.message)
    return {}
  }
}

// 测试单个webhook类型
async function testWebhookType(type, data) {
  try {
    console.log(`🧪 测试 ${type} webhook...`)

    const response = await axios.post(WEBHOOK_URL, data, {
      headers: {
        'Content-Type': 'application/json',
        'Sentry-Hook-Resource': type.replace(/-/g, '_'),
        'Sentry-Hook-Signature': 'test-signature',
        'Request-ID': `test-${type}-request-id`
      },
      timeout: 10000 // 10秒超时
    })

    console.log(`✅ ${type} 测试成功! 状态码: ${response.status}`)
    return true

  } catch (error) {
    console.error(`❌ ${type} 测试失败:`)
    if (error.response) {
      console.error(`  状态码: ${error.response.status}`)
      console.error(`  响应数据: ${JSON.stringify(error.response.data, null, 2)}`)
    } else if (error.code === 'ECONNREFUSED') {
      console.error(`  连接被拒绝，请确保服务正在运行`)
    } else if (error.code === 'ETIMEDOUT') {
      console.error(`  请求超时`)
    } else {
      console.error(`  错误信息: ${error.message}`)
    }
    return false
  }
}

// 检查服务健康状态
async function checkHealth() {
  try {
    const response = await axios.get('http://localhost:3000/health', { timeout: 5000 })
    console.log('💚 服务健康检查通过:', response.data)
    return true
  } catch (error) {
    if (error.code === 'ECONNREFUSED') {
      console.error('💔 服务未运行，请先启动服务: npm start')
    } else {
      console.error('💔 服务健康检查失败:', error.message)
    }
    return false
  }
}

// 运行所有测试
async function runAllTests() {
  console.log('🚀 开始运行所有 webhook 类型测试...\n')

  // 加载测试数据
  const testData = loadTestData()
  if (Object.keys(testData).length === 0) {
    console.error('❌ 没有找到测试数据，请检查 test-data 目录')
    return
  }

  console.log('')

  // 检查服务健康状态
  const isHealthy = await checkHealth()
  if (!isHealthy) {
    console.log('\n请确保服务正在运行后再试')
    return
  }

  console.log('')

  // 测试所有类型
  const results = {}
  for (const [type, data] of Object.entries(testData)) {
    results[type] = await testWebhookType(type, data)
    console.log('') // 空行分隔
  }

  // 显示测试结果摘要
  console.log('📊 测试结果摘要:')
  console.log('='.repeat(50))
  for (const [type, success] of Object.entries(results)) {
    const status = success ? '✅ 通过' : '❌ 失败'
    console.log(`${type.padEnd(20)} ${status}`)
  }

  const totalTests = Object.keys(results).length
  const passedTests = Object.values(results).filter(Boolean).length
  console.log('='.repeat(50))
  console.log(`总计: ${totalTests} 个测试, 通过: ${passedTests} 个, 失败: ${totalTests - passedTests} 个`)
}

// 测试单个类型
async function testSingleType(type) {
  const testData = loadTestData()

  if (!testData[type]) {
    console.error(`❌ 未找到 ${type} 的测试数据`)
    return
  }

  console.log(`🧪 测试单个类型: ${type}`)
  const result = await testWebhookType(type, testData[type])

  if (result) {
    console.log(`✅ ${type} 测试完成`)
  } else {
    console.log(`❌ ${type} 测试失败`)
  }
}

// 显示可用的测试类型
function showAvailableTypes() {
  const testData = loadTestData()
  const types = Object.keys(testData)

  console.log('📋 可用的测试类型:')
  types.forEach((type, index) => {
    console.log(`  ${index + 1}. ${type}`)
  })
  console.log('')
  console.log('使用方法:')
  console.log('  node test.js                    # 运行所有测试')
  console.log('  node test.js event-alert        # 测试单个类型')
  console.log('  node test.js --list            # 显示所有类型')
}

// 主函数
async function main() {
  const args = process.argv.slice(2)

  if (args.length === 0) {
    // 运行所有测试
    await runAllTests()
  } else if (args[0] === '--list' || args[0] === '-l') {
    // 显示可用类型
    showAvailableTypes()
  } else {
    // 测试单个类型
    const type = args[0]
    await testSingleType(type)
  }
}

// 运行测试
if (require.main === module) {
  main().catch(error => {
    console.error('❌ 测试运行失败:', error.message)
    process.exit(1)
  })
}

module.exports = {
  testWebhookType,
  checkHealth,
  runAllTests,
  loadTestData,
  testSingleType
}
