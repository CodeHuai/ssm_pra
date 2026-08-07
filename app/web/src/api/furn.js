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
// ⚠️ 后端用 @RequestParam 接收，参数必须放在 url query（params），
//    不能放进请求体（data），否则后端拿不到会报错。
// 返回: { code, msg, data: { list, total, pageNum, pageSize, pages } }
export function getFurnPage(pageNum, pageSize) {
    return request({
        url: '/furnPage',
        method: 'post',
        params: {pageNum, pageSize}
    })
}
