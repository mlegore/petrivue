// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import SSB from './ssb'
import router from './router'
import VueAsyncData from 'vue-async-data'
import {pullWorker} from 'ssb-afterparty/channels/worker'
import {pipeIn, pipeOut} from 'ssb-afterparty/connect'
import pull from 'pull-stream'
import toPull from 'stream-to-pull-stream'
import Worker from 'worker-loader!./sbot.worker.js';
import WorkerStream from 'workerstream-channel'

Vue.config.productionTip = false
Vue.use(VueAsyncData)

frameworkLoader.load('ssb').then(async function(sbot) {
  var worker = new Worker()
  var stream = sbot.connect()
  var workerStream = WorkerStream(worker, 'toPipe')

  // Pipe it all together
  stream.pipe(workerStream).pipe(stream)

  var throttle = 0
  sbot = await pipeIn(sbot, pullWorker(worker, 'fromPipe'), null, throttle)
  Vue.use(SSB, {ssb: sbot})
  await sbot.requestPublishPermission('post')

  sbot.about.get((err, val) => {
    if(err)
      console.error(err)
    console.log(val)
  })

  /* eslint-disable no-new */
  new Vue({
    el: '#app',
    router,
    template: '<App/>',
    components: { App }
  })
})
