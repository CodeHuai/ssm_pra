# API 调用规范

## 错误处理原则

**错误统一在拦截器中处理，业务代码不需要关心错误提示**

## 正确的调用方式

### ✅ 推荐：不处理错误

```javascript
import { getUserList } from '@/api/example'

// 直接调用，错误由拦截器统一处理
async function loadData() {
  const result = await getUserList({ page: 1 })
  // 只有成功时才会执行到这里
  console.log('用户列表：', result.data)
}
```

### ✅ 可选：需要处理成功后的逻辑

```javascript
async function handleSubmit() {
  try {
    const result = await createUser(formData)
    // 只有成功时才会执行
    ElMessage.success('创建成功')
    router.push('/user/list')
  } catch (error) {
    // 错误已在拦截器中显示，这里只需要处理成功后的逻辑
    // 这个 catch 块实际上不会执行，因为拦截器已经处理了错误
  }
}
```

### ❌ 不推荐：重复显示错误提示

```javascript
// 不要这样做！错误已经在拦截器中显示了
async function badExample() {
  try {
    const result = await getUserList()
  } catch (error) {
    // ❌ 不要再次显示错误提示
    ElMessage.error('获取用户列表失败')
  }
}
```

## 错误处理流程

1. **请求发送** → 请求拦截器添加 token
2. **响应接收** → 响应拦截器检查状态码
3. **错误发生** → 拦截器显示错误提示 + 返回 rejected Promise
4. **业务代码** → 不会执行到 catch 块（因为 Promise 已被 reject）

## 注意事项

- ⚠️ 错误消息已经在拦截器中统一显示
- ⚠️ 业务代码不需要再 `catch` 和显示错误
- ⚠️ 如果需要处理成功后的逻辑，直接在 `await` 后编写即可
- ⚠️ 401 错误会自动跳转到登录页
