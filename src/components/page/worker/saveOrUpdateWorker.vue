<template>
    <div class="saveOrUpdateCrud">
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item></el-breadcrumb-item>
            <el-breadcrumb-item>{{title}}</el-breadcrumb-item>
        </el-breadcrumb>
        <el-form :model="upsertForm" size="mini" :rules="rules" ref="upsertForm" label-width="80px"  style="margin-top: 20px;position: relative;" >
            <input type="hidden" :value="upsertForm.id">
            <div class="avatar-uploader-div" style="position: absolute;left: 500px">
                <el-tooltip class="item" effect="light" content="点击可以上传图片" placement="right">
                    <el-row style="width:160px;">
                        <el-upload align="center" class="avatar-uploader" :headers="{token:$store.getters.getToken}" :action="uploadAvatarUrl" :show-file-list="false" :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
                            <img v-if="flag" :src="upsertForm.imgUrl" class="avatar">
                            <img v-else src="../../../assets/img/avatar.png" class="avatar">
                            <div class="el-upload__tip" slot="tip">支持png、jpg、jpeg等格式<p>大小不超过<strong style="color: #FE6A66">2MB</strong></p>
                            </div>
                        </el-upload>
                    </el-row>
                </el-tooltip>
            </div>
                    <el-form-item label="员工姓名" prop="name" style="width: 400px">
                        <el-input  v-model="upsertForm.name" auto-complete="off" v-on:input="transPinyin" :disabled="saveOrUpdateVisible"></el-input>
                    </el-form-item>
                    <el-form-item label="用户名" prop="username" style="width: 400px">
                        <el-input  v-model="upsertForm.username" auto-complete="off" :disabled="saveOrUpdateVisible"></el-input>
                    </el-form-item>
                     <!-- <el-form-item label="性别" prop="sex">
                         <el-input  v-model="upsertForm.sex" auto-complete="off"></el-input>
                     </el-form-item>-->
                    <el-form-item label="性别" prop="sex" >
                        <el-radio v-for="item in sexList" :key="item.sex" v-model="upsertForm.sex" :label="item.sex">{{item.sex}}</el-radio>
                    </el-form-item>
                      <el-form-item label="年龄" prop="age" style="width: 400px">
                         <el-input  v-model="upsertForm.age" auto-complete="off"></el-input>
                     </el-form-item>
                    <el-form-item label="邮箱" prop="email" style="width: 400px">
                        <el-input  v-model="upsertForm.email" auto-complete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="手机" prop="tel" style="width: 400px">
                        <el-input  v-model="upsertForm.tel" auto-complete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="部门" prop="departmentId" >
                        <el-select v-model="upsertForm.departmentId" @change="findDeptList" size="mini">
                            <el-option v-for="item in deptList" :key="item.deptId" :label="item.deptName" :value="item.deptId"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="岗位" prop="postId">
                        <el-select v-model="upsertForm.postId" @change="findPostList" size="mini">
                            <el-option v-for="item in postList" :key="item.postId" :label="item.postName" :value="item.postId"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="工号" prop="workNumber" style="width: 400px">
                        <el-input  v-model="upsertForm.workNumber" auto-complete="off"></el-input>
                    </el-form-item>
                      <!--<el-form-item label="头像" prop="imgUrl">
                         <el-input  v-model="upsertForm.imgUrl" auto-complete="off"></el-input>
                     </el-form-item>-->

                    <!--<el-form-item label="角色" prop="roleType">
                        <el-select v-model="upsertForm.roleType" @change="findRoleType" size="mini">
                            <el-option v-for="item in roleTypeList" :key="item.roleType" :label="item.roleName" :value="item.roleType"></el-option>
                        </el-select>
                    </el-form-item>-->
                    <el-form-item label="角色" prop="roleType">
                        <el-radio v-for="item in roleTypeList" :key="item.roleType" v-model="upsertForm.roleType" :label="item.roleType">{{item.roleName}}</el-radio>
                    </el-form-item>

        </el-form>
        <div  class="dialog-footer" style="text-align: center;">
            <el-button class="large" size="mini" @click="close">取 消</el-button>
            <el-button class="large" size="mini" type="primary" v-if="title=='增加'"  @click="save('upsertForm')">确 定</el-button>
            <el-button class="large" size="mini" type="primary" v-else  @click="update('upsertForm')">确 定</el-button>
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
                        roleType: '',
                        roleName: '',
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
                roleTypeList:[],
                sexList:[],
                uploadAvatarUrl: `api/worker/uploadAvatar`,
                flag: false,
                saveOrUpdateVisible:false,


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

                            postId: [
                                  { required: true, message: '请选择岗位', trigger: 'blur',transform:val=>val.trim() },
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
                          roleType: [
                                  { required: true, message: '请输入角色', trigger: 'blur',transform:val=>val.trim() },
                                  {  max: 32, message: '长度必须少于32个字符', trigger: 'blur' }
                              ],
                            roleName: [
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
                            imgUrl: [
                                { required: true, message: '请输入头像', trigger: 'blur',transform:val=>val.trim() },
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

            this.findRoleType();
            this.getSexList();
            this.isSaveOrUpdate();
        },
        mounted(){

        },
        methods:{

            isSaveOrUpdate(){
                if(this.title==='增加'){
                    this.saveOrUpdateVisible = false;
                }else {
                    this.saveOrUpdateVisible = true;
                }
            },

            save(formName){
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

            update(formName){
                this.$refs[formName].validate(valid=>{
                    axios({
                        url:`api/worker/update/updateWorker`,
                        method:'POST',
                        data:this.upsertForm
                    }).then(res=>{
                        this.$message({
                            message: this.title+'成功',
                            type: 'success'
                        });
                        this.$emit('closeSaveOrUpdate',true);
                    })
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


            findRoleType(){
                this.roleTypeList = [{
                    roleType: '1',
                    roleName: '管理员'
                },{
                    roleType: '2',
                    roleName: '普通员工'
                }]
            },
            getSexList(){
                this.sexList=[
                    {sex:'男'},
                    {sex:'女'}]
            },

            transPinyin(){
                let n = this.upsertForm.name;
                this.upsertForm.username = pinyinUtil.getPinyin(n,'',false);
            },

            close(){
                this.$emit('closeSaveOrUpdate');
            },


            /*--------------------图片上传------------------------------*/
            handleAvatarSuccess(res, file) {
                //图片上传
                this.upsertForm.imgUrl = res;
                console.log("图片地址:"+this.upsertForm.imgUrl);
                this.flag = true;
            },

            beforeAvatarUpload(file) {
                const isJPG =
                    file.type === "image/jpeg" || file.type === "image/png";
                const isLt2M = file.size / 1024 / 1024 < 2;
                if (!isJPG) {
                    this.$message.error("上传头像图片只能是 JPEG/JPG/PNG 格式!");
                }
                if (!isLt2M) {
                    this.$message.error("上传头像图片大小不能超过 2MB!");
                }
                return isJPG && isLt2M;
            },

        }
    }
</script>

<style scoped lang="scss">
    .saveOrUpdateCrud{
        margin: 20px 0 0 10px;
    }

    .avatar-uploader-div {
        position: absolute;
        right: 850px;
        z-index: 2000;
    }
    /deep/ .el-upload {
        background-color: #f0f0f0;
    }
    .avatar-uploader .el-upload:hover {
        border-color: #409eff;
    }

    .avatar-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: 108px;
        height: 108px;
        line-height: 108px;
        text-align: center;
    }

    .avatar {
        width: 108px;
        height: 108px;
        display: block;
        border-radius: 50%;
    }

</style>