<template>
    <div class="margin-40-60-0">
        <!--搜索表单-->
        <div class="search-box">
                <el-form ref="searchForm" size="mini" :rules="searchRules" :inline="true" :model="searchForm" >
                        <el-form-item label="岗位名称:" prop="postName">
                            <el-input v-model="searchForm.postName" placeholder="请输入岗位名称"></el-input>
                        </el-form-item>
                        <el-form-item>
                            <el-button  type="primary" id="findBtn"  @click="submit(1)">查询</el-button>
                            <el-button  type="warning" plain @click="clear">清空</el-button>
                        </el-form-item>
                        <el-button type="primary" size="mini"  style="float:right;" @click="showAddDialog">新增岗位</el-button>

                </el-form>
         </div>
        <!--表格-->
        <el-table class="table-ui" :stripe="true"  :data="tableData"  @sort-change="sortChange" >
                <el-table-column type="index" width="100" label="序号" ></el-table-column>
                <el-table-column prop="postName" label="岗位名称" sortable="custom" ></el-table-column>
            <el-table-column fixed="right" label="操作" width="160"  >
                <template slot-scope="scope">
                    <el-button    type="success" round  @click="showUpdateDialog(scope.row.id)">编辑</el-button>
                    <el-button    type="danger" round @click="deleteData(scope.row.id)">删除</el-button>
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
        <!--添加或者修改表单-->
        <el-dialog  :title="dialog.title"   width="650px" :visible.sync="dialog.dialogFormVisible">
            <el-form class="upsertForm" size="mini" :model="upsertForm" :rules="rules" ref="upsertForm" label-width="80px" >
                <input type="hidden" :value="upsertForm.id">
                          <el-form-item label="岗位名称" prop="postName">
                             <el-input  v-model="upsertForm.postName" auto-complete="off"></el-input>
                         </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button class="large" size="mini" @click="dialog.dialogFormVisible = false">取 消</el-button>
                <el-button class="large" size="mini" type="primary" v-if="dialog.title=='增加'"  @click="saveOrUpdate('upsertForm')">确 定</el-button>
                <el-button class="large" size="mini" type="primary" v-else  @click="saveOrUpdate('upsertForm')">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import axios from 'axios';
    import noData from '../../../noData/noData';
    export default {
        name: "post",
        components:{noData},
        data() {
            return {
                searchForm:{
                      postName: '',
                      postId: '',
                      createTime: '',
                      updateTime: '',
                    pager:{
                        sortField:'',
                        sortOrder:'',
                        page:1,
                        pageSize:10,
                        totalCount:0
                    }
                },
                tableData: [],
                upsertForm:{
                        id:'',
                        postName:'',
                        postId:'',
                        createTime:'',
                        updateTime:''
                },
                searchRules: {
                          postName: [
                                  {  max: 32, message: '长度必须少于32个字符', trigger: 'blur' }
                              ],
                          postId: [
                                  {  max: 32, message: '长度必须少于32个字符', trigger: 'blur' }
                              ],
                          createTime: [
                                  {  max: 32, message: '长度必须少于32个字符', trigger: 'blur' }
                              ],
                          updateTime: [
                                  {  max: 32, message: '长度必须少于32个字符', trigger: 'blur' }
                              ],
                },
                rules: {
                          postName: [
                                  { required: true, message: '请输入岗位名称', trigger: 'blur',transform:val=>val.trim() },
                                  {  max: 32, message: '长度必须少于32个字符', trigger: 'blur' }
                              ],
                          postId: [
                                  { required: true, message: '请输入岗位id', trigger: 'blur',transform:val=>val.trim() },
                                  {  max: 32, message: '长度必须少于32个字符', trigger: 'blur' }
                              ],
                          createTime: [
                                  { required: true, message: '请输入创建时间', trigger: 'blur',transform:val=>val.trim() },
                                  {  max: 32, message: '长度必须少于32个字符', trigger: 'blur' }
                              ],
                          updateTime: [
                                  { required: true, message: '请输入更新时间', trigger: 'blur',transform:val=>val.trim() },
                                  {  max: 32, message: '长度必须少于32个字符', trigger: 'blur' }
                              ],
                },
                dialog:{
                    dialogFormVisible:false,
                    title:'增加'
                },

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
            showAddDialog(){
                this.dialog.dialogFormVisible=true;
                this.dialog.title='增加';
                this.$nextTick(()=>{
                    this.$refs.upsertForm.resetFields();
                });
            },
            showUpdateDialog(id){
                axios({
                    url:`api/post/update/findPostById/${id}`,
                    method:'GET'
                }).then(res=>{
                    Object.assign(this.upsertForm,res.data);
                    this.dialog.dialogFormVisible=true;
                    this.dialog.title = '修改';
                    this.$nextTick(()=>{
                        this.$refs.upsertForm.clearValidate();
                    });
                }).catch(error=>{

                })

            },
            saveOrUpdate(formName){
                this.$refs[formName].validate(valid=>{
                    if(valid){

                        axios({
                            url:`api/post/findPostListByCondition`,
                            method:'POST',
                            data:{
                                postName:this.upsertForm.postName
                            }
                        }).then(res=>{
                            let num =res.totalCount;
                            if(num>0){
                                this.$message.error('该岗位已存在');
                            } else {
                                axios({
                                    url:`api/post/${this.dialog.title==='增加'?'savePost':'update/updatePost'}`,
                                    method:'POST',
                                    data:this.upsertForm
                                }).then(res=>{
                                    this.$message({
                                        message: this.dialog.title+'成功',
                                        type: 'success'
                                    });
                                    this.$refs.upsertForm.resetFields();//清空校验
                                    this.searchForm.pager.page=1;
                                    this.dialog.dialogFormVisible = false;
                                    this.submit();
                                })
                            }
                        }).catch(function (error) {
                            console.log(error);
                        });

                    }
                })





            },
            deleteData(id){
                this.$confirm('删除吗?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    axios({
                        url: `api/post/deletePost/${id}`,
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
                            url:`api/post/findPostsByCondition`,
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
                this.$refs['searchForm'].resetFields();
            }

        }
    }
</script>
