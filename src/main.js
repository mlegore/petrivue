// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import SSB from './ssb'
import router from './router'
import VueAsyncData from 'vue-async-data'
import about from 'ssb-about'

Vue.config.productionTip = false
Vue.use(VueAsyncData)

frameworkLoader.load('ssb').then(async function(sbot) {
  sbot.use(about)
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
