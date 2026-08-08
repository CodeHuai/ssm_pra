import {get, post} from '@/api/index.js'
import request from '@/utils/request'

/**
 * 家具(furn) 相关接口
 * 对应后端 FurnController: 类上 @RequestMapping("/api")
 *
 * 字段与 furnMapper.xml 的 insert save 对齐：
 *   name, marker, price, sales, stock, imgPath(对应数据库列 img_path)
 */

// 新增家具 —— POST /api/addFurn
export function addFurn(data) {
    return post('/addFurn', data)
}

// 查询全部家具 —— GET /api/getAll
// 返回: { code, msg, data: { list: [...], total: 数量 } }
export function getAllFurn() {
    return get('/getAll')
}

// 分页查询家具 —— POST /api/furnPage
// ⚠️ 后端用 @RequestParam 接收，参数走 url query（params），不能放请求体。
// name / marker 为搜索条件（可选，为空则不带这个参数）。
// 返回: { code, msg, data: { list, total, pageNum, pageSize, pages } }
export function getFurnPage({pageNum, pageSize, name, marker} = {}) {
    const params = {pageNum, pageSize}
    if (name) params.name = name
    if (marker) params.marker = marker
    return request({
        url: '/furnPage',
        method: 'post',
        params
    })
}

// 修改家具 —— POST /api/modifyFurn
// 后端: @RequestBody FurnBean（需带 id），返回 data.detail 为更新后的对象
export function updateFurn(data) {
    return post('/modifyFurn', data)
}

// 删除家具 —— GET /api/removeFurnById/{id}
// 注意：后端是 GET + 路径参数 {id}（不是 DELETE，也不是 query）
export function deleteFurn(id) {
    return get(`/removeFurnById/${id}`)
}

// 查询家具详情 —— GET /api/getFurnDetailById/{id}
// 返回: { code, msg, data: { detail: FurnBean } }
export function getFurnDetail(id) {
    return get(`/getFurnDetailById/${id}`)
}
