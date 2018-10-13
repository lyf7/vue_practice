// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import VueResource from '../node_modules/vue-resource'
import Vuex from 'vuex'

import 'common/stylus/index.styl'

Vue.config.productionTip = false

Vue.use(VueResource)
Vue.use(Vuex)

const store = new Vuex.Store({
  state: {},
  mutations: {}
})

/* eslint-disable no-new */
new Vue({
  el: '#body',
  router,
  store,
  components: { App },
  template: '<App/>',
  http: {
    root: '/',
    headers: {
      Authorization: 'Basic YXBpOnBhc3N3b3Jk'
    }
  }
})
