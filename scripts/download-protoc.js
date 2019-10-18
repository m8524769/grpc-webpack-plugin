'use strict';

const fs = require('fs');
const https = require('https');
const { GraphQLClient } = require('graphql-request');

const downloadProtoc = (version, callback) => {
  const suffix = getSuffix(process.platform, process.arch);
  const filename = `protoc-${version}-${suffix}.zip`;
  const file = fs.createWriteStream(filename);
  https.get(
    `https://github.com/protocolbuffers/protobuf/releases/download/v${version}/${filename}`,
    res => {
      if (res.statusCode === 200) {
        res.pipe(file);
      }
    }
  ).on('error', err => {
    console.log(err)
    fs.unlink(filename);
    // if (callback) {
    //   callback(err.message);
    // }
  });

  file.on('finish', () => file.close(callback));
  file.on('error', () => console.error);
}

const getSuffix = (platform, arch) => {
  if (platform === 'linux') {
    if (arch === 'arm64') {
      return 'aarch_64';
    } else if (arch === 'ppc64') {
      return 'ppcle_64';
    } else if (arch === 's390x') {
      return 's390x_64';
    } else if (arch === 'x64') {
      return 'x86_64';
    } else if (arch === 'x32') {
      return 'x86_32';
    }
  } else if (platform === 'darwin') {
    return arch === 'x64' ? 'osx-x86_64' : 'osx-x86_32';
  } else if (platform === 'win32') {
    return arch === 'x64' ? 'win64' : 'win32';
  }
  return '';
}

const getLatestTagName = (user, repo) => {
  return new GraphQLClient('https://api.github.com/graphql')
    .setHeader('Authorization', 'bearer 0b29e78a6ba725ee37fda2a7d9527fa8c2d8e10b')
    .rawRequest(`{
      repository(owner: "${user}", name: "${repo}") {
        releases(
          orderBy: { field: CREATED_AT, direction: DESC },
          first: 1
        ) {
          nodes {
            tagName
          }
        }
      }
    }`).then(response =>
      response.data.repository.releases.nodes[0].tagName
    );
  // return new Promise((resolve, reject) => {
  //   https.get({
  //     host: 'api.github.com',
  //     path: `/repos/${user}/${repo}/releases/latest`,
  //     headers: { 'user-agent': 'node.js' },
  //   }, res => {
  //     let data = '';
  //     res.on('data', chunk => data += chunk);
  //     res.on('end', () => resolve(JSON.parse(data).tag_name));
  //   }).on('error', reject);
  // });
}

let version = process.argv[2] || 'latest';
if (version === 'latest') {
  getLatestTagName('protocolbuffers', 'protobuf').then(tagName => {
    const tagNumber = tagName.match(/v(.*)/)[1];
    console.log(tagNumber)
    // downloadProtoc(tag)
  }).catch(console.error);
} else {
  // downloadProtoc(version);
}
