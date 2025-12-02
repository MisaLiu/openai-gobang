# OpenAI-Gobang

与大语言模型一起玩五子棋。

## 本地搭建试玩

### 0. 环境准备

* 本地至少应该安装好了 NodeJS。推荐 NodeJS v22.14.0 版本。
* 已经安装好了 pnpm：`npm install pnpm -g`

### 1. 克隆项目

1. 使用 Git 或者右上角的 Download ZIP 均可。如果你选择直接下载源码压缩包，请先解压。
2. 进入项目目录，使用 `pnpm i` 安装依赖

### 2. 配置后端

1. 进入 `packages/backend` 文件夹，将 `example.env` 复制一份，并命名为 `.env` 文件
2. 编辑 `.env` 文件，填写 OpenAI Access Key、API 地址，以及你想要使用的模型
    > 不一定非要使用 OpenAI API，兼容 OpenAI 协议的第三方 API（比如火山方舟）也可以使用
3. 完成后保存即可

### 3. 启动项目

1. 在 `packages/backend` 目录打开一个终端，运行 `pnpm run start`
2. 在 `packages/frontend` 目录打开一个终端，运行 `pnpm run dev`
3. 在浏览器中打开 http://127.0.0.1:5173
4. 开始玩！

## 注意事项

两天急速开发，文件结构和代码都比较乱，敬请见谅！

简单做了多人游戏支持，理论上可以几个人同时游玩。

不建议直接部署到公网（基本没有做防护），如果一定要部署请自行注意防护措施。

## License

```
The MIT License (MIT)
Copyright © 2025 Misa Liu <misaliu@misaliu.top>

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the “Software”), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
```
