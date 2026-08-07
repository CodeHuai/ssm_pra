import request from '@/utils/request'

/**
 * 通用 GET 请求
 * @param {string} url - 请求地址
 * @param {object} params - 请求参数
 * @returns {Promise}
 */
export function get(url, params) {
  return request({
    url,
    method: 'get',
    params
  })
}

/**
 * 通用 POST 请求
 * @param {string} url - 请求地址
 * @param {object} data - 请求体数据
 * @returns {Promise}
 */
export function post(url, data) {
  return request({
    url,
    method: 'post',
    data
  })
}

/**
 * 通用 PUT 请求
 * @param {string} url - 请求地址
 * @param {object} data - 请求体数据
 * @returns {Promise}
 */
export function put(url, data) {
  return request({
    url,
    method: 'put',
    data
  })
}

/**
 * 通用 DELETE 请求
 * @param {string} url - 请求地址
 * @param {object} params - 请求参数
 * @returns {Promise}
 */
export function del(url, params) {
  return request({
    url,
    method: 'delete',
    params
  })
}

/**
 * 文件上传
 * @param {string} url - 上传地址
 * @param {FormData} formData - 表单数据
 * @param {function} onProgress - 上传进度回调
 * @returns {Promise}
 */
export function upload(url, formData, onProgress) {
  return request({
    url,
    method: 'post',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    onUploadProgress: progressEvent => {
      if (onProgress && progressEvent.total) {
        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total)
        onProgress(percentCompleted)
      }
    }
  })
}

/**
 * 文件下载
 * @param {string} url - 下载地址
 * @param {object} params - 请求参数
 * @param {string} filename - 下载文件名
 */
export function download(url, params, filename) {
  return request({
    url,
    method: 'get',
    params,
    responseType: 'blob'
  }).then(response => {
    const blob = new Blob([response])
    const link = document.createElement('a')
    link.href = window.URL.createObjectURL(blob)
    link.download = filename || 'download'
    link.click()
    window.URL.revokeObjectURL(link.href)
    return response
  })
}