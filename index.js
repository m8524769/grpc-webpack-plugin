'use strict';

const commandExists = require('command-exists').sync;
const cp = require('child_process');
const fs = require('fs');
const path = require('path');

class GrpcWebPlugin {
  constructor(options) {
    const userOptions = options || {};

    const defaultOptions = {
      importStyle: 'closure',
      mode: 'grpcwebtext',
      outDir: '.',
      extra: [],
      watch: true,
    };

    this.options = Object.assign(defaultOptions, userOptions);
  }

  apply(compiler) {
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

    compiler.hooks.afterEnvironment.tap('GrpcWebPlugin', () => {
      ['protoc', 'protoc-gen-grpc-web'].map(prog => {
        if (!commandExists(prog)) {
          throw new Error(`${prog} is not installed`);
        }
      });

      if (!fs.existsSync(options.outDir)) {
        fs.mkdirSync(options.outDir, { recursive: true });
      }

      cp.spawn('protoc', protocOptions, {
        stdio: 'inherit',
        shell: true,
      }).on('exit', code => {
        if (code !== 0) {
          throw new Error(
            'Please check GrpcWebPlugin options and proto syntax.'
          );
        }
      });
    });

    if (options.watch) {
      compiler.hooks.afterCompile.tap('GrpcWebPlugin', compilation => {
        options.protoFiles.forEach(protoFile => {
          compilation.fileDependencies.add(
            path.join(options.protoPath, protoFile)
          );
        });
      });

      compiler.hooks.watchRun.tapAsync('GrpcWebPlugin', (compiler, callback) => {
        const isProtoChanged = (
          Object.keys(compiler.watchFileSystem.watcher.mtimes)
            .findIndex(filename => filename.endsWith('.proto')) !== -1
        );

        if (isProtoChanged) {
          if (!fs.existsSync(options.outDir)) {
            fs.mkdirSync(options.outDir, { recursive: true });
          }

          cp.spawn('protoc', protocOptions, {
            stdio: 'inherit',
            shell: true,
          }).on('exit', code => {
            if (code !== 0) {
              throw new Error(
                'Please check GrpcWebPlugin options and proto syntax.'
              );
            } else {
              return callback();
            }
          });
        }
        return callback();
      })
    }
  }
}

module.exports = GrpcWebPlugin;
