import axios from 'axios'
import {ElMessage} from 'element-plus'

// 创建 axios 实例
const service = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL, // 后端接口地址
    timeout: 30000, // 请求超时时间
    withCredentials: true // 携带 cookie
})

// 请求拦截器
service.interceptors.request.use(config => {
    // 从 localStorage 获取 token
    const token = localStorage.getItem('token')
    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`
    }
    return config
}, error => {
    console.error('请求错误：', error)
    // 统一处理错误，不再抛出
    return Promise.reject(error)
})

// 响应拦截器
service.interceptors.response.use(response => {
    const res = response.data

    // 根据后端返回的状态码处理
    if (res.code && res.code !== 200) {
        ElMessage({
            message: res.message || '请求失败',
            type: 'error',
            duration: 5 * 1000
        })

        // 401: 未授权，跳转登录页
        if (res.code === 401) {
            localStorage.removeItem('token')
            window.location.href = '/login'
        }

        // 返回失败的 Promise，阻止业务代码继续执行
        return Promise.reject(new Error(res.message || '请求失败'))
    }

    return res
}, error => {
    console.error('响应错误：', error)

    let message = '网络错误'
    if (error.response) {
        switch (error.response.status) {
            case 400:
                message = '请求错误'
                break
            case 401:
                message = '未授权，请登录'
                localStorage.removeItem('token')
                window.location.href = '/login'
                break
            case 403:
                message = '拒绝访问'
                break
            case 404:
                message = '请求地址不存在'
                break
            case 500:
                message = '服务器内部错误'
                break
            default:
                message = error.response.data?.message || '请求失败'
        }
    } else if (error.code === 'ECONNABORTED') {
        message = '请求超时'
    }

    ElMessage({
        message: message,
        type: 'error',
        duration: 5 * 1000
    })

    // 返回失败的 Promise，阻止业务代码继续执行
    return Promise.reject(error)
})

export default service