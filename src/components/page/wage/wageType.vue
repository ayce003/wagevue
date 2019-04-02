<template>
    <div class="margin-40-60-0">
        <div v-show="indexHome">
            <!--搜索表单-->
            <div class="search-box" style="float:right;margin-bottom:20px">
              <!--  <el-form ref="searchForm" size="mini" :inline="true" :model="searchForm" >
                         <el-form-item label="新增时间:" prop="createTime">
                            <el-input v-model="searchForm.createTime" placeholder="请输入新增时间"></el-input>
                        </el-form-item>
                         <el-form-item label="类型名称:" prop="typeName">
                            <el-input v-model="searchForm.typeName" placeholder="请输入类型名称"></el-input>
                        </el-form-item>
                    <el-form-item>
                        <el-button  type="primary" id="findBtn" v-display:wageType-find @click="submit">查询</el-button>
                        <el-button  type="warning" plain @click="clear">清空</el-button>
                    </el-form-item>
                </el-form>-->
                <el-button class="iconfont icon-tianjia" type="danger" size="mini"   @click="toSaveOrUpdate" >新增</el-button>
             </div>

            <!--表格-->
            <el-table class="table-ui" :stripe="true" :data="tableData"  @sort-change="sortChange" >
                    <el-table-column prop="row" label="序号" width="100"></el-table-column>
                    <el-table-column prop="createTime" label="新增时间" sortable="custom" ></el-table-column>
                    <el-table-column prop="typeName" label="工资类型"  ></el-table-column>
                    <el-table-column prop="inclusionproperty" :show-overflow-tooltip="true" label="包含属性" ></el-table-column>
                    <el-table-column prop="state" label="是否启用"  >
                        <template slot-scope="scope">
                            <span v-if="scope.row.state=='1'">启用</span>
                            <span v-if="scope.row.state=='0'">未启用</span>
                        </template>

                    </el-table-column>
                <el-table-column fixed="right" label="操作" width="300" :render-header="operHeader" >
                    <template slot-scope="scope">
                        <el-button type="primary" round v-if="scope.row.state=='0'"  @click="putIntoUse(scope.row.id)">投入使用</el-button>
                        <el-button type="success" round  v-if="scope.row.state=='0'" @click="toSaveOrUpdate(scope.row.id)">编辑</el-button>
                        <el-button type="warning" round v-if="scope.row.state=='1'" @click="lookData(scope.row.id)">查看</el-button>
                        <el-button type="info" round v-if="scope.row.state=='0'" @click="deleteData(scope.row.id)">删除</el-button>
                    <!--    <a v-if="scope.row.state=='0'" class="table-edit"  @click="putIntoUse(scope.row.id)">投入使用</a>
                        <a v-if="scope.row.state=='0'" class="table-edit"   @click="toSaveOrUpdate($event,scope.row.id)">编辑</a>
                        <a v-if="scope.row.state=='1'" class="table-look"   @click="lookData(scope.row.id)">查看</a>
                        <a v-if="scope.row.state=='0'" class="table-delete"   @click="deleteData(scope.row.id)">删除</a>-->
                    </template>
                </el-table-column>
            <!--    <div slot="empty"><no-data></no-data></div>-->
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
    <save-or-update-wageType v-if="saveOrUpdate.visible" v-bind="saveOrUpdate" @closeSaveOrUpdate="closeSaveOrUpdate"></save-or-update-wageType>
    <wage-type-show v-if="lookShow.visible" v-bind="lookShow" @closeSaveOrUpdate="closeSaveOrUpdate"></wage-type-show>
    </div>
</template>

<script>
    import axios from 'axios';
    import saveOrUpdateWageType from './saveOrUpdateWageType';
    import wageTypeShow from './wageTypeShow';
    export default {
        name: "wageType",
        components:{saveOrUpdateWageType,wageTypeShow},
        data() {
            return {
                searchForm:{
                      createTime: '',
                      typeName: '',
                    pager:{
                        sortField:'',
                        sortOrder:'',
                        page:1,
                        pageSize:10,
                        totalCount:0
                    }
                },
                indexHome:true,
                tableData: [],
                saveOrUpdate:{
                    visible:false,
                    title:'增加',
                    id:''
                },
                lookShow:{
                    visible:false,
                    title:'查看',
                    id:''
                },


            }
        },
        created(){
            this.submit();
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
                this.indexHome = false;
                this.lookShow.visible=false;
            },
            closeSaveOrUpdate(data){
                this.saveOrUpdate.visible=false;
                this.indexHome = true;
                this.lookShow.visible=false;
                data&&this.submit();
            },
            lookData(id){
                this.saveOrUpdate.title='查看';
                this.saveOrUpdate.visible=false;
                this.indexHome = false;
                this.lookShow.visible=true;
                this.lookShow.id=id;
            },
            deleteData(id){
                this.$confirm('删除吗?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    axios({
                        url: `/api/wageType/deleteWageType/${id}`,
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
            operHeader(h, { column, $index }){
                return h('span',{
                        // 'class':{
                        //     cell:true
                        // }
                },
                    [
                        h('span',{domProps:{innerHTML:'操作'}})
                    ]
                );
            },
            submit(){
                axios({
                    url:`/api/wageType/findWageTypesByCondition1`,
                    method:'POST',
                    data:this.searchForm
                }).then(res=>{
                    if(res.data.length===0&&this.searchForm.pager.page>1){
                        this.searchForm.pager.page--;
                        this.submit();
                    }else{
                        this.tableData=res.data;
                        for (var i = 0; i < this.tableData.length; i++) {
                            this.tableData[i] = Object.assign(
                                {},
                                this.tableData[i],
                                {
                                    row:
                                        (this.searchForm.pager.page - 1 == 0
                                            ? ""
                                            : this.searchForm.pager.page - 1) *
                                        this.searchForm.pager.pageSize +
                                        (i + 1)
                                }
                            );
                        }
                        this.searchForm.pager.totalCount=res.totalCount;
                    }
                }).catch(function (error) {
                    console.log(error);
                });
            },
            clear(){
                this.$refs['searchForm'].resetFields();
            },
            putIntoUse(id){
                this.$confirm('投入使用后，不可支持编辑，删除，是否确认投入使用?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    axios({
                        url: `/api/wageType/update/updateWageTypeState/${id}`,
                        method: 'GET'
                    }).then(res => {
                        this.$message({
                            type: 'success',
                            message: '使用成功!'
                        });
                        this.submit();
                    }).catch(error => {

                    })

                }).catch(() => {

                });
            }

        }
    }
</script>

