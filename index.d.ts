declare namespace GrpcWebPlugin {
  type OutputType = 'js' | 'grpc-web';
  type ImportStyleType = 'closure' | 'commonjs' | 'commonjs+dts' | 'typescript';
  type WireFormatModeType = 'grpcwebtext' | 'grpcweb';

  interface Options {
    /**
     * E.g. `'./protos'`
     */
    protoPath: string;
    /**
     * E.g. `['foo.proto', 'bar.proto']`.
     */
    protoFiles: string[];
    /**
     * `'js'` or `'grpc-web'`.
     */
    outputType: OutputType;
    /**
     * See [Import Style](https://github.com/grpc/grpc-web#import-style).
     * Default: `closure`.
     */
    importStyle?: ImportStyleType;
    /**
     * See [Wire Format Mode](https://github.com/grpc/grpc-web#wire-format-mode).
     * Default: `grpcwebtext`.
     */
    mode?: WireFormatModeType;
    /**
     * Default: `.`.
     */
    outDir?: string;
    /**
     * Other configuration options, see `protoc -h`.
     * Default: `[]`.
     */
    extra?: string[];
    /**
     * Watch `.proto` files and recompile whenever they change.
     * Default: `true`.
     */
    watch?: boolean;
  }
}

declare class GrpcWebPlugin {
  constructor(options: GrpcWebPlugin.Options);
  apply(compiler: Compiler): void;
}

export = GrpcWebPlugin;
