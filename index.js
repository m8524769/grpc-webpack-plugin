'use strict';

class GrpcWebPlugin {
  constructor(options) {
    const userOptions = options || {};

    const defaultOptions = {
      importStyle: "closure",
      mode: "grpcwebtext",
      outDir: "."
    };

    this.options = Object.assign(defaultOptions, userOptions);
  }

  apply(compiler) {
    compiler.hooks.compilation.tap('GrpcWebPlugin', compilation => {
      const { options } = this;
      let protocOptions = [
        `-I${options.protoPath}`,
        ...options.protoFiles,
      ];

      if (options.outputType === 'grpc-web') {
        protocOptions.push(
          `--grpc-web_out=import_style=${options.importStyle},mode=${options.mode}:${options.outDir}`
        );
      } else if (options.outputType === 'js') {
        protocOptions.push(
          `--js_out=import_style=${options.importStyle}:${options.outDir}`
        );
      }

      const cp = require("child_process");
      cp.spawn("protoc", protocOptions, {
        stdio: "inherit",
        shell: true
      }).on("error", error => {
        console.error(error);
      });
    })
  }
}

module.exports = GrpcWebPlugin;
