<div align="right">
  English | <a href="./README.zh-CN.md">简体中文</a>
</div>

<div align="center">
  <a href="https://github.com/webpack/webpack">
    <img width="200" height="200" alt="Webpack logo"
      src="https://webpack.js.org/assets/icon-square-big.svg">
  </a>
  <h1>gRPC Webpack Plugin</h1>
  <p>
    A <a href="https://webpack.js.org">webpack</a> plugin that compiles <code>.proto</code> files automatically with <a href="https://github.com/grpc/grpc-web">gRPC-Web</a>.
  </p>
</div>

<div align="center">
  <a href="https://www.npmjs.com/package/grpc-webpack-plugin"><img alt="npm" src="https://img.shields.io/npm/v/grpc-webpack-plugin" /></a>
  <a href="https://nodejs.org"><img alt="node" src="https://img.shields.io/node/v/grpc-webpack-plugin" /></a>
  <a href="https://travis-ci.com/m8524769/grpc-webpack-plugin"><img alt="Travis (.com)" src="https://img.shields.io/travis/com/m8524769/grpc-webpack-plugin" /></a>
  <a href="https://packagephobia.now.sh/result?p=grpc-webpack-plugin"><img alt="install size" src="https://packagephobia.now.sh/badge?p=grpc-webpack-plugin" /></a>
  <a href="https://www.npmjs.com/package/grpc-webpack-plugin"><img alt="npm" src="https://img.shields.io/npm/dt/grpc-webpack-plugin" /></a>
</div>

<h2 align="center">Install</h2>

**Notice:** Make sure you have [`protoc`](https://github.com/protocolbuffers/protobuf/releases) and [`protoc-gen-grpc-web`](https://github.com/grpc/grpc-web/releases) installed on your OS.

```shell
npm i --save-dev grpc-webpack-plugin
```

```shell
yarn add --dev grpc-webpack-plugin
```

<h2 align="center">Usage</h2>

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
  // In addition, you can debug your options by adding the following configuration
  // Require webpack>=4.37
  infrastructureLogging: {
    level: 'error',
    debug: /GrpcWebPlugin/,
  },
});
```

<h2 align="center">Options</h2>

|Name|Description|Type|Default|
|:--:|-----------|:--:|:-----:|
|`protoPath`|Required, e.g. `'./protos'`|`{String}`| |
|`protoFiles`|Required, e.g. `['foo.proto', 'bar.proto']`|`{Array.<string>}`| |
|`outputType`|Required, `'js' \| 'grpc-web'`|`{String}`| |
|`importStyle`|`'closure' \| 'commonjs' \| 'commonjs+dts' \| 'typescript'`, see [Import Style](https://github.com/grpc/grpc-web#import-style)|`{String}`|`'closure'`|
|`binary`|Enable it to serialize and deserialize your proto from the protocol buffers binary wire format|`{Boolean}`|`false`|
|`mode`|`'grpcwebtext' \| 'grpcweb'`, see [Wire Format Mode](https://github.com/grpc/grpc-web#wire-format-mode)|`{String}`|`'grpcwebtext'`|
|`outDir`| |`{String}`|`'.'`|
|`extra`|Other protoc options, see `protoc -h`|`{Array.<string>}`|`[]`|
|`synchronize`|Sync generated codes with `.proto` files each time you run webpack, disable it if you want to keep your generated codes read-only|`{Boolean}`|`true`|
|`watch`|Watch `.proto` files and recompile whenever they change. Only works if `synchronize` is `true`. (Need to [turn on webpack watch mode](https://webpack.js.org/configuration/watch/#watch) first)|`{Boolean}`|`true`|

**Notice:** `commonjs+dts` and `typescript` importStyle only works with `grpc-web` outputType.

<h2 align="center">Advanced</h2>

You can compile multiple `.proto` files and put the generated code into separate folders like this:

**webpack.config.js**

```js
module.exports = {
  plugins: [
    ...['foo', 'bar', 'baz'].map(
      protoName =>
        new GrpcWebPlugin({
          protoPath: path.resolve(__dirname, './protos'),
          protoFiles: [`${protoName}.proto`],
          outputType: 'grpc-web',
          importStyle: 'typescript',
          mode: 'grpcwebtext',
          outDir: path.join(__dirname, 'generated', protoName),
        })
    ),
  ],
};
```

<h2 align="center">Todo</h2>

- [ ] Add some hooks
- [ ] Support Webpack 5
