
'use strict'

let logger = require('koa-logger');
let route = require('koa-route');
let send = require('koa-send');
let Cache = require('./cache');
let AWS = require('aws-sdk');
let cors = require('kcors');
let path = require('path');
let ECS = require('./ecs');
let koa = require('koa');
let serve = require('koa-static');

/**
 * Create our app
 */

let app = koa();
let ecs = new ECS(AWS);
let cache = new Cache(ecs);

/**
 * Set a cache error handler
 */

cache.on('error', err => console.log('cache error:', err.stack));

/**
 * Export the app
 */

module.exports = app;

/**
 * Add in a logger
 */

app.use(logger());

/**
 * Setup an error handler.
 */

app.use(function *(next){
  try {
    yield next;
  } catch (err) {
    console.log('error:', err.stack);
  }
});

/**
 * Add our CORS handler.
 */

app.use(cors());

/**
 * Create our state.
 */

app.use(function *(next){
  this.cache = cache;
  this.ecs = ecs;
  yield next;
});

/**
 * Set our routes.
 */

app.use(route.get('/api/clusters', list));
app.use(route.get('/api/clusters/:cluster', services));
app.use(route.get('/api/clusters/:cluster/task/:task', task));

/**
 * Static routes.
 */

app.use(route.get('/bundle.js', bundle));
app.use(route.get('/*', index));

/**
 * Transfer the index page
 */

function *index(){
  yield send(this, 'build/index.html');
}

/**
 * Transfer js bundle
 */

function *bundle(){
  yield send(this, 'build/bundle.js');
}

/**
 * Return a json array of all the clusters
 */

function *list(){
  let cache = this.cache;
  let clusters = cache.clusters();
  this.body = clusters;
}

/**
 * Returns a json array of a given cluster in
 * the path parameter.
 *
 * @param {String} cluster
 */

function *services(cluster){
  let cache = this.cache;
  this.body = cache.services(cluster);
}

/**
 * Further describes a task, given the ARN in
 * the path parameter
 *
 * @param {String} taskArn
 */

function *task(taskArn){
  let ecs = this.state.ecs;
  let task = yield ecs.task(taskArn);
  this.body = task;
}
