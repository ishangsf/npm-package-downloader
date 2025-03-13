<script setup>
import { ref, computed } from 'vue';
import { usePackageStore } from './stores/packageStore';
import { ElMessage } from 'element-plus';

const packageStore = usePackageStore();

const packageName = ref('');
const packageVersion = ref('');

const isLoading = computed(() => packageStore.loading);
const error = computed(() => packageStore.error);
const downloadProgress = computed(() => packageStore.downloadProgress);
const dependencies = computed(() => packageStore.dependencies);

const searchPackage = async () => {
  if (!packageName.value) {
    ElMessage.warning('请输入包名');
    return;
  }
  
  await packageStore.fetchPackageInfo(packageName.value, packageVersion.value);
  
  if (packageStore.error) {
    ElMessage.error(packageStore.error);
  } else if (packageStore.dependencies.length > 0) {
    ElMessage.success(`成功获取 ${packageStore.dependencies.length} 个包信息`);
  }
};

const downloadPackages = async () => {
  if (dependencies.value.length === 0) {
    ElMessage.warning('请先搜索包信息');
    return;
  }
  
  await packageStore.downloadPackages();
  
  if (!packageStore.error) {
    ElMessage.success('下载完成');
  }
};

const resetForm = () => {
  packageName.value = '';
  packageVersion.value = '';
  packageStore.reset();
};
</script>

<template>
  <div class="container">
    <header>
      <h1>NPM包下载工具</h1>
      <p>输入包名和版本，一键下载npm包及其所有依赖</p>
    </header>
    
    <main>
      <el-card class="search-card">
        <el-form :model="{ packageName, packageVersion }" label-position="top">
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="包名" required>
                <el-input v-model="packageName" placeholder="例如: lodash" :disabled="isLoading" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="版本 (可选)">
                <el-input v-model="packageVersion" placeholder="例如: 4.17.21，默认为latest" :disabled="isLoading" />
              </el-form-item>
            </el-col>
          </el-row>
          
          <div class="form-actions">
            <el-button type="primary" @click="searchPackage" :loading="isLoading">
              <el-icon><el-icon-search /></el-icon> 搜索
            </el-button>
            <el-button @click="resetForm" :disabled="isLoading">
              <el-icon><el-icon-refresh /></el-icon> 重置
            </el-button>
            <el-button type="success" @click="downloadPackages" :disabled="isLoading || dependencies.length === 0">
              <el-icon><el-icon-download /></el-icon> 下载所有包
            </el-button>
          </div>
        </el-form>
      </el-card>
      
      <div v-if="error" class="error-message">
        <el-alert :title="error" type="error" show-icon />
      </div>
      
      <div v-if="isLoading && downloadProgress > 0" class="progress-container">
        <el-progress :percentage="downloadProgress" :format="() => `${downloadProgress}%`" />
        <p>正在下载包文件，请稍候...</p>
      </div>
      
      <el-card v-if="dependencies.length > 0" class="result-card">
        <template #header>
          <div class="card-header">
            <span>依赖列表 ({{ dependencies.length }})</span>
          </div>
        </template>
        
        <el-table :data="dependencies" style="width: 100%" max-height="400">
          <el-table-column prop="name" label="包名" width="180" />
          <el-table-column prop="version" label="版本" width="120" />
          <el-table-column label="类型" width="100">
            <template #default="scope">
              <el-tag :type="scope.row.isMainPackage ? 'danger' : 'info'">
                {{ scope.row.isMainPackage ? '主包' : '依赖' }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="tarballUrl" label="下载链接">
            <template #default="scope">
              <el-link type="primary" :href="scope.row.tarballUrl" target="_blank" :underline="false">
                {{ scope.row.tarballUrl }}
              </el-link>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </main>
    
    <footer>
      <p>© {{ new Date().getFullYear() }} NPM包下载工具 | 基于Vue3和Element Plus</p>
    </footer>
  </div>
</template>

<style scoped>
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

header {
  text-align: center;
  margin-bottom: 2rem;
}

header h1 {
  font-size: 2.5rem;
  color: var(--el-color-primary);
  margin-bottom: 0.5rem;
}

header p {
  color: var(--el-text-color-secondary);
  font-size: 1.1rem;
}

main {
  flex: 1;
}

.search-card {
  margin-bottom: 2rem;
}

.form-actions {
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
}

.result-card {
  margin-top: 2rem;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.progress-container {
  margin: 2rem 0;
  text-align: center;
}

.error-message {
  margin: 1rem 0;
}

footer {
  margin-top: 3rem;
  text-align: center;
  color: var(--el-text-color-secondary);
  font-size: 0.9rem;
}
</style>
