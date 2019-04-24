<template>
    <div class="margin-40-60-0">
        <div v-show="!saveOrUpdate.visible">
            <!--搜索表单-->
            <div class="search-box">
                <el-form ref="searchForm" size="mini" :rules="rules" :inline="true" :model="searchForm" >
                        <el-form-item label="真实姓名:" prop="name">
                            <el-input v-model="searchForm.name" placeholder="请输入真实姓名"></el-input>
                        </el-form-item>
                        <el-form-item label="岗位" prop="postId">
                            <el-select v-model="searchForm.postId" placeholder="请选择岗位" @change="findPostList"  size="mini">
                                <el-option v-for="item in postList" :key="item.id" :label="item.postName" :value="item.id"></el-option>
                            </el-select>
                        </el-form-item>


                    <el-form-item>
                        <el-button  type="primary" id="findBtn" @click="submit(1)">查询</el-button>
                        <el-button  type="warning" plain @click="clear">清空</el-button>
                    </el-form-item>

                </el-form>

                            <el-button-group style="float:right;vertical-align:top">
                                <el-button type="clear" class="el-icon-lx-down" @click="dialogUploadVisible=true">导入</el-button>
                                <el-button type="success" class="el-icon-lx-top" @click="exportStudent">导出</el-button>
                            </el-button-group>
                            <el-button class="el-icon-lx-add" type="primary" style="float:right;margin-bottom:10px"  @click="toSaveOrUpdate" >新增</el-button>

             </div>

            <!--表格-->
            <el-table class="table-ui" :stripe="true" :data="tableData"  @sort-change="sortChange" >
                    <el-table-column prop="imgUrl" label="头像" width="100">
                        <template slot-scope="scope">
                            <img v-if="scope.row.imgUrl" class="avatar" width="60" height="60" :src="scope.row.imgUrl">
                            <img v-else src="../../../assets/img/avatar.png" width="60" height="60" class="avatar">
                        </template>
                    </el-table-column>
                    <el-table-column prop="workNumber" label="工号" sortable="custom" ></el-table-column>
                    <el-table-column prop="name" label="真实姓名" sortable="custom" ></el-table-column>
                    <el-table-column prop="sex" label="性别" sortable="custom" ></el-table-column>
                    <el-table-column prop="age" label="年龄" sortable="custom" ></el-table-column>
                    <el-table-column prop="email" label="邮箱" sortable="custom" ></el-table-column>
                    <el-table-column prop="tel" label="手机" sortable="custom" ></el-table-column>
                    <el-table-column prop="deptName" label="部门" sortable="custom" ></el-table-column>
                    <el-table-column prop="postName" label="岗位" sortable="custom" ></el-table-column>
                    <el-table-column prop="roleName" label="角色" sortable="custom" ></el-table-column>
                    <el-table-column fixed="right" label="操作" width="240"  >
                    <template slot-scope="scope">
                        <el-button  type="success" round  @click="toSaveOrUpdate($event,scope.row.id)">编辑</el-button>
                        <el-button  type="danger" round  @click="deleteData(scope.row.id)">删除</el-button>
                        <el-button  type="primary" round  @click="resetData(scope.row.id)">重置密码</el-button>
                    </template>
                </el-table-column>
                <div slot="empty"><no-data></no-data></div>
            </el-table>
            <el-pagination
                    style="margin-top: 10px;padding-bottom: 20px;"
                    background
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="searchForm.pager.totalCount"
                    :page-size="searchForm.pager.pageSize"
                    :current-page.sync="searchForm.pager.page"
                    :page-sizes="[10, 20, 30, 40, 50, 100]"
                    @size-change="sizeChange"
                    @current-change="currentChange"
                    @prev-click="currentChange"
                    @next-click="currentChange"
            ></el-pagination>
        </div>
        <save-or-update-worker v-if="saveOrUpdate.visible" v-bind="saveOrUpdate" @closeSaveOrUpdate="closeSaveOrUpdate"></save-or-update-worker>

        <!--导入员工模板-->
        <el-dialog top="15vh" title="批量导入" width="460px" height="250px" :visible.sync="dialogUploadVisible">
            <el-row>
                <el-button type="success" style="height: 50px;text-align: center;width: 100%;border-radius: 5px;"
                           @click="exportTemplate">点击下载模板
                </el-button>
            </el-row>
            <el-row>
                <el-upload class="lead-in-stu"
                           style="height: 50px;border:1px #4dbd73 solid;text-align: center;line-height: 50px;border-radius: 5px;margin-top:30px;color: #4dbd73 ;"
                           :action="uploadURL" :headers="headers" multiple :show-file-list="false"
                           :on-success="handleStudentSuccess" :before-upload="beforeStudentUpload">
                    <div class="">导入员工信息</div>
                </el-upload>
            </el-row>
        </el-dialog>

        <!--导入时的错误信息-->
        <el-dialog title="无法导入" width="500px" :visible.sync="dialogUploadErrorVisible">
            <el-row style="margin-buttom:1rem;">
                请检查以下内容格式是否正确
            </el-row>
            <el-row style="max-height:300px;overflow-y:auto;">
                <p v-for="error in uploadErrors" :key="error" style="padding: 0.5rem;">{{error}}</p>
            </el-row>
        </el-dialog>
    </div>
