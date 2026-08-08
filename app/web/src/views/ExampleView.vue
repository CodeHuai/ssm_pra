<template>
  <div class="example-container">
    <el-card class="box-card">
      <template #header>
        <div class="card-header">
          <span>Element Plus + Axios 示例</span>
          <el-button type="primary" :icon="Refresh" @click="refreshData">刷新</el-button>
        </div>
      </template>

      <!-- 上面的表格：家具列表（调用 /api/getAll，全量） -->
      <div class="section-title">家具列表 - 全量（共 {{ allFurnList.length }} 条）</div>
      <el-table :data="allFurnList" style="width: 100%" v-loading="allFurnLoading" stripe>
        <el-table-column prop="id" label="ID" width="80"/>
        <el-table-column prop="name" label="名称"/>
        <el-table-column prop="marker" label="品牌"/>
        <el-table-column prop="price" label="价格"/>
        <el-table-column prop="sales" label="销量"/>
        <el-table-column prop="stock" label="库存"/>
        <el-table-column prop="imgPath" label="图片路径"/>
      </el-table>

      <!-- 文件上传示例 -->
      <el-divider/>

      <el-form>
        <el-form-item label="文件上传">
          <el-upload
              class="upload-demo"
              :action="uploadUrl"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              :on-success="handleSuccess"
              :on-error="handleError"
              :before-upload="beforeUpload"
              :on-progress="handleProgress"
              :file-list="fileList"
              drag
          >
            <el-icon class="el-icon--upload">
              <UploadFilled/>
            </el-icon>
            <div class="el-upload__text">
              将文件拖到此处，或<em>点击上传</em>
            </div>
            <template #tip>
              <div class="el-upload__tip">
                只能上传 jpg/png 文件，且不超过 500KB
              </div>
            </template>
          </el-upload>
        </el-form-item>
      </el-form>

      <!-- 下面的表格：家具列表（调用 /api/furnPage，分页） -->
      <el-divider/>
      <div class="section-title">
        <span>家具列表 - 分页（共 {{ furnTotal }} 条）</span>
        <el-button type="primary" :icon="Plus" @click="openDialog('add')">新增</el-button>
      </div>
      <el-table :data="furnList" style="width: 100%" v-loading="furnLoading" stripe>
        <el-table-column prop="id" label="ID" width="80"/>
        <el-table-column prop="name" label="名称"/>
        <el-table-column prop="marker" label="品牌"/>
        <el-table-column prop="price" label="价格"/>
        <el-table-column prop="sales" label="销量"/>
        <el-table-column prop="stock" label="库存"/>
        <el-table-column prop="imgPath" label="图片路径"/>
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
        <el-form-item label="图片路径">
          <el-input v-model="dialogForm.imgPath" placeholder="请输入图片路径"/>
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
  UploadFilled,
  Plus
} from '@element-plus/icons-vue'
import {addFurn, getAllFurn, getFurnPage, updateFurn, deleteFurn, getFurnDetail} from '@/api/furn'

// 文件上传
const uploadUrl = ref(import.meta.env.VITE_API_BASE_URL + '/file/upload')
const fileList = ref([])

// 家具列表 - 全量（/api/getAll）
const allFurnList = ref([])
const allFurnLoading = ref(false)
const fetchAllFurn = async () => {
  allFurnLoading.value = true
  try {
    const res = await getAllFurn()
    if (res.code === 200) {
      allFurnList.value = res.data?.list || []
    }
  } catch (error) {
    console.error(error)
  } finally {
    allFurnLoading.value = false
  }
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
    const res = await getFurnPage(furnPageNum.value, furnPageSize.value)
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

// 刷新数据（全量 + 分页两个表）
const refreshData = () => {
  fetchAllFurn()
  fetchFurnList()
}

// 文件上传相关
const handlePreview = (file) => {
  ElMessage.info(`预览文件：${file.name}`)
}

const handleRemove = (file, uploadFiles) => {
  ElMessage.success(`已移除文件：${file.name}`)
}

const handleSuccess = (response, uploadFile, uploadFiles) => {
  ElMessage.success('文件上传成功')
  fileList.value = uploadFiles
}

const handleError = (error, uploadFile, uploadFiles) => {
  ElMessage.error('文件上传失败')
  console.error(error)
}

const beforeUpload = (rawFile) => {
  const isJPG = rawFile.type === 'image/jpeg' || rawFile.type === 'image/png'
  const isLt500K = rawFile.size / 1024 < 500

  if (!isJPG) {
    ElMessage.error('只能上传 JPG/PNG 格式的图片')
    return false
  }
  if (!isLt500K) {
    ElMessage.error('图片大小不能超过 500KB')
    return false
  }
  return true
}

const handleProgress = (evt, uploadFile, uploadFiles) => {
  console.log('上传进度：', evt.percent)
}

// 初始化
onMounted(() => {
  fetchAllFurn()
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

.box-card {
  min-height: calc(100vh - 40px);
}

.upload-demo {
  width: 100%;
}

:deep(.el-pagination) {
  display: flex;
}
</style>
