'use strict';

const fs = require('fs');
const path = require('path');
const webpack = require('webpack');
const rimraf = require('rimraf');
const GrpcWebPlugin = require('..');

const DIR = path.resolve(__dirname, './protos');
const OUT_DIR = path.resolve(__dirname, './protobuf');

const testGrpcWebPlugin = (pluginConfig, expectedGeneratedFiles, done) => {
  webpack({
    mode: 'development',
    infrastructureLogging: {
      level: 'error',
      debug: /GrpcWebPlugin/,
    },
    plugins: [new GrpcWebPlugin(pluginConfig)],
  }, (err, stats) => {
    shouldGenerate(pluginConfig.outDir, expectedGeneratedFiles);
  });
  done();
}

const shouldGenerate = (directory, files) => {
  files.forEach(file => {
    const filePath = path.join(directory, file);
    expect(fs.existsSync(filePath)).toBe(true);
    rimraf(filePath, () => {});
  });
};

describe('GrpcWebPlugin', () => {
  beforeAll(done => {
    rimraf(OUT_DIR, () => {
      fs.mkdir(OUT_DIR, { recursive: true }, done);
    });
  });

  it('should generate proto messages (closure)', done => {
    testGrpcWebPlugin({
      protoPath: DIR,
      protoFiles: ['balh.proto'],
      outputType: 'js',
      importStyle: 'closure',
      outDir: OUT_DIR,
    }, [
      'ja.js',
      'balh.js',
    ], done);
  });

  it('should generate proto messages (commonjs)', done => {
    testGrpcWebPlugin({
      protoPath: DIR,
      protoFiles: ['balh.proto'],
      outputType: 'js',
      importStyle: 'commonjs',
      outDir: OUT_DIR,
    }, [
      'balh_pb.js',
    ], done);
  });

  it('should generate service client stub (closure)', done => {
    testGrpcWebPlugin({
      protoPath: DIR,
      protoFiles: ['balh.proto'],
      outputType: 'grpc-web',
      importStyle: 'closure',
      mode: 'grpcwebtext',
      outDir: OUT_DIR,
    }, [
      'balh_grpc_web_pb.js',
    ], done);
  });

  it('should generate service client stub (commonjs)', done => {
    testGrpcWebPlugin({
      protoPath: DIR,
      protoFiles: ['balh.proto'],
      outputType: 'grpc-web',
      importStyle: 'commonjs',
      mode: 'grpcwebtext',
      outDir: OUT_DIR,
    }, [
      'balh_grpc_web_pb.js'
    ], done);
  });

  it('should generate service client stub (commonjs+dts)', done => {
    testGrpcWebPlugin({
      protoPath: DIR,
      protoFiles: ['balh.proto'],
      outputType: 'grpc-web',
      importStyle: 'commonjs+dts',
      mode: 'grpcwebtext',
      outDir: OUT_DIR,
    }, [
      'balh_pb.d.ts',
      'balh_grpc_web_pb.js',
      'balh_grpc_web_pb.d.ts',
    ], done);
  });

  it('should generate service client stub (typescript)', done => {
    testGrpcWebPlugin({
      protoPath: DIR,
      protoFiles: ['balh.proto'],
      outputType: 'grpc-web',
      importStyle: 'typescript',
      mode: 'grpcwebtext',
      outDir: OUT_DIR,
    }, [
      'balh_pb.d.ts',
      'BalhServiceClientPb.ts',
    ], done);
  });

});