</template>

<script>
    import axios from 'axios';
    import fileDownload from "js-file-download";
    import saveOrUpdateWorker from './saveOrUpdateWorker';
    import noData from '../../noData/noData';
    export default {
        name: "worker",
        components:{saveOrUpdateWorker,noData},
        data() {
            return {
                searchForm:{
                      name: '',
                      postId: '',
                    pager:{
                        sortField:'',
                        sortOrder:'',
                        page:1,
                        pageSize:10,
                        totalCount:0
                    }
                },
                tableData: [],
                postList:[],
                postForm:{},
                saveOrUpdate:{
                    visible:false,
                    title:'增加',
                    id:''
                },
                look:{
                    visible:false,
                    id:''
                },
                uploadURL: `api/worker/upload/uploadStudent`,
                headers: {
                    token: this.$store.getters.getToken
                }, //导入信息时用到
                dialogUploadVisible: false, //导入信息时用到
                dialogUploadErrorVisible: false, //导入信息时用到
                uploadErrors: [], //导入异常
                rules: {
                          password: [
                                  {  max: 32, message: '长度必须少于32个字符', trigger: 'blur' }
                              ],
                          sex: [
                                  {  max: 32, message: '长度必须少于32个字符', trigger: 'blur' }
                              ],
                          age: [
                                  {  max: 32, message: '长度必须少于32个字符', trigger: 'blur' }
                              ],
                          imgUrl: [
                                  {  max: 32, message: '长度必须少于32个字符', trigger: 'blur' }
                              ],
                          postId: [
                                  {  max: 32, message: '长度必须少于32个字符', trigger: 'blur' }
                              ],
                          email: [
                                  {  max: 32, message: '长度必须少于32个字符', trigger: 'blur' }
                              ],
                          tel: [
                                  {  max: 32, message: '长度必须少于32个字符', trigger: 'blur' }
                              ],
                          roleType: [
                                  {  max: 32, message: '长度必须少于32个字符', trigger: 'blur' }
                              ],
                        roleName: [
                            {  max: 32, message: '长度必须少于32个字符', trigger: 'blur' }
                        ],
                          name: [
                                  {  max: 32, message: '长度必须少于32个字符', trigger: 'blur' }
                              ],
                          departmentId: [
                                  {  max: 32, message: '长度必须少于32个字符', trigger: 'blur' }
                              ],
                          createTime: [
                                  {  max: 32, message: '长度必须少于32个字符', trigger: 'blur' }
                              ],
                          updateTime: [
                                  {  max: 32, message: '长度必须少于32个字符', trigger: 'blur' }
                              ],
                }

            }
        },
        created(){
            this.findPostList();
        },
        mounted(){
            let findBtn=document.querySelector('#findBtn');
            if(findBtn){
                this.searchForm.pager.sortField='id';
                this.searchForm.pager.sortOrder='desc';
                this.submit();
            }
        },
        methods: {
            sortChange({ column, prop, order }){
                this.searchForm.pager.sortField=prop;
                this.searchForm.pager.sortOrder=order?order.replace(/ending$/,''):'';
                this.submit();
            },
            sizeChange(pageSize){
                this.searchForm.pager.pageSize=pageSize;
                this.submit();
            },
            currentChange(page){
                this.searchForm.pager.page=page;
                this.submit();
            },
            toSaveOrUpdate($event,id){
                console.log(id);
                if(id){
                    this.saveOrUpdate.title='修改';
                    this.saveOrUpdate.id=id;
                }else{
                    this.saveOrUpdate.title='增加';
                }
                this.saveOrUpdate.visible=true;
            },
            closeSaveOrUpdate(data){
                this.saveOrUpdate.visible=false;
                data&&this.submit();
            },
            toLook($event,id){
                this.look={
                    visible:true,
                    id:id
                }
            },
            deleteData(id){
                this.$confirm('删除吗?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    axios({
                        url: `api/worker/deleteWorker/${id}`,
                        method: 'GET'
                    }).then(res => {
                        this.$message({
                            type: 'success',
                            message: '删除成功!'
                        });
                        this.submit();
                    }).catch(error => {

                    })

                }).catch(() => {

                });

            },
            resetData(id){
                this.$confirm('确定重置密码吗?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'info'
                }).then(() => {
                    axios({
                        url: `api/worker/resetPwd/${id}`,
                        method: 'GET'
                    }).then(res => {
                        this.$message({
                            type: 'success',
                            message: '重置成功!'
                        });
                        this.submit();
                    }).catch(error => {
                    })

                }).catch(() => {

                });

            },
            submit(page){
                page&&(this.searchForm.pager.page=page);
                this.$refs['searchForm'].validate(valid=>{
                    if(valid){
                        axios({
                            url:`api/worker/findWorkersByCondition2`,
                            method:'POST',
                            data:this.searchForm
                        }).then(res=>{
                            if(res.data.length===0&&this.searchForm.pager.page>1){
                                this.searchForm.pager.page--;
                                this.submit();
                            }else{
                                this.tableData=res.data;
                                this.searchForm.pager.totalCount=res.totalCount;
                            }
                        }).catch(function (error) {
                            console.log(error);
                        });
                    }
                })

            },
            clear(){
                console.log(this.$refs['searchForm'].resetFields())
                this.$refs['searchForm'].resetFields();
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

            /*-------------------------------------批量导入相关方法------------------------------------------------------------*/
            //导出员工模板
            exportTemplate() {
                //导入前
                axios({
                    url: `api/worker/upload/exportTemplate`,
                    method: "GET",
                    responseType: "arraybuffer"
                }).then(res => {
                    fileDownload(res, "员工模板.xls");
                }).catch(error => { });
            },

            beforeStudentUpload(file) {
                this.loading = this.$loading({
                    lock: true,
                    text: "Loading",
                    spinner: "el-icon-loading",
                    background: "rgba(0, 0, 0, 0.7)"
                });
                const extension = file.name.split(".")[1] === "xls";
                const extension2 = file.name.split(".")[1] === "xlsx";
                if (!extension && !extension2) {
                    this.loading.close();
                    this.$message.error("上传模板只能是 xls、xlsx 格式!");
                }
                return extension || extension2;
            },

            handleStudentSuccess(res, file) {
                console.log(res)
                this.loading.close();
                this.dialogUploadVisible = false;
                console.log(res)
                if (res.data.code == 200) {
                    this.$message({
                        message: "员工信息导入成功",
                        type: "success",
                    });
                    this.submit();
                } else if (res.data.code == 201) {
                    this.$message.error(res.data.error);
                } else if (res.data.code == 202) {
                    this.$message.error(res.data.error);
                }
                else if (res.data.code == 222) {
                    this.uploadErrors = res.data.errors;
                    this.dialogUploadErrorVisible = true;
                }
            },

            //导出
            exportStudent() {

                axios({
                    url: `api/worker/download`,
                    method: "POST",
                    data: this.searchForm,
                    responseType: "arraybuffer"
                }).then(res => {
                    fileDownload(res, "员工信息.xls");
                }).catch(error => { });
            },

        }
    }
</script>

<style scoped>
    .avatar {
        width: 78px;
        height: 78px;
        display: block;
        border-radius: 50%;
    }
</style>
