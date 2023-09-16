import Vue from 'vue'
import App from './App.vue'
import axios from 'axios'
import 'font-awesome/css/font-awesome.css'
import vTitle from 'vuejs-title'

Vue.config.productionTip = false

Vue.prototype.$axios = axios

Vue.use(vTitle, {
  cssClass: 'players-tooltip',
  maxHeight: '600px',
  fontSize: '16px',
  padding: '30px 20px'
})

new Vue({
  render: (h) => h(App)
}).$mount('#app')
