import {post} from '@/api/index.js'

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
