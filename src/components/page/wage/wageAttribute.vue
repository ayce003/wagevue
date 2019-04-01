<template>
    <div class="margin-40-60-0">
        <div v-show="!saveOrUpdate.visible&&!look.visible">
            <!--搜索表单-->
            <div class="search-box" style="float:right;margin-bottom:20px">
          <!--      <el-form ref="searchForm" size="mini" :inline="true" :model="searchForm" >
                         <el-form-item label="属性名称:" prop="attributeName">
                            <el-input v-model="searchForm.attributeName" placeholder="请输入属性名称"></el-input>
                        </el-form-item>
                         <el-form-item label="更新时间:" prop="updateTime">
                            <el-input v-model="searchForm.updateTime" placeholder="请输入更新时间"></el-input>
                        </el-form-item>
                    <el-form-item>
                        <el-button  type="primary" id="findBtn" v-display:wageAttribute-find @click="submit">查询</el-button>
                        <el-button  type="warning" plain @click="clear">清空</el-button>
                    </el-form-item>
                </el-form>-->
                <el-button class="iconfont icon-tianjia" type="info" size="mini"   @click="toSaveOrUpdate" >新增</el-button>
             </div>

            <!--表格-->
            <el-table class="table-ui" :stripe="true" :data="tableData"  @sort-change="sortChange" >
                    <el-table-column prop="row" label="序号" width="100"></el-table-column>
                    <el-table-column prop="updateTime" label="更新时间" sortable="custom" ></el-table-column>
                    <el-table-column prop="attributeName" label="属性名称" sortable="custom" ></el-table-column>
                <el-table-column fixed="right" label="操作" width="160" :render-header="operHeader" >
                    <template slot-scope="scope">
                        <a  class="table-edit"  @click="toSaveOrUpdate($event,scope.row.id)">编辑</a>
                        <a  class="table-delete"   @click="deleteData(scope.row.id)">删除</a>
                    </template>
                </el-table-column>
           <!--     <div slot="empty"><no-data></no-data></div>-->
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
        <save-or-update-wageAttribute v-if="saveOrUpdate.visible" v-bind="saveOrUpdate" @closeSaveOrUpdate="closeSaveOrUpdate"></save-or-update-wageAttribute>

    </div>
</template>

<script>
    import axios from 'axios';
    import saveOrUpdateWageAttribute from './saveOrUpdateWageAttribute';
    export default {
        name: "wageAttribute",
        components:{saveOrUpdateWageAttribute},
        data() {
            return {
                searchForm:{
                      attributeName: '',
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
                }

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
                        url: `/api/wageAttribute/deleteWageAttribute/${id}`,
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
                    url:`/api/wageAttribute/findWageAttributesByCondition`,
                    method:'POST',
                    data:this.searchForm
                }).then(res=>{
                    console.log(res);
                    if(res.data.data.length===0&&this.searchForm.pager.page>1){
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
            }

        }
    }
</script>

<style scoped lang="scss">

</style>