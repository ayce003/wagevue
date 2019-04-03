<template>
    <div class="margin-40-60-0">
        <div v-show="!saveOrUpdate.visible&&!look.visible">
            <!--搜索表单-->
            <div class="search-box">
                <el-form ref="searchForm" size="mini" :rules="rules" :inline="true" :model="searchForm" >
                        <el-form-item label="真实姓名:" prop="name">
                            <el-input v-model="searchForm.name" placeholder="请输入真实姓名"></el-input>
                        </el-form-item>
                         <el-form-item label="岗位:" prop="postId">
                            <el-input v-model="searchForm.postId" placeholder="请输入岗位id"></el-input>
                        </el-form-item>

                    <el-form-item>
                        <el-button  type="primary" id="findBtn" @click="submit(1)">查询</el-button>
                        <el-button  type="warning" plain @click="clear">清空</el-button>
                    </el-form-item>
                    <el-button class="iconfont icon-tianjia" type="danger" size="mini"   @click="toSaveOrUpdate" >新增</el-button>
                </el-form>

             </div>

            <!--表格-->
            <el-table class="table-ui" :stripe="true" :data="tableData"  @sort-change="sortChange" >
                    <el-table-column prop="imgUrl" label="头像" sortable="custom" ></el-table-column>
                    <el-table-column prop="name" label="真实姓名" sortable="custom" ></el-table-column>
                    <el-table-column prop="sex" label="性别" sortable="custom" ></el-table-column>
                    <el-table-column prop="age" label="年龄" sortable="custom" ></el-table-column>
                    <el-table-column prop="email" label="邮箱" sortable="custom" ></el-table-column>
                    <el-table-column prop="tel" label="手机" sortable="custom" ></el-table-column>
                    <el-table-column prop="deptName" label="部门" sortable="custom" ></el-table-column>
                    <el-table-column prop="postName" label="岗位" sortable="custom" ></el-table-column>
                    <el-table-column prop="workNumber" label="工号" sortable="custom" ></el-table-column>
                    <el-table-column fixed="right" label="操作" width="210"  >
                    <template slot-scope="scope">
                        <el-button  type="primary" round  @click="toLook($event,scope.row.id)">查看</el-button>
                        <el-button  type="success" round  @click="toSaveOrUpdate($event,scope.row.id)">编辑</el-button>
                        <el-button  type="danger" round  @click="deleteData(scope.row.id)">删除</el-button>
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
        <look-worker v-if="look.visible" v-bind="look" :visible.sync="look.visible"></look-worker>
    </div>
</template>

<script>
    import axios from 'axios';
    import saveOrUpdateWorker from './saveOrUpdateWorker';
    import lookWorker from './lookWorker';
    import noData from '../../noData/noData';
    export default {
        name: "worker",
        components:{saveOrUpdateWorker,lookWorker,noData},
        data() {
            return {
                searchForm:{
                      username: '',
                      password: '',
                      sex: '',
                      age: '',
                      imgUrl: '',
                      postId: '',
                      email: '',
                      tel: '',
                      role: '',
                      name: '',
                      departmentId: '',
                      createTime: '',
                      updateTime: '',
                      deptName:'',
                      postName:'',
                      workNumber:'',
                    pager:{
                        sortField:'',
                        sortOrder:'',
                        page:1,
                        pageSize:10,
                        totalCount:0
                    }
                },
                tableData: [],
                saveOrUpdate:{
                    visible:false,
                    title:'增加',
                    id:''
                },
                look:{
                    visible:false,
                    id:''
                },
                rules: {
                          username: [
                                  {  max: 32, message: '长度必须少于32个字符', trigger: 'blur' }
                              ],
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
                          role: [
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
                        url: `${home}/worker/deleteWorker/${id}`,
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
            }

        }
    }
</script>
