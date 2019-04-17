<template>
    <div class="foeget-wrap">
        <div class="ms-forget">
    <el-form  :model="pwdForm" :rules="pwdFormRules" ref="pwdForm" label-width="100px">
        <el-form-item label="新密码" prop="newPassword">
            <el-input style="width: 200px" placeholder="请输入新密码" type="password" v-model="pwdForm.newPassword" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="重复新密码" prop="newPassword2">
            <el-input style="width: 200px" placeholder="请重复输入新密码" type="password" v-model="pwdForm.newPassword2" auto-complete="off"></el-input>
        </el-form-item>
    </el-form>
    <div style="padding-left: 100px">
        <el-button type="cancel" class="large" @click="closeDialog">取 消</el-button>
        <el-button class="large" type="common" @click="updatePassword()">确 定</el-button>
    </div>
        </div>
    </div>
</template>

<script>
    import axios from "axios";
    import md5 from 'md5';

    export default {
        name: "forgetPassword",
        data(){
            var validatePass = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请输入密码'));
                } else {
                    if (this.pwdForm.newPassword !== '') {
                        this.$refs.pwdForm.validateField('newPassword2');
                    }
                    callback();
                }
            };
            var validatePass2 = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请再次输入密码'));
                } else if (value !== this.pwdForm.newPassword) {
                    callback(new Error('两次输入密码不一致!'));
                } else {
                    callback();
                }
            };
            return{
                pwdForm: {
                    newPassword: '',
                    newPassword2: ''
                },
                pwdFormRules: {
                    newPassword: [
                        { required: true, validator: validatePass, trigger: 'blur' },
                        { min: 8, message: '至少是8位长度', trigger: 'blur' }
                    ],
                    newPassword2: [
                        { required: true, validator: validatePass2, trigger: 'blur' },
                        { min: 8, message: '至少是8位长度', trigger: 'blur' }
                    ]
                }
            }
        },
        methods:{
            updatePassword() {
                this.$refs['pwdForm'].validate(valid => {
                    if (valid) {
                        axios({
                            url: `/api/forget/updatePassword`,
                            method: 'POST',
                            data: { newPassword: md5(this.pwdForm.newPassword) }
                        }).then(res => {
                            this.$message({
                                message: '修改密码成功',
                                type: 'success'
                            });
                            // this.closeDialog();
                            this.$router.replace('/login');
                        })
                    }
                })

            }
        }
    }
</script>

<style scoped >
    .foeget-wrap{
        position: relative;
        width:100%;
        height:100%;
        background-image: url(../../../assets/img/bg.gray.jpg);
        background-size: 100%;
    }
    .ms-forget{
        position: absolute;
        left:50%;
        top:50%;
        width:350px;
        margin:-190px 0 0 -175px;
        border-radius: 5px;
        background: rgba(255,255,255, 0.3);
    }
</style>