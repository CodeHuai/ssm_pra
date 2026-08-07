import {get, post, put, del, upload} from '@/api/index.js'

/**
 * 示例 API 接口
 * 根据实际后端接口修改这些方法
 */

// 获取用户列表
export function getUserList(params) {
    return get('/user/list', params)
}

// 获取用户详情
export function getUserDetail(id) {
    return get(`/user/${id}`)
}

// 创建用户
export function createUser(data) {
    return post('/user/create', data)
}

// 更新用户
export function updateUser(id, data) {
    return put(`/user/${id}`, data)
}

// 删除用户
export function deleteUser(id) {
    return del(`/user/${id}`)
}

// 文件上传示例
export function uploadFile(formData, onProgress) {
    return upload('/file/upload', formData, onProgress)
}