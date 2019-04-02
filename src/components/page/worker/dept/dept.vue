<template>
    <div class="margin-40-60-0">
        <div v-show="!saveOrUpdate.visible&&!look.visible">
            <!--搜索表单-->
            <div class="search-box">
                <el-form ref="searchForm" size="mini" :rules="rules" :inline="true" :model="searchForm" >
                         <el-form-item label="部门名称:" prop="deptName">
                            <el-input v-model="searchForm.deptName" placeholder="请输入部门名称"></el-input>
                        </el-form-item>
                         <el-form-item label="部门id:" prop="deptId">
                            <el-input v-model="searchForm.deptId" placeholder="请输入部门id"></el-input>
                        </el-form-item>
                         <el-form-item label="创建时间:" prop="createTime">
                            <el-input v-model="searchForm.createTime" placeholder="请输入创建时间"></el-input>
                        </el-form-item>
                         <el-form-item label="更新时间:" prop="updateTime">
                            <el-input v-model="searchForm.updateTime" placeholder="请输入更新时间"></el-input>
                        </el-form-item>
                    <el-form-item>
                        <el-button  type="primary" id="findBtn" v-display:dept-find[click] @click="submit(1)">查询</el-button>
                        <el-button  type="warning" plain @click="clear">清空</el-button>
                    </el-form-item>
                </el-form>
                <div>
                   <el-button class="iconfont icon-tianjia" type="info" size="mini" v-display:dept-save  @click="toSaveOrUpdate" >新增</el-button>
                </div>
             </div>

            <!--表格-->
            <el-table class="table-ui" :stripe="true" :data="tableData"  @sort-change="sortChange" >
                    <el-table-column prop="deptName" label="部门名称" sortable="custom" ></el-table-column>
                    <el-table-column prop="deptId" label="部门id" sortable="custom" ></el-table-column>
                    <el-table-column prop="createTime" label="创建时间" sortable="custom" ></el-table-column>
                    <el-table-column prop="updateTime" label="更新时间" sortable="custom" ></el-table-column>
                <el-table-column fixed="right" label="操作" width="160"  >
                    <template slot-scope="scope">
                        <a  class="table-edit" v-display:dept-update @click="toSaveOrUpdate($event,scope.row.id)">修改</a>
                        <a  class="table-look" v-display:dept-look @click="toLook($event,scope.row.id)">查看</a>
                        <a  class="table-delete" v-display:dept-delete  @click="deleteData(scope.row.id)">删除</a>
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
        <save-or-update-dept v-if="saveOrUpdate.visible" v-bind="saveOrUpdate" @closeSaveOrUpdate="closeSaveOrUpdate"></save-or-update-dept>
        <look-dept v-if="look.visible" v-bind="look" :visible.sync="look.visible"></look-dept>
    </div>
</template>

<script>
    import axios from 'axios';
    import saveOrUpdateDept from './saveOrUpdateDept';
    import lookDept from './lookDept';
    export default {
        name: "dept",
        components:{saveOrUpdateDept,lookDept,noData},
        data() {
            return {
                searchForm:{
                      deptName: '',
                      deptId: '',
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
                          deptName: [
                                  {  max: 32, message: '长度必须少于32个字符', trigger: 'blur' }
                              ],
                          deptId: [
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
                        url: `${home}/dept/deleteDept/${id}`,
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
                            url:`${home}/dept/findDeptsByCondition`,
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
