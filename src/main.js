import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css'; // 默认主题
// import '../static/css/theme-green/index.css';       // 浅绿色主题
import './assets/css/icon.css';
import './components/common/directives';
import "babel-polyfill";

Vue.config.productionTip = false
Vue.use(ElementUI, {
    size: 'small'
});
Vue.prototype.$axios = axios;

//使用钩子函数对路由进行权限跳转
router.beforeEach((to, from, next) => {
    const role = localStorage.getItem('ms_username');
    if (!role && to.path !== '/login') {
        next('/login');
    }
    else {
            next();
    }
})


new Vue({
    router,
    store,
    created() {


        var me = this;
        // 添加请求拦截器
        axios.interceptors.request.use(function (config) {
            config.headers.token = me.$store.getters.getToken;
            return config;
        }, function (error) {
            return Promise.reject(error);
        });
        // 添加响应拦截器
        axios.interceptors.response.use(function (response) {
            let resConfig = response.config;
            if (response.data && response.data.result && response.data.result.code === 909) {
                me.$router.replace('/login');
            }
            else if (response.data && response.data.result && !response.data.result.success) {
                if (!resConfig.diy) {
                    me.$message({
                        showClose: true,
                        message: response.data.result.msg,
                        type: 'error'
                    });
                    throw new Error();
                }

            }
            return response.data;
        }, function (error) {
            if (400 == error.response.status) {
                me.$alert(error.response.data.errors[0].defaultMessage, '错误', {
                    confirmButtonText: '确定'
                });
            } else if (500 == error.response.status) {
                me.$alert('服务器错误,请联系管理员', '错误', {
                    confirmButtonText: '确定'
                });
            } else if (404 == error.response.status) {
                me.$message({
                    showClose: true,
                    message: 'url路径错误',
                    type: 'error'
                });
            }
            return Promise.reject(error);
        } );
    },
    render: h => h(App)
}).$mount('#app')