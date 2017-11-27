export default {
  install: function (Vue, options) {
      Vue.prototype.$ssb = options.ssb
  }
};
