# SSM 家具管理系统（ssm_pra）

一个基于 **SSM（Spring + SpringMVC + MyBatis）** 后端 + **Vue 3** 前端的前后端分离练手项目，围绕"家具（furn）"做完整的增删改查：分页查询、条件搜索、图片上传、统一返回。

> 这是一个 SSM 框架的**学习/实践项目**，代码结构清晰、配置带中文注释，适合用来理解 SSM 的装配方式、父子容器、事务、分页、文件上传、前后端联调等核心知识点。

---

## 技术栈

### 后端
| 组件 | 版本 | 说明 |
|---|---|---|
| JDK | 8 | `maven.compiler.source/target = 8` |
| Spring + SpringMVC | 5.3.8 | `spring-webmvc` |
| Spring JDBC / Aspects | 5.3.8 | 事务、AOP |
| MyBatis | 3.5.7 | ORM |
| mybatis-spring | 2.0.6 | MyBatis 整合 Spring 适配包 |
| PageHelper | 5.2.1 | 物理分页插件 |
| Druid | 1.2.6 | 数据库连接池 |
| MySQL Connector | 5.1.49 | 适配 MySQL 5.7 |
| Jackson | 2.12.4 | JSON 序列化 |
| Lombok / Hibernate Validator | 1.18.30 / 6.1.0 | 简化 POJO / 参数校验 |
| 运行容器 | Tomcat 9（Servlet 4.0） | 端口 **9991** |
| 打包 | war | |

### 前端（`app/web`）
| 组件 | 版本 |
|---|---|
| Vue | 3.5 |
| Vue Router | 4 |
| Element Plus | 2.14 |
| Axios | 1.19 |
| Vite | 8（构建/开发服务器，端口 **5173**） |

---

## 功能特性

- 📋 **家具 CRUD**：新增、修改、删除、查看详情。
- 🔍 **分页 + 条件搜索**：名称下拉（选项来自全量数据）、品牌模糊输入，PageHelper 物理分页。
- 🖼️ **图片上传**：弹框内上传图片并预览，列表展示缩略图（可放大），`img_path` 存 URL。
- 📦 **统一返回**：所有接口返回 `Msg { code, msg, data }`，前端 axios 拦截器统一处理。
- 🔁 **前后端分离**：Vite 开发服务器通过代理 `/api → :9991` 转发，CORS 已在后端配置。

---

## 项目结构

```
ssm_pra/
├── pom.xml                          # Maven 依赖与构建（war 包）
├── sql/
│   └── furns_ssm.sql                # 建库建表 + 初始数据
├── docs/
│   └── 图片上传实现指南.md            # 图片上传后端实现教程
├── src/main/
│   ├── java/com/huai/ssm/
│   │   ├── bean/                    # FurnBean(实体) / Msg(统一返回)
│   │   ├── controller/              # FurnController / UploadFileController
│   │   ├── mapper/                  # FurnMapper(MyBatis 接口)
│   │   └── service/ (+impl/)        # 业务层
│   ├── resources/
│   │   ├── applicationContext.xml   # Spring 父容器：数据源/MyBatis/事务
│   │   ├── springmvc.xml            # SpringMVC 子容器：Controller/上传/CORS
│   │   ├── mybatis-config.xml       # MyBatis 配置（PageHelper 等）
│   │   ├── mapper/furnMapper.xml    # SQL 映射
│   │   ├── jdbc.properties          # 数据库连接
│   │   ├── upload.properties        # 图片上传路径/URL 前缀
│   │   └── log4j.properties         # 日志
│   └── webapp/WEB-INF/web.xml       # Servlet/Tomcat 配置（含 multipart）
└── app/web/                         # Vue 3 前端
    ├── vite.config.js               # 代理 /api → http://localhost:9991
    ├── .env.development             # VITE_API_BASE_URL=/api
    └── src/
        ├── api/                     # 接口封装（furn.js / index.js）
        ├── views/ExampleView.vue    # 主页面（搜索+表格+弹框+上传）
        ├── utils/request.js         # axios 实例 + 拦截器
        └── router/                  # 路由
```

---

## 快速开始

### 前置环境
- JDK 8、Maven 3.6+、MySQL 5.7、Tomcat 9
- Node.js 18+（前端）

### 1. 准备数据库
```bash
# 登录 MySQL，创建库并导入
CREATE DATABASE furns_ssm DEFAULT CHARACTER SET utf8mb4;
USE furns_ssm;
SOURCE sql/furns_ssm.sql;
```
表 `furn`：`id, name, marker, price, sales, stock, img_path`。
> 如你的 MySQL 账号/密码不是 `root/123456`，改 `src/main/resources/jdbc.properties`。

