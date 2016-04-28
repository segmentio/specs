
'use strict'

let logger = require('koa-logger');
let route = require('koa-route');
let send = require('koa-send');
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
 * Set our routes.
 */

app.use(route.get('/api/clusters', list));
app.use(route.get('/api/clusters/:cluster', services));
app.use(route.get('/api/clusters/:cluster/task/:task', task));

/**
 * App routes.
 */

app.use(serve('./build'));

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
 * the path parameter.
 *
 * @param {String} cluster
 */

function *services(cluster){
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
 * the path parameter
 *
 * @param {String} taskArn
 */

function *task(taskArn){
  let ecs = this.state.ecs;
  let task = yield ecs.task(taskArn);
  this.body = task;
}
