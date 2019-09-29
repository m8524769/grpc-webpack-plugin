'use strict';

class GrpcWebPlugin {
  constructor(options) {
    const userOptions = options || {};

    const defaultOptions = {
      importStyle: 'closure',
      mode: 'grpcwebtext',
      outDir: '.',
      extra: [],
    };

    this.options = Object.assign(defaultOptions, userOptions);
  }

  apply(compiler) {
    compiler.hooks.afterEnvironment.tap('GrpcWebPlugin', () => {
      const { options } = this;
      let protocOptions = [
        `-I${options.protoPath}`,
        ...options.protoFiles,
        ...options.extra,
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

      const fs = require('fs');
      if (!fs.existsSync(options.outDir)) {
        fs.mkdirSync(options.outDir, { recursive: true });
      }

      const cp = require('child_process');
      cp.spawn('protoc', protocOptions, {
        stdio: 'inherit',
        shell: true,
      }).on('exit', code => {
        if (code !== 0) {
          throw new Error(
            'Please make sure you have protoc installed and check GrpcWebPlugin options.'
          );
        }
      });
    });
  }
}

module.exports = GrpcWebPlugin;
