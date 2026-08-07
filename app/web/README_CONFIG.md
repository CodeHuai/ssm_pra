# 前端项目配置说明

## 已完成的基础搭建

### 1. 依赖安装
- ✅ **axios** - HTTP 请求库
- ✅ **element-plus** - Vue 3 UI 组件库
- ✅ **@element-plus/icons-vue** - Element Plus 图标库
- ✅ **vue-router@4** - Vue 路由

### 2. 项目结构

```
src/
├── api/              # API 接口目录
│   ├── index.js      # 通用请求方法（get, post, put, delete, upload, download）
│   └── example.js    # 示例 API 接口
├── utils/            # 工具函数
│   └── request.js    # axios 封装（拦截器、错误处理）
├── views/            # 页面组件
│   └── ExampleView.vue  # 示例页面
├── router/           # 路由配置
│   └── index.js
├── App.vue           # 根组件
└── main.js           # 入口文件
```

### 3. 功能特性

#### Axios 封装特性
- ✅ 请求/响应拦截器
- ✅ 统一错误处理
- ✅ Token 认证支持
- ✅ 文件上传支持
- ✅ 文件下载支持
- ✅ 超时处理

#### Element Plus 集成
- ✅ 完整引入
- ✅ 中文语言包
- ✅ 全局图标注册

### 4. 环境配置

默认后端 API 地址已配置为 `http://localhost:9991`（端口 9991）

如需修改，创建 `.env.local` 文件覆盖：

```env
VITE_API_BASE_URL=http://localhost:9991
```

### 5. 使用示例

#### API 调用
```javascript
import { get, post, upload } from '@/api/api'

// GET 请求
const data = await get('/user/list', { page: 1, size: 10 })

// POST 请求
const result = await post('/user/create', { username: 'test' })

// 文件上传
const formData = new FormData()
formData.append('file', file)
await upload('/file/upload', formData, (progress) => {
  console.log('上传进度：', progress)
})
```

#### Element Plus 组件使用
所有组件和图标已全局注册，可直接使用：

```vue
<template>
  <el-button type="primary">
    <el-icon><Check></Check></el-icon>
    按钮
  </el-button>
</template>
```

### 6. 启动项目

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 预览生产构建
npm run preview
```

### 7. 下一步

根据实际后端接口修改 `src/api/example.js` 中的接口地址和参数。

### 8. 后端接口对接

确保后端接口返回格式为：

```json
{
  "code": 200,
  "message": "success",
  "data": {}
}
```

如果后端返回格式不同，请修改 `src/utils/request.js` 中的响应拦截器处理逻辑。
