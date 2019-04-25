<template>
    <div class="margin-40-60-0">
        <div>
            <!--搜索表单-->
            <div class="search-box">
                <el-form ref="searchForm" size="mini" :inline="true" :model="searchForm" >
                    <el-form-item label="工资月份:" prop="salaryTime">
                        <el-date-picker value-format='yyyy-MM' v-model="searchForm.salaryTime" type="month" placeholder="请选择日期"></el-date-picker>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" id="findBtn"  @click="submit">查询</el-button>
                        <el-button type="warning" plain @click="clear">清空</el-button>
                    </el-form-item>
                </el-form>
            </div>

            <!--表格-->
            <el-table v-if="salaryAttribute.length>0" class="table-ui" :stripe="true" :data="tableData">
                <el-table-column v-for="item in salaryAttribute" :prop="item.wageAttributeId" :label="item.attributeName" :key="item.wageAttributeId"></el-table-column>
                <el-table-column prop="salary_time" label="工资月份" width="160"></el-table-column>
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
    </div>
</template>

<script>
    import axios from 'axios';
    export default {
        name: "myPayslip",
        components:{},
        data() {
            return {
                searchForm:{
                    salaryTime: '',
                    pager:{
                        sortField:'salaryTime',
                        sortOrder:'desc',
                        page:1,
                        pageSize:10,
                        totalCount:0
                    }
                },
                tableData: [],
                salaryAttribute:[], //表头属性
            }
        },
        created(){
            this.submit();
        },
        mounted(){
        },
        methods: {
            sizeChange(pageSize){
                this.searchForm.pager.pageSize=pageSize;
                this.getTableData();
            },
            currentChange(page){
                this.searchForm.pager.page=page;
                this.getTableData();
            },
            // 获取表格数据
            submit() {
                axios({
                    url:`/api/wageTypeWorker/findWageAttributeNameByWorkerId`,
                    method:'POST',
                    data: {salaryTime:this.searchForm.salaryTime}
                }).then(res=>{
                    if(res.result.success){
                        this.salaryAttribute=res.data; //表头数据
                    }
                }).then(res=>{
                    this.getTableData();
                }).catch(function (error) {
                    console.log(error);
                });
            },
            //获取表内容
            getTableData(){
                axios({
                    url:`/api/wageTypeWorker/FindMyPayslipByWorkerId`,
                    method:'POST',
                    data:this.searchForm
                }).then(res=>{
                    if(res.result.success){
                        if(res.data.length===0&&this.searchForm.pager.page>1){
                            this.searchForm.pager.page--;
                            this.getTableData();
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