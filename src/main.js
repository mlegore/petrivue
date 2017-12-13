// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import SSB from './ssb'
import router from './router'
import VueAsyncData from 'vue-async-data'
import {pullWorker} from 'ssb-afterparty/channels/worker'
import {pipeIn, pipeOut} from 'ssb-afterparty/connect'
import Worker from 'worker-loader!./sbot.worker.js';

Vue.config.productionTip = false
Vue.use(VueAsyncData)

frameworkLoader.load('ssb').then(async function(sbot) {


  var worker = new Worker()
  var toPipe = pullWorker(worker, 'toPipe')
  var fromPipe = pullWorker(worker, 'fromPipe')
  pipeOut(sbot, sbot.manifest, toPipe)
  sbot = await pipeIn(sbot, fromPipe)
  Vue.use(SSB, {ssb: sbot})
  await sbot.requestPublishPermission('post')

  /* eslint-disable no-new */
  new Vue({
    el: '#app',
    router,
    template: '<App/>',
    components: { App }
  })
})