### 2. 启动后端（IDEA + Tomcat）
1. IDEA 打开本项目，Maven 自动下载依赖。
2. 配置 Run → Edit Configurations → Tomcat Server / Local：
   - 部署 artifact：`ssm_pra:war exploded`
   - Application context 建议设为 `/`（前端代理按 `http://localhost:9991` 转发）
   - HTTP 端口设为 **9991**（与 `vite.config.js`、`upload.properties` 对齐）
3. 启动 Tomcat，控制台出现 `Artifact ssm_pra:war exploded deployed successfully` 即成功。

### 3. 启动前端
```bash
cd app/web
npm install
npm run dev      # 默认 http://localhost:5173
```
浏览器打开 `http://localhost:5173` 即可看到页面。前端 `/api/**` 请求会被 Vite 代理到后端 `:9991`。

---

## 接口一览（`@RequestMapping("/api")`）

所有接口返回统一结构 `Msg { code, msg, data }`，`code=200` 为成功。

| 方法 | 路径 | 参数 | 说明 |
|---|---|---|---|
| POST | `/api/addFurn` | body: FurnBean | 新增家具 |
| GET | `/api/getAll` | — | 全量查询（`data.list` / `data.total`） |
| POST | `/api/furnPage` | query: pageNum, pageSize[, name, marker] | 分页+条件搜索 |
| POST | `/api/modifyFurn` | body: FurnBean(含 id) | 修改家具 |
| GET | `/api/getFurnDetailById/{id}` | path: id | 查询详情（`data.detail`） |
| GET | `/api/removeFurnById/{id}` | path: id | 删除家具 |
| POST | `/api/file/upload` | multipart: file | 图片上传，返回 `data.url` |

> 详细字段与前后端联调约定见 `app/web/API_USAGE.md`；图片上传后端实现见 `docs/图片上传实现指南.md`。

---

## 配置文件说明（SSM 的"父子双容器"）

| 文件 | 归属 | 职责 |
|---|---|---|
| `web.xml` | Tomcat/Servlet | 启动接线、DispatcherServlet、multipart 上传限制 |
| `applicationContext.xml` | **Spring 父容器** | 数据源、MyBatis、Service、事务（业务/数据层） |
| `springmvc.xml` | **SpringMVC 子容器** | Controller、文件上传解析器、静态资源、CORS（Web 层） |
| `mybatis-config.xml` | MyBatis | 设置、PageHelper 插件 |
| `jdbc.properties` | 外部化值 | 数据库连接 |
| `upload.properties` | 外部化值 | 上传目录 / URL 前缀 |

> 关键原则：**子容器能看到父容器，父看不到子**；`@Controller` 归子容器扫，`@Service/@Repository` 归父容器扫。

---

## 常见问题

| 现象 | 原因 / 解决 |
|---|---|
| 前端调接口 404 / 连不上 | 后端未启动，或端口不是 9991（检查 Tomcat 端口与 `vite.config.js` 代理目标） |
| 前端跨域被拦 | 后端 CORS 只放了 `http://localhost:5173`，端口不符改 `springmvc.xml` |
| 接口返回中文乱码 | `web.xml` 的 `CharacterEncodingFilter` 已配 UTF-8；DB 要用 utf8mb4 |
| 上传文件 413/丑陋报错 | 超过 `web.xml` 的 `max-file-size`（5MB），调大或前端限制 |
| 图片传上去 `<img>` 404 | 未配 `<mvc:resources mapping="/upload/**">`，或 `upload.dir` 目录不存在 |
| IDEA 报 `Cannot resolve ${...}` | web.xml 由 Tomcat 先解析，不能用 `${}`；springmvc.xml 里的占位符报红是误报，忽略 |

---

## 相关文档
- `docs/图片上传实现指南.md` — 图片上传后端实现（Servlet 3.0 方案）完整教程
- `app/web/README.md` / `README_CONFIG.md` / `API_USAGE.md` — 前端说明与接口用法

---

## 学习要点（这个项目能练到什么）
- SSM 三大框架整合、**父子双容器**装配
- `@RequestMapping` / `@RequestParam` / `@PathVariable` / `@RequestBody` 的区别与对接
- MyBatis 动态 SQL `<where>/<if>`、`${}` vs `#{}`、 resultMap/驼峰映射
- PageHelper 物理分页、统一返回 `Msg`、全局异常处理
- Servlet 3.0 文件上传、静态资源映射、外部化配置
- 前后端分离：Vite 代理、axios 拦截器、Element Plus 表格/弹框/上传组件
