<template>
    <div class="login-wrap">
        <div class="ms-login">
            <div class="ms-title">后台管理系统</div>
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="0px" class="ms-content">
                <el-form-item prop="workNumber">
                    <el-input v-model="ruleForm.workNumber" placeholder="请输入工号">
                        <el-button slot="prepend" icon="el-icon-lx-people"></el-button>
                    </el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input type="password" placeholder="请输入密码" v-model="ruleForm.password" @keyup.enter.native="login('ruleForm')">
                        <el-button slot="prepend" icon="el-icon-lx-lock"></el-button>
                    </el-input>
                </el-form-item>
                <div class="login-btn">
                    <el-button type="primary" @click="login('ruleForm')">登录</el-button>
                </div>
            </el-form>
        </div>
    </div>
</template>

<script>
    import axios from "axios";
    import md5 from 'md5';
    import sha1 from 'sha1';
    let obj;
    export default {
        data: function(){
            return {
                ruleForm: {
                    workNumber: '',
                    password: ''
                },
                rules: {
                    workNumber: [
                        { required: true, message: '请输入工号', trigger: 'blur' }
                    ],
                    password: [
                        { required: true, message: '请输入密码', trigger: 'blur' }
                    ]
                }
            }
        },
        methods: {
            login(ruleForm) {
                this.$refs[ruleForm].validate((valid) => {
                   /* localStorage.setItem('ms_username',this.ruleForm.username);*/
                    if (!valid) {
                        this.$alert('请填写符合规范的用户名和密码', '错误', {
                            confirmButtonText: '确定',
                            callback: action => {}
                        });
                        return;
                    }
                    axios({
                        url: `/api/login/login`,
                        method: 'POST',
                        diy: true,
                        data: {
                            workNumber: this.ruleForm.workNumber,
                            password: md5(this.ruleForm.password)
                            /*   token: obj.getToken()*/
                        }
                    }).then(res => {
                        if (!res.result.success) {
                            /*   obj.reset();*/
                            this.ruleForm.workNumber = '';
                            this.ruleForm.password = '';
                            this.$alert(res.result.msg, '错误', {
                                confirmButtonText: '确定',
                                callback: action => {

                                }
                            });
                            return;
                        }
                        var morpas=res.data2.password;
                        var oldpas=sha1(md5("66666666"));
                        localStorage.setItem('ms_username',res.data2.name);
                        localStorage.setItem('morpas',morpas);
                        this.$store.commit('setToken', res.data);
                        this.$store.commit('setWorker', res.data2);

                        if(morpas==oldpas){
                            this.$router.push({path:'/forget',query: {msg:'您账号的密码不安全，请重新设置密码'}});
                        }else {
                            this.$router.push('/');
                        }

                    })
                });
            }
        }
    }
</script>

<style scoped>
    .login-wrap{
        position: relative;
        width:100%;
        height:100%;
        background-image: url(../../../assets/img/login-bg.jpg);
        background-size: 100%;
    }
    .ms-title{
        width:100%;
        line-height: 50px;
        text-align: center;
        font-size:20px;
        color: #fff;
        border-bottom: 1px solid #ddd;
    }
    .ms-login{
        position: absolute;
        left:50%;
        top:50%;
        width:350px;
        margin:-190px 0 0 -175px;
        border-radius: 5px;
        background: rgba(255,255,255, 0.3);
        overflow: hidden;
    }
    .ms-content{
        padding: 30px 30px;
    }
    .login-btn{
        text-align: center;
    }
    .login-btn button{
        width:100%;
        height:36px;
        margin-bottom: 10px;
    }
    .login-tips{
        font-size:12px;
        line-height:30px;
        color:#fff;
    }
</style>