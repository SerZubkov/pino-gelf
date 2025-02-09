#! /usr/bin/env node

'use strict';

const program = require('commander');
const version = require('./package.json').version;
const pinoGelf = require('./lib/pino-gelf');

program
  .version(version);

program
  .command('log')
  .description('Run Pino-GELF')
  .option('-h, --host [host]', 'Graylog Host')
  .option('-p, --port [port]', 'Graylog Port', parseInt)
  .option('-P, --protocol [protocol]', 'Graylog protocol (UDP, HTTP, HTTPS, TCP, TLS)')
  .option('-m, --max-chunk-size [maxChunkSize]', 'Graylog UDP Input Maximum Chunk Size', parseInt)
  .option('-k, --keep-alive [keepAlive]', 'HTTP/TCP keep alive')
  .option('-r, --reconnection-limit [reconnectionLimit]', 'TCP reconnection limit', parseInt)
  .option('-d, --reconnection-delay [reconnectionDelay]', 'TCP reconnection delay', parseInt)
  .option('-v, --verbose', 'Output GELF to console')
  .option('-t, --passthrough', 'Output original input to stdout to allow command chaining')
  .action(function () {
    const opts = {
      customKeys: this.specifyCustomFields || [],
      host: this.host || '127.0.0.1',
      protocol: this.protocol || 'udp',
      maxChunkSize: this.maxChunkSize || 1420,
      keepAlive: this.keepAlive != null ? this.keepAlive.toLowerCase() !== 'false' : true,
      reconnectionLimit: this.reconnectionLimit || -1,
      reconnectionDelay: this.reconnectionDelay || 1000,
      port: this.port || 12201,
      verbose: (this.verbose && !this.passthrough) || false,
      passthrough: this.passthrough || false
    };

    switch(opts.protocol) {
    case 'udp':
    case 'http':
    case 'https':
    case 'tcp':
    case 'tls':
      break;
    default:
      throw new Error('Unsupported protocol ' + opts.protocol);
    } 

    pinoGelf(opts);
  });

program
  .parse(process.argv);
