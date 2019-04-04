<template>
    <div class="saveOrUpdateCrud">
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item></el-breadcrumb-item>
            <el-breadcrumb-item>{{title}}</el-breadcrumb-item>
        </el-breadcrumb>
        <el-form :model="upsertForm" size="mini" :rules="rules" ref="upsertForm" label-width="80px" style="margin-top: 20px;" >
            <input type="hidden" :value="upsertForm.id">
                    <el-form-item label="员工姓名" prop="name">
                        <el-input  v-model="upsertForm.name" auto-complete="off" v-on:input="transPinyin" ></el-input>
                    </el-form-item>
                    <el-form-item label="用户名" prop="username">
                        <el-input  v-model="upsertForm.username" auto-complete="off"></el-input>
                    </el-form-item>
                      <el-form-item label="性别" prop="sex">
                         <el-input  v-model="upsertForm.sex" auto-complete="off"></el-input>
                     </el-form-item>
                      <el-form-item label="年龄" prop="age">
                         <el-input  v-model="upsertForm.age" auto-complete="off"></el-input>
                     </el-form-item>
                    <el-form-item label="邮箱" prop="email">
                        <el-input  v-model="upsertForm.email" auto-complete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="手机" prop="tel">
                        <el-input  v-model="upsertForm.tel" auto-complete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="部门" prop="deptName">
                        <el-select v-model="upsertForm.departmentId" @change="findDeptList" size="mini">
                            <el-option v-for="item in deptList" :key="item.deptId" :label="item.deptName" :value="item.deptId"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="岗位" prop="postName">
                        <el-select v-model="upsertForm.postId" @change="findPostList" size="mini">
                            <el-option v-for="item in postList" :key="item.postId" :label="item.postName" :value="item.postId"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="工号" prop="workNumber">
                        <el-input  v-model="upsertForm.workNumber" auto-complete="off"></el-input>
                    </el-form-item>
                      <el-form-item label="头像" prop="imgUrl">
                         <el-input  v-model="upsertForm.imgUrl" auto-complete="off"></el-input>
                     </el-form-item>
                      <el-form-item label="角色" prop="role">
                         <el-input  v-model="upsertForm.role" auto-complete="off"></el-input>
                     </el-form-item>



        </el-form>
        <div  class="dialog-footer" style="text-align: center;">
            <el-button class="large" size="mini" @click="close">取 消</el-button>
            <el-button class="large" size="mini" type="primary" v-if="title=='增加'"  @click="saveOrUpdate('upsertForm')">确 定</el-button>
            <el-button class="large" size="mini" type="primary" v-else  @click="saveOrUpdate('upsertForm')">确 定</el-button>
        </div>

    </div>
</template>

