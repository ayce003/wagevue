<template>
    <div class="sidebar">
        <el-menu class="sidebar-el-menu" :default-active="onRoutes" :collapse="collapse" background-color="#324157"
            text-color="#bfcbd9" active-text-color="#20a0ff" unique-opened router>
            <template v-if="role==1"  v-for="item in items">
                <template v-if="item.subs">
                    <el-submenu :index="item.index" :key="item.index">
                        <template slot="title">
                            <i :class="item.icon"></i><span slot="title">{{ item.title }}</span>
                        </template>
                        <template v-for="subItem in item.subs">
                            <el-submenu v-if="subItem.subs" :index="subItem.index" :key="subItem.index">
                                <template slot="title">{{ subItem.title }}</template>
                                <el-menu-item v-for="(threeItem,i) in subItem.subs" :key="i" :index="threeItem.index">
                                    {{ threeItem.title }}
                                </el-menu-item>
                            </el-submenu>
                            <el-menu-item v-else :index="subItem.index" :key="subItem.index">
                                {{ subItem.title }}
                            </el-menu-item>
                        </template>
                    </el-submenu>
                </template>
                <template v-else>
                    <el-menu-item :index="item.index" :key="item.index">
                        <i :class="item.icon"></i><span slot="title">{{ item.title }}</span>
                    </el-menu-item>
                </template>
            </template>

            <template v-if="role==2"  v-for="item in items2">
                <template v-if="item.subs">
                    <el-submenu :index="item.index" :key="item.index">
                        <template slot="title">
                            <i :class="item.icon"></i><span slot="title">{{ item.title }}</span>
                        </template>
                        <template v-for="subItem in item.subs">
                            <el-submenu v-if="subItem.subs" :index="subItem.index" :key="subItem.index">
                                <template slot="title">{{ subItem.title }}</template>
                                <el-menu-item v-for="(threeItem,i) in subItem.subs" :key="i" :index="threeItem.index">
                                    {{ threeItem.title }}
                                </el-menu-item>
                            </el-submenu>
                            <el-menu-item v-else :index="subItem.index" :key="subItem.index">
                                {{ subItem.title }}
                            </el-menu-item>
                        </template>
                    </el-submenu>
                </template>
                <template v-else>
                    <el-menu-item :index="item.index" :key="item.index">
                        <i :class="item.icon"></i><span slot="title">{{ item.title }}</span>
                    </el-menu-item>
                </template>
            </template>
        </el-menu>
    </div>
</template>

<script>
    import bus from '../common/bus';
    export default {
        data() {
            return {
                collapse: false,
                role:this.$store.getters.getWorker.roleType,
                token: this.$store.getters.getToken,
                items: [
                    {
                        icon: 'el-icon-lx-home',
                        index: 'dashboard',
                        title: '系统首页'
                    },
                   /* {
                        icon: 'el-icon-lx-calendar',
                        index: '3',
                        title: '表单相关',
                        subs: [
                            {
                                icon: 'el-icon-lx-cascades',
                                index: 'table',
                                title: '基础表格'
                            },
                            {
                                index: 'form',
                                title: '基本表单'
                            },
                            {
                                icon: 'el-icon-lx-copy',
                                index: 'tabs',
                                title: 'tab选项卡'
                            },
                            {
                                index: 'upload',
                                title: '文件上传'
                            },
                            {
                                icon: 'el-icon-lx-emoji',
                                index: 'icon',
                                title: '自定义图标'
                            },
                            {
                                index: '3-2',
                                title: '三级菜单',
                                subs: [
                                    {
                                        index: 'editor',
                                        title: '富文本编辑器'
                                    },
                                    {
                                        index: 'markdown',
                                        title: 'markdown编辑器'
                                    },
                                ]
                            },
                            {
                                icon: 'el-icon-rank',
                                index: '6',
                                title: '拖拽组件',
                                subs: [
                                    {
                                        index: 'drag',
                                        title: '拖拽列表',
                                    },
                                    {
                                        index: 'dialog',
                                        title: '拖拽弹框',
                                    }
                                ]
                            }
                        ]
                    },*/
                    /*{
                        icon: 'el-icon-lx-warn',
                        index: '7',
                        title: '错误处理',
                        subs: [
                            {
                                index: 'permission',
                                title: '权限测试'
                            },
                            {
                                index: '404',
                                title: '404页面'
                            }
                        ]
                    },*/
                    {
                        icon: 'el-icon-rank',
                        index: 'wage',
                        title: '工资管理',
                        subs: [
                            {
                                icon: 'el-icon-lx-emoji',
                                index: 'wageAttribute',
                                title: '工资属性'
                            },
                            {
                                icon: 'el-icon-lx-emoji',
                                index: 'wageType',
                                title: '工资类型'
                            },
                            {
                                icon: 'el-icon-lx-emoji',
                                index: 'salaryEntry',
                                title: '工资条'
                            }
                        ]
                    },
                    {
                        icon: 'el-icon-lx-people',
                        index: 'worker',
                        title: '员工管理',
                        subs: [
                            {
                                icon: 'el-icon-lx-people',
                                index: 'worker',
                                title: '员工管理'
                            },
                            {
                                index: 'dept',
                                title: '部门管理'
                            },{
                                index: 'post',
                                title: '岗位管理'
                            }
                        ]
                    }
                ],
                items2: [
                    {
                        icon: 'el-icon-lx-home',
                        index: 'dashboard',
                        title: '系统首页'
                    },
                    {
                        icon: 'el-icon-lx-people',
                        index: 'myPayslip',
                        title: '我的工资条'
                    },
                ]
            }
        },
        computed:{
            onRoutes(){
                return this.$route.path.replace('/','');
            }

        },
        created(){
            // 通过 Event Bus 进行组件间通信，来折叠侧边栏
            bus.$on('collapse', msg => {
                this.collapse = msg;
            })
        }
    }
</script>

<style scoped>
    .sidebar{
        display: block;
        position: absolute;
        left: 0;
        top: 70px;
        bottom:0;
        overflow-y: scroll;
    }
    .sidebar::-webkit-scrollbar{
        width: 0;
    }
    .sidebar-el-menu:not(.el-menu--collapse){
        width: 250px;
    }
    .sidebar > ul {
        height:100%;
    }
</style>
