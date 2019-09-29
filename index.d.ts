declare namespace GrpcWebPlugin {
  type OutputType = 'js' | 'grpc-web';
  type ImportStyleType = 'closure' | 'commonjs' | 'commonjs+dts' | 'typescript';
  type WireFormatModeType = 'grpcwebtext' | 'grpcweb';

  interface Options {
    protoPath: string;
    protoFiles: string[];
    outputType: OutputType;
    importStyle?: ImportStyleType;
    mode?: WireFormatModeType;
    outDir?: string;
    extra?: string[];
    watch?: boolean;
  }
}

declare class GrpcWebPlugin {
  constructor(options: GrpcWebPlugin.Options);
  apply(compiler: Compiler): void;
}

export = GrpcWebPlugin;
