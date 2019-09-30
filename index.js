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
    ['protoc', 'protoc-gen-grpc-web'].map(prog => {
      if (!commandExists(prog)) {
        throw new Error(`${prog} is not installed`);
      }
    });

    const { options } = this;

    let outputOption = '';
    if (options.outputType === 'grpc-web') {
      outputOption = `--grpc-web_out=import_style=${options.importStyle},mode=${options.mode}:${options.outDir}`;
    } else if (options.outputType === 'js') {
      outputOption = `--js_out=import_style=${options.importStyle}:${options.outDir}`;
    }

    compiler.hooks.afterEnvironment.tap('GrpcWebPlugin', () => {
      if (!fs.existsSync(options.outDir)) {
        fs.mkdirSync(options.outDir, { recursive: true });
      }

      cp.spawn('protoc', [
        `-I${options.protoPath}`,
        ...options.protoFiles,
        ...options.extra,
        outputOption,
      ], {
        shell: true,
      }).stderr.on('data', error => {
        throw new Error(error.toString());
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
        const changedProtos = Object.keys(
          compiler.watchFileSystem.watcher.mtimes
        ).filter(filename => filename.endsWith('.proto'));

        if (changedProtos.length !== 0) {
          if (!fs.existsSync(options.outDir)) {
            fs.mkdirSync(options.outDir, { recursive: true });
          }

          cp.spawn('protoc', [
            `-I${options.protoPath}`,
            ...changedProtos,
            ...options.extra,
            outputOption,
          ], {
            shell: true,
          }).on('exit', code => {
            if (code !== 0) {
              return callback(`Compilation failed in ${changedProtos}.`);
            } else {
              return callback();
            }
          }).stderr.on('data', error => {
            return callback(`Error: ${error}`);
          });
        }
        return callback();
      });
    }
  }
}

module.exports = GrpcWebPlugin;
