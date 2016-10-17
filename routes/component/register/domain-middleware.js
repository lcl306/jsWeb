/*!
 * domain-middleware - lib/domain.js
 * Copyright(c) 2012 fengmk2 <fengmk2@gmail.com>
 * MIT Licensed
 */

"use strict";

/**
 * Module dependencies.
 */

var cluster = require('cluster');
/**domain是一个EventEmitter对象，它通过"事件的方式"来传递捕获的错误; 如果process在domain包裹之中，将会在domain上触发error事件，反之，将会在process上触发uncaughtException事件
 * domain通过run包裹函数，如run(next)
 * 多个事件循环中传递domain：nextTick入队时，记录当前domain，当入队事件循环被_tickCallback执行时，将新事件的process.domain=之前事件的domain。这样不管如何调用process.nextTick, domain将会一直被传递下去
 * require('domain')后，node通过在nextTick, timer, event三个关键的地方插入domain的代码，让domain在不同的事件循环中传递
 * nextTick：
 * function nextDomainTick(callback) {
	 nextTickQueue.push({callback: callback, domain: process.domain});
   } 
 * event:
 * domain = domain || require('domain');
    if (domain.active && !(this instanceof domain.Domain)) {
      this.domain = domain.active;
    }
 * timer:
 * if (process.domain) timer.domain = process.domain;
 * */
var domain = require('domain');  
var logger = require("./logger").logger;

/**
 * Domain middleware, please use with `cluster` in production env.
 * 
 * @param {Object} options
 *  - {HttpServer} server, we need to close it and stop taking new requests.
 *  - {Number} [killTimeout], worker suicide timeout, default is 30 seconds.
 * @return {Function(req, res, next)}
 */
module.exports = function createMiddleware(options) {
  options = options || {};
  options.killTimeout = options.killTimeout || 30000;
  if (!options.server) {
    throw new Error('server required!');
  }

  return function domainMiddleware(req, res, next) {
    var d = domain.create();
    d.add(req);
    d.add(res);
    d.on('error', function (err) {
      d._throwErrorCount = (d._throwErrorCount || 0) + 1;
      if (d._throwErrorCount > 1) {
        logger.error('[domain-middleware] %s %s throw error %d times.', req.method, req.url, d._throwErrorCount);
        logger.error(err);
        return;
      }

      // Must let current connection close.
      res.setHeader('Connection', 'close');
      next(err);

      // make sure we close down within `options.killTimeout` seconds
      var killtimer = setTimeout(function () {
        logger.log('[%s] [worker:%s] kill timeout, exit now.', new Date(), process.pid);
        if (process.env.NODE_ENV !== 'test') {
          process.exit(1);
        }
      }, options.killTimeout);

      // But don't keep the process open just for that!
      // If there is no more io waitting, just let process exit normally.
      if (typeof killtimer.unref === 'function') {
        // only worked on node 0.10+
        killtimer.unref();
      }

      // cluster mode
      if (cluster.worker) {
        try {
          // stop taking new requests.
          // because server could already closed, need try catch the error: `Error: Not running` 
          options.server.close();
          logger.warn('[%s] [worker:%s] close server!', new Date(), process.pid);

          // Let the master know we're dead.  This will trigger a
          // 'disconnect' in the cluster master, and then it will fork
          // a new worker.
          cluster.worker.disconnect();
          logger.warn('[%s] [worker:%s] worker disconnect!', new Date(), process.pid);
        } catch (er2) {
          // Usually, this error throw cause by the active connections after the first domain error,
          // oh well, not much we can do at this point.
          logger.error('[%s] [worker:%s] Error on server close or worker disconnect!\n%s', new Date(), process.pid, er2.stack);
        }
      }
    });

    d.run(next);
  };
};