import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
    routes: [
        {
            path: '/',
            redirect: '/dashboard'
        },
        {
            path: '/',
            component: resolve => require(['../components/common/Home.vue'], resolve),
            meta: { title: '自述文件' },
            children:[
                {
                    path: '/dashboard',
                    component: resolve => require(['../components/page/index/Dashboard.vue'], resolve),
                    meta: { title: '系统首页' }
                },
                {
                    path: '/wageAttribute',
                    component: resolve => require(['../components/page/wage/wageAttribute.vue'], resolve),
                    meta: { title: '工资属性' }
                },
                {
                    path: '/saveOrUpdateWageAttribute',
                    component: resolve => require(['../components/page/wage/saveOrUpdateWageAttribute.vue'], resolve),
                    meta: { title: '工资属性新增/修改' }
                },
                {
                    path: '/wageType',
                    component: resolve => require(['../components/page/wage/wageType.vue'], resolve),
                    meta: { title: '工资类型' }
                },
                {
                    path: '/salaryEntry',
                    component: resolve => require(['../components/page/wage/salaryEntry.vue'], resolve),
                    meta: { title: '工资条' }
                },
                {
                    path: '/myPayslip',
                    component: resolve => require(['../components/page/wage/myPayslip.vue'], resolve),
                    meta: { title: '我的工资条' }
                },
                {
                    path: '/icon',
                    component: resolve => require(['../components/page/form/icon/Icon.vue'], resolve),
                    meta: { title: '自定义图标' }
                },
                {
                    path: '/table',
                    component: resolve => require(['../components/page/form/table/BaseTable.vue'], resolve),
                    meta: { title: '基础表格' }
                },
                {
                    path: '/tabs',
                    component: resolve => require(['../components/page/form/tab/Tabs.vue'], resolve),
                    meta: { title: 'tab选项卡' }
                },
                {
                    path: '/form',
                    component: resolve => require(['../components/page/form/BaseForm.vue'], resolve),
                    meta: { title: '基本表单' }
                },
                {
                    // 富文本编辑器组件
                    path: '/editor',
                    component: resolve => require(['../components/page/form/editor/VueEditor.vue'], resolve),
                    meta: { title: '富文本编辑器' }
                },
                {
                    // markdown组件
                    path: '/markdown',
                    component: resolve => require(['../components/page/form/editor/Markdown.vue'], resolve),
                    meta: { title: 'markdown编辑器' }    
                },
                {
                    // 图片上传组件
                    path: '/upload',
                    component: resolve => require(['../components/page/form/upload/Upload.vue'], resolve),
                    meta: { title: '文件上传' }   
                },
                {
                    // 拖拽列表组件
                    path: '/drag',
                    component: resolve => require(['../components/page/form/draggable/DragList.vue'], resolve),
                    meta: { title: '拖拽列表' }
                },
                {
                    // 拖拽Dialog组件
                    path: '/dialog',
                    component: resolve => require(['../components/page/form/draggable/DragDialog.vue'], resolve),
                    meta: { title: '拖拽弹框' }
                },
                {
                    // 权限页面
                    path: '/permission',
                    component: resolve => require(['../components/page/error/Permission.vue'], resolve),
                    meta: { title: '权限测试', permission: true }
                },
                {
                    path: '/404',
                    component: resolve => require(['../components/page/error/404.vue'], resolve),
                    meta: { title: '404' }
                },
                {
                    path: '/403',
                    component: resolve => require(['../components/page/error/403.vue'], resolve),
                    meta: { title: '403' }
                },
                {
                    path: '/worker',
                    component: resolve => require(['../components/page/worker/worker.vue'], resolve),
                    meta: { title: '员工管理' }
                },
                {
                    path: '/dept',
                    component: resolve => require(['../components/page/worker/dept/dept.vue'], resolve),
                    meta: { title: '部门管理' }
                },
                {
                    path: '/post',
                    component: resolve => require(['../components/page/worker/post/post.vue'], resolve),
                    meta: { title: '岗位管理' }
                },
                {
                    path: '/forget',
                    component: resolve => require(['../components/page/forget/forgetPassword.vue'], resolve),
                    meta: { title: '修改密码' }
                },
            ]
        },
        {
            path: '/login',
            component: resolve => require(['../components/page/login/Login.vue'], resolve)
        },

        {
            path: '*',
            redirect: '/404'
        }
    ]
})
