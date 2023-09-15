import Vue from 'vue'
import App from './App.vue'
import axios from 'axios'
import 'font-awesome/css/font-awesome.css'
import VTooltip from 'v-tooltip'

Vue.config.productionTip = false

Vue.prototype.$axios = axios;

Vue.use(VTooltip);

new Vue({
  render: h => h(App),
}).$mount('#app')
