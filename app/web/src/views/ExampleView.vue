<template>
  <div class="example-container">
    <el-card class="box-card">
      <template #header>
        <div class="card-header">
          <span>Element Plus + Axios 示例</span>
          <el-button type="primary" :icon="Refresh" @click="refreshData">刷新</el-button>
        </div>
      </template>

      <!-- 表单示例 -->
      <el-form :model="form" label-width="120px" style="max-width: 600px">
        <el-form-item label="用户名">
          <el-input v-model="form.username" placeholder="请输入用户名"/>
        </el-form-item>

        <el-form-item label="密码">
          <el-input v-model="form.password" type="password" placeholder="请输入密码"/>
        </el-form-item>

        <el-form-item label="邮箱">
          <el-input v-model="form.email" placeholder="请输入邮箱"/>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="handleSubmit">
            <el-icon>
              <Check/>
            </el-icon>
            提交
          </el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>

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

      <!-- 数据表格示例 -->
      <el-divider/>

      <el-table :data="tableData" style="width: 100%" v-loading="loading">
        <el-table-column prop="id" label="ID" width="80"/>
        <el-table-column prop="username" label="用户名"/>
        <el-table-column prop="email" label="邮箱"/>
        <el-table-column prop="createTime" label="创建时间"/>
        <el-table-column label="操作" width="200">
          <template #default="scope">
            <el-button size="small" @click="handleEdit(scope.row)">
              <el-icon>
                <Edit/>
              </el-icon>
              编辑
            </el-button>
            <el-button size="small" type="danger" @click="handleDelete(scope.row)">
              <el-icon>
                <Delete/>
              </el-icon>
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="[10, 20, 50, 100]"
          :total="total"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          style="margin-top: 20px; justify-content: center"
      />
    </el-card>
  </div>
</template>

<script setup>
import {ref, reactive, onMounted} from 'vue'
import {ElMessage, ElMessageBox} from 'element-plus'
import {
  Check,
  Refresh,
  Edit,
  Delete,
  UploadFilled
} from '@element-plus/icons-vue'
import {getUserList, createUser, updateUser, deleteUser} from '@/api/example'

// 表单数据
const form = reactive({
  username: '',
  password: '',
  email: ''
})

// 文件上传
const uploadUrl = ref(import.meta.env.VITE_API_BASE_URL + '/file/upload')
const fileList = ref([])

// 表格数据
const tableData = ref([])
const loading = ref(false)
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)

// 刷新数据
const refreshData = () => {
  fetchUserList()
}

// 获取用户列表
const fetchUserList = async () => {
  loading.value = true
  try {
    const res = await getUserList({
      page: currentPage.value,
      size: pageSize.value
    })

    if (res.code === 200) {
      tableData.value = res.data?.list || []
      total.value = res.data?.total || 0
    }
  } catch (error) {
    console.error(error)
  } finally {
    loading.value = false
  }
}

// 提交表单
const handleSubmit = async () => {
  try {
    const res = await createUser({
      username: form.username,
      password: form.password,
      email: form.email
    })

    if (res.code === 200) {
      ElMessage.success('创建成功')
      handleReset()
      fetchUserList()
    }
  } catch (error) {
    console.error(error)
  }
}

// 重置表单
const handleReset = () => {
  form.username = ''
  form.password = ''
  form.email = ''
}

// 编辑
const handleEdit = (row) => {
  ElMessage.info(`编辑用户：${row.username}`)
  // TODO: 实现编辑功能
}

// 删除
const handleDelete = (row) => {
  ElMessageBox.confirm(
      `确定要删除用户 ${row.username} 吗？`,
      '提示',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
  ).then(async () => {
    try {
      const res = await deleteUser(row.id)
      if (res.code === 200) {
        ElMessage.success('删除成功')
        fetchUserList()
      }
    } catch (error) {
      console.error(error)
    }
  }).catch(() => {
    ElMessage.info('已取消删除')
  })
}

// 分页
const handleSizeChange = (val) => {
  pageSize.value = val
  fetchUserList()
}

const handleCurrentChange = (val) => {
  currentPage.value = val
  fetchUserList()
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
  fetchUserList()
})
</script>

<style scoped>
.example-container {
  padding: 20px;
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