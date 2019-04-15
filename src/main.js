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
    /*else if (to.meta.permission) {
        // 如果是管理员权限则可进入，这里只是简单的模拟管理员权限而已
        role === 'admin' ? next() : next('/403');
    } */
    else {
        // 简单的判断IE10及以下不进入富文本编辑器，该组件不兼容
      /*  if (navigator.userAgent.indexOf('MSIE') > -1 && to.path === '/editor') {
            Vue.prototype.$alert('vue-quill-editor组件不兼容IE10及以下浏览器，请使用更高版本的浏览器查看', '浏览器不兼容通知', {
                confirmButtonText: '确定'
            });
        } else {*/
            next();
        /*}*/
    }
})


new Vue({
    router,
    store,
    created() {


        var me = this;
        // 添加请求拦截器
        let loading, loadingArray = [];
        axios.interceptors.request.use(function (config) {
            // 在发送请求之前做些什么
            config.headers.token = me.$store.getters.getToken;
            if (config.loading !== false) {
                loading = me.$loading({
                    target: document.getElementById('indexMain'),
                    fullscreen: false,
                    background: 'rgba(255,255,255,0.25)'
                })
                loadingArray.push(loading)
            }
            return config;
        }, function (error) {
            // 对请求错误做些什么
             loading && loading.close();
            loadingArray.forEach(item=>item.close())
            loadingArray = []
            return Promise.reject(error);
        });
        // 添加响应拦截器
        axios.interceptors.response.use(function (response) {
            let resConfig = response.config;
            // 对响应数据做点什么
            // loading && loading.close();
            loadingArray.forEach(item=>item.close())
            loadingArray = []

            if (response.data && response.data.result && response.data.result.code === 909) {
                me.$router.replace('/login');

            } else if (response.data && response.data.result && response.data.result.code === 904) {
                me.$message({
                    showClose: true,
                    message: response.data.result.msg,
                    type: 'error'
                });
                if (!config.isDev) {
                    me.$router.replace('/login');
                }

                throw new Error();
            } else if (response.data && response.data.result && !response.data.result.success) {
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
            // 对响应错误做点什么
            // loading && loading.close();
            loadingArray.forEach(item=>item.close())
            loadingArray = []
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