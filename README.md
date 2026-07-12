# Jack Portfolio OS

贾凯 / Jack 的个人简历、作品集与个人内容系统网站。

## 页面

- `index.html`：首页与页面入口
- `resume.html`：简历及打印 / PDF 版本
- `works.html`：作品集
- `about.html`：可编辑的个人系统画布
- `contact.html`：联系方式

## 本地查看

直接用浏览器打开 `index.html` 即可。网站使用原生 HTML、CSS 和 JavaScript，不需要安装依赖或执行构建命令。

## 内容修改

主要个人资料和示例项目位于 `data.js`。页面样式位于 `styles.css`，交互功能位于 `app.js`。

关于页面的画布编辑结果目前保存在浏览器 `localStorage` 中，只对当前浏览器生效。

## 部署

这是静态网站，可部署到 Cloudflare Pages、GitHub Pages、Netlify 或其他静态托管服务。使用 Cloudflare Pages 时不需要构建命令，发布目录为仓库根目录。

## 设计说明

非商业个人网站。设计方法参考 Esther Design System，遵循其署名与非商业使用要求。
