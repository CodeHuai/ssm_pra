<template>
  <div class="example-container">
    <el-card class="box-card">
      <template #header>
        <div class="card-header">
          <span>Element Plus + Axios 示例</span>
          <el-button type="primary" :icon="Refresh" @click="refreshData">刷新</el-button>
        </div>
      </template>

      <!-- 搜索条件 -->
      <el-form :inline="true" :model="searchForm" class="search-form">
        <el-form-item label="名称">
          <el-select v-model="searchForm.name" placeholder="请选择名称" clearable filterable style="width: 180px">
            <el-option v-for="n in nameOptions" :key="n" :label="n" :value="n"/>
          </el-select>
        </el-form-item>
        <el-form-item label="品牌">
          <el-input v-model="searchForm.marker" placeholder="请输入品牌（模糊）" clearable style="width: 200px"/>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :icon="Search" @click="handleSearch">搜索</el-button>
          <el-button :icon="RefreshLeft" @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>

      <!-- 家具分页表格 -->
      <div class="section-title">
        <span>家具列表（共 {{ furnTotal }} 条）</span>
        <el-button type="primary" :icon="Plus" @click="openDialog('add')">新增</el-button>
      </div>
      <el-table :data="furnList" style="width: 100%" v-loading="furnLoading" stripe>
        <el-table-column prop="id" label="ID" width="80"/>
        <el-table-column prop="name" label="名称"/>
        <el-table-column prop="marker" label="品牌"/>
        <el-table-column prop="price" label="价格"/>
        <el-table-column prop="sales" label="销量"/>
        <el-table-column prop="stock" label="库存"/>
        <el-table-column label="图片" width="100">
          <template #default="scope">
            <el-image
                v-if="scope.row.imgPath"
                :src="scope.row.imgPath"
                :preview-src-list="[scope.row.imgPath]"
                preview-teleported
                fit="cover"
                style="width: 50px; height: 50px; border-radius: 4px"
            />
            <span v-else class="no-img">无</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="220" fixed="right">
          <template #default="scope">
            <el-button size="small" @click="openDialog('view', scope.row)">查看</el-button>
            <el-button size="small" type="primary" @click="openDialog('edit', scope.row)">修改</el-button>
            <el-button size="small" type="danger" @click="handleDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 家具分页 -->
      <el-pagination
          v-model:current-page="furnPageNum"
          v-model:page-size="furnPageSize"
          :page-sizes="[5, 10, 20, 50]"
          :total="furnTotal"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleFurnSizeChange"
          @current-change="handleFurnPageChange"
          style="margin-top: 20px; justify-content: center"
      />
    </el-card>

    <!-- 新增 / 修改 / 查看共用弹框 -->
    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="500px">
      <el-form :model="dialogForm" label-width="90px" :disabled="isView" v-loading="detailLoading">
        <el-form-item label="名称">
          <el-input v-model="dialogForm.name" placeholder="请输入名称"/>
        </el-form-item>
        <el-form-item label="品牌/厂家">
          <el-input v-model="dialogForm.marker" placeholder="请输入品牌/厂家"/>
        </el-form-item>
        <el-form-item label="价格">
          <el-input v-model.number="dialogForm.price" placeholder="请输入价格"/>
        </el-form-item>
        <el-form-item label="销量">
          <el-input v-model.number="dialogForm.sales" placeholder="请输入销量"/>
        </el-form-item>
        <el-form-item label="库存">
          <el-input v-model.number="dialogForm.stock" placeholder="请输入库存"/>
        </el-form-item>
        <el-form-item label="图片">
          <el-upload
              class="img-uploader"
              :action="uploadUrl"
              :show-file-list="false"
              :on-success="handleImgSuccess"
              :before-upload="beforeImgUpload"
              :disabled="isView"
          >
            <img v-if="dialogForm.imgPath" :src="dialogForm.imgPath" class="img-preview" alt="家具图片"/>
            <el-icon v-else class="img-uploader-icon">
              <Plus/>
            </el-icon>
          </el-upload>
          <el-button
              v-if="dialogForm.imgPath && !isView"
              link
              type="danger"
              @click="dialogForm.imgPath = ''"
          >移除图片</el-button>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button v-if="!isView" type="primary" @click="handleDialogSubmit">
          {{ dialogMode === 'add' ? '新增' : '保存' }}
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import {ref, reactive, computed, onMounted} from 'vue'
import {ElMessage, ElMessageBox} from 'element-plus'
import {
  Refresh,
  Plus,
  Search,
  RefreshLeft
} from '@element-plus/icons-vue'
import {addFurn, getAllFurn, getFurnPage, updateFurn, deleteFurn, getFurnDetail} from '@/api/furn'

// 图片上传地址（弹框里家具图片用）
const uploadUrl = ref(import.meta.env.VITE_API_BASE_URL + '/file/upload')

// 搜索条件
const searchForm = reactive({
  name: '',
  marker: ''
})

// 名称下拉选项（来自 /api/getAll 的 list，按 name 去重）
const nameOptions = ref([])
const fetchNameOptions = async () => {
  try {
    const res = await getAllFurn()
    if (res.code === 200) {
      const list = res.data?.list || []
      nameOptions.value = [...new Set(list.map(f => f.name).filter(Boolean))]
    }
  } catch (error) {
    console.error(error)
  }
}

// 搜索 / 重置
const handleSearch = () => {
  furnPageNum.value = 1 // 搜索时回到第一页
  fetchFurnList()
}
const handleReset = () => {
  searchForm.name = ''
  searchForm.marker = ''
  furnPageNum.value = 1
  fetchFurnList()
}

