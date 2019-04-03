<template>
    <div class="look">
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item></el-breadcrumb-item>
            <el-breadcrumb-item>查看</el-breadcrumb-item>
        </el-breadcrumb>
        <el-form :model="upsertForm" size="mini"  ref="upsertForm" label-width="80px" style="margin-top: 20px;" >
            <input type="hidden" :value="upsertForm.id">
                      <el-form-item label="用户名" prop="username">
                         {{upsertForm.username}}
                     </el-form-item>
                      <el-form-item label="密码" prop="password">
                         {{upsertForm.password}}
                     </el-form-item>
                      <el-form-item label="性别" prop="sex">
                         {{upsertForm.sex}}
                     </el-form-item>
                      <el-form-item label="年龄" prop="age">
                         {{upsertForm.age}}
                     </el-form-item>
                      <el-form-item label="头像" prop="imgUrl">
                         {{upsertForm.imgUrl}}
                     </el-form-item>
                      <el-form-item label="岗位id" prop="postId">
                         {{upsertForm.postId}}
                     </el-form-item>
                      <el-form-item label="邮箱" prop="email">
                         {{upsertForm.email}}
                     </el-form-item>
                      <el-form-item label="手机" prop="tel">
                         {{upsertForm.tel}}
                     </el-form-item>
                      <el-form-item label="角色(1" prop="role">
                         {{upsertForm.role}}
                     </el-form-item>
                      <el-form-item label="真实姓名" prop="name">
                         {{upsertForm.name}}
                     </el-form-item>
                      <el-form-item label="部门id" prop="departmentId">
                         {{upsertForm.departmentId}}
                     </el-form-item>
        </el-form>
        <div  class="dialog-footer" style="text-align: center;">
            <el-button class="large" size="mini" @click="close">取 消</el-button>
        </div>
    </div>
</template>

<script>
    import axios from 'axios'
    export default {
        name: "lookWorker",
        props: ['id'],
        data(){
            return {
                upsertForm:{
                        id:'',
                        username:'',
                        password:'',
                        sex:'',
                        age:'',
                        imgUrl:'',
                        postId:'',
                        email:'',
                        tel:'',
                        role:'',
                        name:'',
                        departmentId:'',
                        createTime:'',
                        updateTime:''
                }
            }
        },
        created(){
          axios({
                url:`api/worker/look/lookWorkerById/${this.id}`,
                method:'GET'
            }).then(res=>{
                Object.assign(this.upsertForm,res.data);
            }).catch(error=>{
                console.log(error);
            })
        },
        mounted(){

        },
        methods:{
            close(){
                this.$emit('update:visible');
            }
        }
    }
</script>

<style scoped lang="scss">
    .look{
        width:60%;
        margin: 20px 0 0 10px;
    }
</style>