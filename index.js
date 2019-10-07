'use strict';

const commandExists = require('command-exists').sync;
const cp = require('child_process');
const fs = require('fs');
const path = require('path');

/** @typedef {import("./index").Options} GrpcWebOptions */
/** @typedef {import("webpack/lib/Compiler.js")} WebpackCompiler */

class GrpcWebPlugin {
  /**
   * @param {GrpcWebOptions} options GrpcWebPlugin options
   */
  constructor(options) {
    /** @type {GrpcWebOptions} */
    const userOptions = options || {};

    /** @type {GrpcWebOptions} */
    const defaultOptions = {
      importStyle: 'closure',
      mode: 'grpcwebtext',
      outDir: '.',
      extra: [],
      synchronize: true,
      watch: true,
    };

    /** @type {GrpcWebOptions} */
    this.options = Object.assign(defaultOptions, userOptions);
  }

  /**
   * Apply the plugin
   * @param {WebpackCompiler} compiler Webpack Compiler
   * @returns {void}
   */
  apply(compiler) {
    ['protoc', 'protoc-gen-grpc-web'].map(prog => {
      if (!commandExists(prog)) {
        throw new Error(`${prog} is not installed`);
      }
    });

    const { options } = this;
    const logger = compiler.getInfrastructureLogger
      ? compiler.getInfrastructureLogger('GrpcWebPlugin')
      : console;

    let outputOption = '';
    if (options.outputType === 'grpc-web') {
      outputOption = `--grpc-web_out=import_style=${options.importStyle},mode=${options.mode}:${options.outDir}`;
    } else if (options.outputType === 'js') {
      outputOption = `--js_out=import_style=${options.importStyle}:${options.outDir}`;
    }

    if (options.synchronize) {
      // Compile all .proto files during initialization
      compiler.hooks.afterEnvironment.tap('GrpcWebPlugin', () => {
        if (!fs.existsSync(options.outDir)) {
          fs.mkdirSync(options.outDir, { recursive: true });
        }

        logger.debug(
          `protoc -I=${options.protoPath} ${options.protoFiles.join(' ')} ${outputOption} ${options.extra.join(' ')}`
        );

        cp.spawn('protoc', [
          `-I=${options.protoPath}`,
          ...options.protoFiles,
          ...options.extra,
          outputOption,
        ], {
          shell: true,
        }).stderr.on('data', error => {
          throw new Error(error.toString());
        });
      });
    }

    if (options.watch && options.synchronize) {
      // Add protos to fileDependencies
      compiler.hooks.afterCompile.tap('GrpcWebPlugin', compilation => {
        options.protoFiles.forEach(protoFile => {
          compilation.fileDependencies.add(
            path.join(options.protoPath, protoFile)
          );
        });
      });

      // Recompile .proto files whenever they change
      compiler.hooks.watchRun.tapAsync('GrpcWebPlugin', (compiler, callback) => {
        let changedProtos = [];
        if (compiler.modifiedFiles) {  // Only in Webpack 5
          changedProtos = Array.from(compiler.modifiedFiles).filter(isProtoFile);
        } else if (compiler.watchFileSystem.watcher.mtimes) {  // Older versions of watchpack use mtimes
          changedProtos = Object.keys(
            compiler.watchFileSystem.watcher.mtimes
          ).filter(isProtoFile);
        }

        if (changedProtos.length !== 0) {
          if (!fs.existsSync(options.outDir)) {
            fs.mkdirSync(options.outDir, { recursive: true });
          }

          logger.debug(
            `protoc -I=${options.protoPath} ${changedProtos.join(' ')} ${outputOption} ${options.extra.join(' ')}`
          );

          cp.spawn('protoc', [
            `-I=${options.protoPath}`,
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

const isProtoFile = filename => filename.endsWith('.proto');

module.exports = GrpcWebPlugin;
