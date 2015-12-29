
'use strict'

let logger = require('koa-logger');
let route = require('koa-route');
let views = require('koa-views');
let send = require('koa-send');
let AWS = require('aws-sdk');
let cors = require('kcors');
let path = require('path');
let ECS = require('./ecs');
let koa = require('koa');

/**
 * Create our app
 */

let app = koa();

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
  this.state.ecs = new ECS(AWS);
  yield next;
});

/**
 * Add the views handling.
 */

app.use(views('../views'));

/**
 * Add the static content.
 */

const BUILD_PATH = '/build';

app.use(route.get(BUILD_PATH + '/(.*)', serve));

function *serve(next){
  if (this.method == 'HEAD' || this.method == 'GET') {
    this.path = this.path.substring(BUILD_PATH.length);
    if (yield send(this, this.path, { root: path.join(__dirname, '../../', BUILD_PATH) })) return;
  }
  yield* next;
}

/**
 * Set our routes.
 */

app.use(route.get('/', index));
app.use(route.get('/clusters', list));
app.use(route.get('/services', services));
app.use(route.get('/task', task));

/**
 * Render the index page
 */

function *index(){
  yield this.render('index');
}

/**
 * Return a json array of all the clusters
 */

function *list(){
  let ecs = this.state.ecs; 
  let clusters = yield ecs.clusters();
  this.body = clusters;
}

/**
 * Returns a json array of a given cluster in
 * the query parameter
 *
 * @param {String} ?cluster
 */

function *services(){
  let cluster = this.query.cluster;
  let ecs = this.state.ecs;
  let services = yield ecs.services(cluster);

  let taskCalls = services.map((service) => {
    return ecs.task(service.taskDefinition);
  });
  
  let tasks = yield Promise.all(taskCalls);
  services.forEach((service, i) => {
    service.task = tasks[i].taskDefinition;
  });

  this.body = services;
}

/**
 * Further describes a task, given the ARN in
 * the query parameter
 *
 * @param {String} ?task
 */

function *task(){
  let taskArn = this.query.task;
  let ecs = this.state.ecs;
  let task = yield ecs.task(taskArn);
  this.body = task;
}