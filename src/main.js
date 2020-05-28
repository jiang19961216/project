// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

// 引入
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

// iconfont.css
import "./assets/fonts/iconfont.css"

// 引入本地存储工具函数
import local from '@/utils/local'

// 引入css重置样式
import "./assets/css/reset.css"

// 注册
Vue.use(ElementUI);

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
