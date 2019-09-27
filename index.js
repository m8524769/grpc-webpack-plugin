'use strict';

class GrpcPlugin {
  constructor(options) {
    const userOptions = options || {};

    const defaultOptions = {
      protoPath: ".",
      importStyle: "closure",
      mode: "grpcwebtext",
      outDir: "."
    };

    this.options = Object.assign(defaultOptions, userOptions);
  }

  apply(compiler) {
    compiler.hooks.compilation.tap('GrpcPlugin', compilation => {
        const cp = require("child_process");
        return new Promise((resolve, reject) => {
          const executedCommand = cp.spawn(
            "protoc",
            [
              "-h"
            ],
            {
              stdio: "inherit",
              shell: true
            }
          );

          executedCommand.on("error", error => {
            reject(error);
          });

          executedCommand.on("exit", code => {
            if (code === 0) {
              resolve();
            } else {
              reject();
            }
          });
        });
      },
    )
  }
}

module.exports = GrpcPlugin;