<script>
    import axios from 'axios'
    export default {
        name: "saveOrUpdateWorker",
        props: ['title','id'],
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
                        updateTime:'',
                        deptName: '',
                        postName: '',
                        workNumber:''
                },
                deptList:[],
                deptForm:{
                    id:'',
                    deptName:'',
                    deptId:'',
                    createTime:'',
                    updateTime:''
                },
                postList:[],
                postForm:{},

                rules: {
                          username: [
                                  { required: true, message: '请输入用户名', trigger: 'blur',transform:val=>val.trim() },
                                  {  max: 32, message: '长度必须少于32个字符', trigger: 'blur' }
                              ],
                          password: [
                                  { required: true, message: '请输入密码', trigger: 'blur',transform:val=>val.trim() },
                                  {  max: 32, message: '长度必须少于32个字符', trigger: 'blur' }
                              ],
                          sex: [
                                  { required: true, message: '请输入性别', trigger: 'blur',transform:val=>val.trim() },
                                  {  max: 32, message: '长度必须少于32个字符', trigger: 'blur' }
                              ],
                          age: [
                                  { required: true, message: '请输入年龄', trigger: 'blur',transform:val=>val.trim() },
                                  {  max: 32, message: '长度必须少于32个字符', trigger: 'blur' }
                              ],
                          imgUrl: [
                                  { required: true, message: '请输入头像', trigger: 'blur',transform:val=>val.trim() },
                                  {  max: 32, message: '长度必须少于32个字符', trigger: 'blur' }
                              ],
                          postId: [
                                  { required: true, message: '请输入岗位', trigger: 'blur',transform:val=>val.trim() },
                                  {  max: 32, message: '长度必须少于32个字符', trigger: 'blur' }
                              ],
                          email: [
                                  { required: true, message: '请输入邮箱', trigger: 'blur',transform:val=>val.trim() },
                                  {pattern: "^[A-Za-z\\d]+([-_.][A-Za-z\\d]+)*@([A-Za-z\\d]+[-.])+[A-Za-z\\d]{2,4}$", message: "邮箱格式不正确", trigger: "blur"},
                                  {  max: 32, message: '长度必须少于32个字符', trigger: 'blur' }
                              ],
                          tel: [
                                  { required: true, message: '请输入手机', trigger: 'blur',transform:val=>val.trim() },
                                  {pattern: "^1\\d{10}$", message: "请输入11位手机号", trigger: "blur"},
                                  {  max: 32, message: '长度必须少于32个字符', trigger: 'blur' }
                              ],
                          role: [
                                  { required: true, message: '请输入角色', trigger: 'blur',transform:val=>val.trim() },
                                  {  max: 32, message: '长度必须少于32个字符', trigger: 'blur' }
                              ],
                          name: [
                                  { required: true, message: '请输入真实姓名', trigger: 'blur',transform:val=>val.trim() },
                                  {  max: 32, message: '长度必须少于32个字符', trigger: 'blur' }
                              ],
                          departmentId: [
                                  { required: true, message: '请选择部门', trigger: 'blur',transform:val=>val.trim() },
                                  {  max: 32, message: '长度必须少于32个字符', trigger: 'blur' }
                              ],
                          workNumber: [
                                  { required: true, message: '请输入员工工号', trigger: 'blur',transform:val=>val.trim() },
                                  {  max: 32, message: '必须为数字', trigger: 'blur' }
                              ],
                          updateTime: [
                                  { required: true, message: '请输入更新时间', trigger: 'blur',transform:val=>val.trim() },
                                  {  max: 32, message: '长度必须少于32个字符', trigger: 'blur' }
                              ],
                }
            }
        },
        created(){
          if(this.title=='修改'){
              axios({
                  url:`api/worker/update/findWorkerById/${this.id}`,
                  method:'GET'
              }).then(res=>{
                  Object.assign(this.upsertForm,res.data);
              }).catch(error=>{

              })
          }
            if (
                this.deptList.deptName != null
            ) {
                this.upsertForm.deptName = this.deptList.deptName;
            } else {
                this.findDeptList();
            }

            if (
                this.postList.deptName != null
            ) {
                this.upsertForm.postName = this.postList.postName;
            } else {
                this.findPostList();
            }


        },
        mounted(){

        },
        methods:{

            saveOrUpdate(formName){
                this.$refs[formName].validate(valid=>{
                    if(valid){

                        axios({
                            url:`api/worker/findWorkerListByCondition`,
                            method:'POST',
                            data:{
                                username:this.upsertForm.username
                            }
                        }).then(res=>{
                            let num =res.data.length;
                            if(num>0){
                                this.$message.error('该用户名已存在');
                            } else {
                                axios({
                                    url:`api/worker/${this.title==='增加'?'saveWorker':'update/updateWorker'}`,
                                    method:'POST',
                                    data:this.upsertForm
                                }).then(res=>{
                                    this.$message({
                                        message: this.title+'成功',
                                        type: 'success'
                                    });
                                    this.$emit('closeSaveOrUpdate',true);
                                })
                            }
                        }).catch(function (error) {
                            console.log(error);
                        });

                    }
                })
            },
            close(){
                this.$emit('closeSaveOrUpdate');
            },
            findDeptList() {
                this.deptList = [];
                axios({
                    url: `api/dept/findDeptListByCondition`, //部门
                    method: "POST",
                    data:this.deptForm
                })
                    .then(res => {
                        this.deptList = res.data;
                    })
                    .catch(error => {
                        console.log(error);
                    });
            },
            findPostList() {
                this.postList = [];
                axios({
                    url: `api/post/findPostListByCondition`, //岗位
                    method: "POST",
                    data:this.postForm
                })
                    .then(res => {
                        this.postList = res.data;
                    })
                    .catch(error => {
                        console.log(error);
                    });
            },
            transPinyin(){
                let n = this.upsertForm.name;
                this.upsertForm.username = pinyinUtil.getPinyin(n,'',false);
            },

            close(){
                this.$emit('closeSaveOrUpdate');
            },

        }
    }
</script>

<style scoped lang="scss">
    .saveOrUpdateCrud{
        margin: 20px 0 0 10px;
    }
</style>