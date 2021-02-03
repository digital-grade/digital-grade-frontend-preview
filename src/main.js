import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import '@mdi/font/css/materialdesignicons.css'
import Buefy from 'buefy'
import ApiService from './services/common/api.service'

import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

import { ValidationProvider, extend } from 'vee-validate'
import { ValidationObserver } from 'vee-validate'
import { required, email } from 'vee-validate/dist/rules'
library.add(fas, faCalendarDay)

import { fas, faCalendarDay } from '@fortawesome/free-solid-svg-icons'

import '@/assets/scss/main.scss'

Vue.component('ValidationProvider', ValidationProvider)
Vue.component('ValidationObserver', ValidationObserver)
Vue.component('font-awesome-icon', FontAwesomeIcon)

extend('email', email)

extend('required', {
  ...required,
  message: 'This field is required',
})

extend('password', {
  validate: (value, { other }) => value === other,
  message: 'The password confirmation does not match.',
  params: [{ name: 'other', isTarget: true }],
})

Vue.config.productionTip = false

Vue.use(Buefy, {
  defaultIconComponent: FontAwesomeIcon,
  defaultIconPack: 'fas',
})

ApiService.init()

new Vue({
  router,
  store,
  Buefy,
  render: h => h(App),
}).$mount('#app')