// 家具列表 - 分页（/api/furnPage）
const furnList = ref([])
const furnLoading = ref(false)
const furnTotal = ref(0)
const furnPageNum = ref(1)
const furnPageSize = ref(5)

const fetchFurnList = async () => {
  furnLoading.value = true
  try {
    const res = await getFurnPage({
      pageNum: furnPageNum.value,
      pageSize: furnPageSize.value,
      name: searchForm.name,
      marker: searchForm.marker
    })
    if (res.code === 200) {
      furnList.value = res.data?.list || []
      furnTotal.value = res.data?.total || 0
    }
  } catch (error) {
    console.error(error)
  } finally {
    furnLoading.value = false
  }
}

const handleFurnPageChange = (val) => {
  furnPageNum.value = val
  fetchFurnList()
}
const handleFurnSizeChange = (val) => {
  furnPageSize.value = val
  furnPageNum.value = 1
  fetchFurnList()
}

// ===== 新增 / 修改 / 查看共用弹框 =====
const dialogVisible = ref(false)
const dialogMode = ref('add') // 'add' | 'edit' | 'view'
const detailLoading = ref(false) // 查看时拉详情的 loading
const dialogForm = reactive({
  id: null,
  name: '',
  marker: '',
  price: 0,
  sales: 0,
  stock: 0,
  imgPath: ''
})

const dialogTitle = computed(() => {
  return {add: '新增家具', edit: '修改家具', view: '查看家具'}[dialogMode.value]
})
const isView = computed(() => dialogMode.value === 'view')

// 置空表单（每次打开弹框前都先调一次，避免残留上次数据）
const resetDialogForm = () => {
  dialogForm.id = null
  dialogForm.name = ''
  dialogForm.marker = ''
  dialogForm.price = 0
  dialogForm.sales = 0
  dialogForm.stock = 0
  dialogForm.imgPath = ''
}

// 把一条数据填进弹框表单
const fillDialogForm = (data) => {
  if (!data) return
  dialogForm.id = data.id
  dialogForm.name = data.name
  dialogForm.marker = data.marker
  dialogForm.price = data.price
  dialogForm.sales = data.sales
  dialogForm.stock = data.stock
  dialogForm.imgPath = data.imgPath
}

// 打开弹框：先置空，再按需回填
// 查看 / 修改 → 都走后端 getFurnDetailById 回显；新增 → 留空
const openDialog = async (mode, row = null) => {
  resetDialogForm() // 关键：先清空
  dialogMode.value = mode
  dialogVisible.value = true
  if (row) {
    // 查看 / 修改：走后端详情接口回显，保证数据最新
    detailLoading.value = true
    try {
      const res = await getFurnDetail(row.id)
      if (res.code === 200) {
        fillDialogForm(res.data.detail)
      }
    } catch (error) {
      console.error(error)
    } finally {
      detailLoading.value = false
    }
  }
  // 新增：row 为空，表单保持置空
}

// 弹框提交：按模式分流到新增 / 修改
const handleDialogSubmit = async () => {
  try {
    if (dialogMode.value === 'add') {
      await addFurn({...dialogForm})
      ElMessage.success('新增成功')
    } else if (dialogMode.value === 'edit') {
      await updateFurn({...dialogForm})
      ElMessage.success('修改成功')
    }
    dialogVisible.value = false
    refreshData() // 成功后刷新两个表
  } catch (error) {
    console.error(error)
  }
}

// 删除：二次确认
const handleDelete = (row) => {
  ElMessageBox.confirm(`确定要删除「${row.name}」吗？`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    try {
      await deleteFurn(row.id)
      ElMessage.success('删除成功')
      refreshData()
    } catch (error) {
      console.error(error)
    }
  }).catch(() => {
    // 用户点了取消，什么都不做
  })
}

// 图片上传成功：后端返回 { code, msg, data:{ url } }，把 url 存进 imgPath
// 注意：el-upload 不走 axios 拦截器，response 是原始响应体，要自己判 code
const handleImgSuccess = (response) => {
  if (response.code === 200) {
    dialogForm.imgPath = response.data.url
    ElMessage.success('图片上传成功')
  } else {
    ElMessage.error(response.msg || '图片上传失败')
  }
}

// 图片上传前校验：类型 + 大小
const beforeImgUpload = (rawFile) => {
  const isImg = rawFile.type.startsWith('image/')
  const isLt2M = rawFile.size / 1024 / 1024 < 2
  if (!isImg) {
    ElMessage.error('只能上传图片文件')
    return false
  }
  if (!isLt2M) {
    ElMessage.error('图片大小不能超过 2MB')
    return false
  }
  return true
}

// 刷新数据（分页表 + 名称下拉选项）
const refreshData = () => {
  fetchFurnList()
  fetchNameOptions()
}

// 初始化
onMounted(() => {
  fetchNameOptions()
  fetchFurnList()
})
</script>

<style scoped>
.example-container {
  padding: 20px;
}

.section-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 16px;
  font-weight: 600;
  margin: 12px 0;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.search-form :deep(.el-form-item) {
  margin-bottom: 12px;
}

.box-card {
  min-height: calc(100vh - 40px);
}

/* 图片上传（弹框内） */
.img-uploader :deep(.el-upload) {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}
.img-uploader :deep(.el-upload):hover {
  border-color: var(--el-color-primary);
}
.img-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 120px;
  height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.img-preview {
  width: 120px;
  height: 120px;
  object-fit: cover;
  display: block;
}
.no-img {
  color: #999;
}

:deep(.el-pagination) {
  display: flex;
}
</style>
