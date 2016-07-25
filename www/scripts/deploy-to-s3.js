'use strict';

var s3 = require('s3');
var openurl = require('openurl');
var awsCreds = require('../aws-credentials');
var ncp = require("copy-paste");
var awsConfig = require('./util/aws-config');
var argv = require('minimist')(process.argv.slice(2));
var meta = require('../metadata');
var buildDist = require('./util/build-dist');
var xtend = require('xtend');


var config = xtend(awsConfig({
  appName: meta.appName,
  isSnapshot: !!argv.snapshot,
  bucket: awsCreds.bucket,
}), {
  pattern: argv.pattern || 'www/src/*.html',
  destpath: argv.dest || 'www/dist',
  codepen: true,
});

config.externalJS = config.baseUrl + 'bundle.js';

buildDist(config, function (err) {
  if (err) {
    return console.error(err);
  }

  var client = s3.createClient({s3Options: awsCreds});

  var uploader = client.uploadDir({
    localDir: 'www/dist',
    deleteRemoved: true,
    s3Params: {
      Bucket: config.bucket,
      Prefix: config.prefix,
      ACL: 'public-read',
    }
  });

  uploader.on('end', function () {
    openurl.open(config.baseUrl);

    ncp.copy(config.baseUrl, function () {
      console.log('Copied url "[0;1;32m' + config.baseUrl + '[0m" to clipboard');
    });
  });
});
