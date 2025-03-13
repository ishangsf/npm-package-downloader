# NPM包下载工具

## 项目介绍

这是一个基于Vue 3和Element Plus开发的NPM包下载工具，可以帮助用户一键下载npm包及其所有依赖。当你需要在离线环境中安装npm包，或者想要备份特定版本的包时，这个工具非常有用。

## 功能特点

- 支持搜索任意npm包及指定版本
- 自动获取包的所有依赖信息
- 提供直接下载链接
- 简洁直观的用户界面
- 实时显示下载进度

## 技术栈

- Vue 3 (使用Composition API和`<script setup>`)
- Vite (构建工具)
- Element Plus (UI组件库)
- Pinia (状态管理)
- Axios (HTTP请求)

## 安装部署

### 前提条件

- Node.js (推荐v16.0.0或更高版本)
- npm或yarn包管理器

### 安装步骤

1. 克隆项目到本地

```bash
git clone https://github.com/yourusername/npm-package-downloader.git
cd npm-package-downloader
```

2. 安装依赖

```bash
npm install
# 或者使用yarn
yarn
```

3. 启动开发服务器

```bash
npm run dev
# 或者使用yarn
yarn dev
```

4. 构建生产版本

```bash
npm run build
# 或者使用yarn
yarn build
```

构建完成后，生产文件将位于`dist`目录中，可以部署到任何静态文件服务器上。

## 使用指南

1. 在搜索框中输入需要下载的npm包名称（必填）
2. 可选择性地输入包的版本号（不填则默认为latest）
3. 点击"搜索"按钮获取包信息及其依赖
4. 查看依赖列表，可以点击单个包的下载链接进行下载
5. 或者点击"下载所有包"按钮批量下载所有包

## 项目结构

```
├── public/             # 静态资源
├── src/                # 源代码
│   ├── assets/         # 资源文件
│   ├── components/     # 组件
│   ├── stores/         # Pinia状态管理
│   ├── App.vue         # 主应用组件
│   ├── main.js         # 入口文件
│   └── style.css       # 全局样式
├── index.html          # HTML模板
├── package.json        # 项目依赖
└── vite.config.js      # Vite配置
```

## 贡献指南

欢迎贡献代码或提出建议！请通过以下步骤参与项目：

1. Fork本项目
2. 创建您的特性分支 (`git checkout -b feature/amazing-feature`)
3. 提交您的更改 (`git commit -m 'Add some amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 打开一个Pull Request

## 许可证

[MIT](LICENSE)

## 联系方式

如有任何问题或建议，请通过Issue或Pull Request与我们联系。