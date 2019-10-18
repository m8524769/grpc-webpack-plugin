<div align="right">
  <a href="./README.md">English</a> | 简体中文
</div>

<div align="center">
  <a href="https://github.com/webpack/webpack">
    <img width="200" height="200" alt="Webpack logo"
      src="https://webpack.js.org/assets/icon-square-big.svg">
  </a>
  <h1>基啊咯批西 · 歪不派克 · 噗啦个嘤</h1>
  <p>
    一个基于 <a href="https://github.com/grpc/grpc-web">gRPC-Web</a> 实现自动编译 <code>.proto</code> 文件的 <a href="https://webpack.js.org">webpack</a> 插件。
  </p>
</div>

<div align="center">
  <a href="https://www.npmjs.com/package/grpc-webpack-plugin"><img alt="npm" src="https://img.shields.io/npm/v/grpc-webpack-plugin" /></a>
  <a href="https://nodejs.org"><img alt="node" src="https://img.shields.io/node/v/grpc-webpack-plugin" /></a>
  <a href="https://travis-ci.com/m8524769/grpc-webpack-plugin"><img alt="Travis (.com)" src="https://img.shields.io/travis/com/m8524769/grpc-webpack-plugin" /></a>
  <a href="https://packagephobia.now.sh/result?p=grpc-webpack-plugin"><img alt="install size" src="https://packagephobia.now.sh/badge?p=grpc-webpack-plugin" /></a>
  <a href="https://www.npmjs.com/package/grpc-webpack-plugin"><img alt="npm" src="https://img.shields.io/npm/dt/grpc-webpack-plugin" /></a>
</div>

<h2 align="center">装他丫的</h2>

**注意：** 请确保系统上已装有 [`protoc`](https://github.com/protocolbuffers/protobuf/releases) 和 [`protoc-gen-grpc-web`](https://github.com/grpc/grpc-web/releases)。

```shell
npm i --save-dev grpc-webpack-plugin
```

```shell
yarn add --dev grpc-webpack-plugin
```

<h2 align="center">这咋用啊？</h2>

**webpack.config.js**

```js
const GrpcWebPlugin = require('grpc-webpack-plugin');

const path = require('path');
const DIR = path.resolve(__dirname, './protos');
const OUT_DIR = path.resolve(__dirname, './generated');

module.exports = {
  mode: 'development',
  plugins: [
    // Proto messages
    new GrpcWebPlugin({
      protoPath: DIR,
      protoFiles: ['echo.proto'],
      outputType: 'js',
      importStyle: 'commonjs',
      binary: true,
      outDir: OUT_DIR,
    }),
    // Service client stub
    new GrpcWebPlugin({
      protoPath: DIR,
      protoFiles: ['echo.proto'],
      outputType: 'grpc-web',
      importStyle: 'commonjs+dts',
      mode: 'grpcwebtext',
      outDir: OUT_DIR,
    }),
  ],
  // 另外，你可以添加如下配置来调试你的插件参数
  // 需要 webpack 的版本不低于 v4.37
  infrastructureLogging: {
    level: 'error',
    debug: /GrpcWebPlugin/,
  },
});
```

<h2 align="center">选项</h2>

|选项名|描述|类型|默认值|
|:----:|----|:--:|:----:|
|`protoPath`|必填，例：`'./protos'`|`{String}`| |
|`protoFiles`|必填，例：`['foo.proto', 'bar.proto']`|`{Array.<string>}`| |
|`outputType`|必填，例：`'js' \| 'grpc-web'`|`{String}`| |
|`importStyle`|`'closure' \| 'commonjs' \| 'commonjs+dts' \| 'typescript'`，详见 [Import Style](https://github.com/grpc/grpc-web#import-style)|`{String}`|`'closure'`|
|`binary`|开启此选项可序列化/反序列化二进制格式的 proto|`{Boolean}`|`false`|
|`mode`|`'grpcwebtext' \| 'grpcweb'`，详见 [Wire Format Mode](https://github.com/grpc/grpc-web#wire-format-mode)|`{String}`|`'grpcwebtext'`|
|`outDir`| |`{String}`|`'.'`|
|`extra`|其他编译参数，详见 `protoc -h`|`{Array.<string>}`|`[]`|
|`synchronize`|使你的 pb 生成代码与 `.proto` 中的定义保持同步，将其设为 `false` 即可使 pb 文件只读|`{Boolean}`|`true`|
|`watch`|监听 `.proto` 文件，在其更改时重新编译之，仅在 `synchronize` 为 `true` 时生效。（需要[打开 webpack 的监听模式](https://webpack.js.org/configuration/watch/#watch)）|`{Boolean}`|`true`|

**注意：** `commonjs+dts` 和 `typescript` 仅适用于 outputType 为 `grpc-web` 的情况。
