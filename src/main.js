// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import SSB from './ssb'
import router from './router'
import VueAsyncData from 'vue-async-data'

Vue.config.productionTip = false
Vue.use(VueAsyncData)

frameworkLoader.load('ssb').then(function(sbot) {
  Vue.use(SSB, {ssb: sbot})

  /* eslint-disable no-new */
  new Vue({
    el: '#app',
    router,
    template: '<App/>',
    components: { App }
  })
})
