export type ImportStyleType =
  | "closure"
  | "commonjs"
  | "commonjs+dts"
  | "typescript";

export type WireFormatModeType =
  | "grpcwebtext"
  | "grpcweb";

declare namespace GrpcPlugin {
  interface Options {
    protoPath?: string;
    protoFile?: string | string[];
    importStyle?: ImportStyleType;
    mode?: WireFormatModeType;
    outDir?: string;
  }
}

declare class GrpcPlugin {
  constructor(options?: GrpcPlugin.Options);
  apply(compiler: Compiler): void;
}

export = GrpcPlugin;
