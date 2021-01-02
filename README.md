# newIdeas-backend-front

## 环境

git

node v8.17.0

## 开发

```bash
# 克隆项目
git clone https://github.com/newIdeasPublic/newIdeas-backend-front.git

# 进入项目目录
cd ewIdeas-backend-front

# 安装依赖
npm install

# 建议不要直接使用 cnpm 安装依赖，会有各种诡异的 bug。可以通过如下操作解决 npm 下载速度慢的问题
npm install --registry=https://registry.npm.taobao.org

# 启动服务
npm run dev
```

浏览器访问 http://localhost:9527

如果希望在开发环境中使用服务器端接口，请在 vue.config.js 中的 devServer 节配置 proxy；开发环境对 API 的调用会添加 /dev-api 前缀，配置代理时需要注意处理。


## 发布

```bash
# 构建测试环境
npm run build:stage

# 构建生产环境
npm run build:prod
```
构建完成后为静态文件，可以使用Nginx来发布，也可以放在后端服务的静态目录中；对 API 的调用会添加 /prod-api 前缀，用 Nginx 发布时需要为后端API接口配置代理。