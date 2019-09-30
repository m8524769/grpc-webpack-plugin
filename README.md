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
const OUT_DIR = path.resolve(__dirname, './protobuf');

module.exports = {
  mode: 'development',
  plugins: [
    new GrpcWebPlugin({
      protoPath: DIR,
      protoFiles: ['echo.proto'],
      outputType: 'js',
      importStyle: 'commonjs',
      outDir: OUT_DIR,
    }),
    new GrpcWebPlugin({
      protoPath: DIR,
      protoFiles: ['echo.proto'],
      outputType: 'grpc-web',
      importStyle: 'commonjs+dts',
      mode: 'grpcwebtext',
      outDir: OUT_DIR,
    }),
  ]
});
```

<h2 align="center">Options</h2>

|Name|Description|Type|Default|
|:--:|-----------|:--:|:-----:|
|`protoPath`| |`{String}`| |
|`protoFiles`| |`{Array.<string>}`| |
|`outputType`|`'js' \| 'grpc-web'`|`{String}`| |
|`importStyle`|`'closure' \| 'commonjs' \| 'commonjs+dts' \| 'typescript'`, see [Import Style](https://github.com/grpc/grpc-web#import-style)|`{String}`|`'closure'`|
|`mode`|`'grpcwebtext' \| 'grpcweb'`, see [Wire Format Mode](https://github.com/grpc/grpc-web#wire-format-mode)|`{String}`|`'grpcwebtext'`|
|`outDir`| |`{String}`|`'.'`|
|`extra`|Other configuration options, see `protoc -h`|`{Array.<string>}`|`[]`|
|`watch`|Watch `.proto` files and recompile whenever they change (Need to [turn on webpack watch mode](https://webpack.js.org/configuration/watch/#watch) first)|`{Boolean}`|`true`|

**Notice:** `commonjs+dts` and `typescript` importStyle only works with `grpc-web` outputType.

<h2 align="center">Todo</h2>

- [ ] Download `protoc` and `protoc-gen-grpc-web` automatically with specific version.
