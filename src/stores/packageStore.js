import { defineStore } from 'pinia';
import axios from 'axios';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

export const usePackageStore = defineStore('package', {
  state: () => ({
    packageName: '',
    packageVersion: '',
    dependencies: [],
    loading: false,
    error: null,
    downloadProgress: 0,
  }),
  
  actions: {
    async fetchPackageInfo(name, version) {
      this.loading = true;
      this.error = null;
      this.dependencies = [];
      this.packageName = name;
      this.packageVersion = version || 'latest';
      
      try {
        // 获取包信息
        const packageUrl = `https://registry.npmjs.org/${name}/${this.packageVersion}`;
        const response = await axios.get(packageUrl);
        
        // 获取tarball URL
        const tarballUrl = response.data.dist.tarball;
        
        // 收集依赖
        const dependencies = response.data.dependencies || {};
        const devDependencies = response.data.devDependencies || {};
        
        // 合并所有依赖
        const allDependencies = { ...dependencies };
        
        // 将依赖添加到列表中
        this.dependencies = [
          {
            name: this.packageName,
            version: response.data.version,
            tarballUrl: tarballUrl,
            isMainPackage: true
          }
        ];
        
        // 获取所有依赖的信息
        await this.fetchDependenciesInfo(allDependencies);
        
      } catch (error) {
        this.error = `获取包信息失败: ${error.message}`;
        console.error('Error fetching package info:', error);
      } finally {
        this.loading = false;
      }
    },
    
    async fetchDependenciesInfo(dependencies) {
      const dependencyPromises = Object.entries(dependencies).map(async ([name, versionRange]) => {
        try {
          // 处理版本范围，获取确切版本
          const version = versionRange.replace(/[\^~]/g, '');
          
          // 获取依赖包信息
          const packageUrl = `https://registry.npmjs.org/${name}/${version}`;
          const response = await axios.get(packageUrl);
          
          // 获取tarball URL
          const tarballUrl = response.data.dist.tarball;
          
          // 添加到依赖列表
          this.dependencies.push({
            name,
            version: response.data.version,
            tarballUrl,
            isMainPackage: false
          });
          
        } catch (error) {
          console.error(`Error fetching dependency info for ${name}:`, error);
        }
      });
      
      await Promise.all(dependencyPromises);
    },
    
    async downloadPackages() {
      if (this.dependencies.length === 0) {
        this.error = '没有可下载的包';
        return;
      }
      
      this.loading = true;
      this.downloadProgress = 0;
      
      try {
        const zip = new JSZip();
        const totalPackages = this.dependencies.length;
        let completedPackages = 0;
        
        // 为每个依赖创建下载任务
        const downloadPromises = this.dependencies.map(async (dep) => {
          try {
            const response = await axios.get(dep.tarballUrl, {
              responseType: 'arraybuffer',
              onDownloadProgress: (progressEvent) => {
                // 这里可以处理单个包的下载进度
              }
            });
            
            // 将包添加到zip文件中
            const fileName = `${dep.name}-${dep.version}.tgz`;
            zip.file(fileName, response.data);
            
            // 更新总体进度
            completedPackages++;
            this.downloadProgress = Math.floor((completedPackages / totalPackages) * 100);
            
          } catch (error) {
            console.error(`Error downloading ${dep.name}:`, error);
          }
        });
        
        await Promise.all(downloadPromises);
        
        // 生成zip文件并下载
        const content = await zip.generateAsync({ type: 'blob' });
        const mainPackage = this.dependencies.find(dep => dep.isMainPackage);
        const zipFileName = `${mainPackage.name}-${mainPackage.version}-with-dependencies.zip`;
        saveAs(content, zipFileName);
        
      } catch (error) {
        this.error = `下载包失败: ${error.message}`;
        console.error('Error downloading packages:', error);
      } finally {
        this.loading = false;
        this.downloadProgress = 0;
      }
    },
    
    reset() {
      this.packageName = '';
      this.packageVersion = '';
      this.dependencies = [];
      this.error = null;
      this.downloadProgress = 0;
    }
  }
});
