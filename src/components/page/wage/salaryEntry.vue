<template>
    <div class="salary-wrap" :class="{active:isActive}">
        <div v-show="salaryInfoVisible" style="height:100%;background: rgb(242, 242, 242);">
            <div style="height:100%;">
                <div class="salary-left">
                    <!-- 工资类型 -->
                    <div class="left">
                        <div class="left-type" style="font-size:20px;color:#4DBD73;">工资类型</div>
                        <div class="left-y">
                            <div class="left-type" :class="activeIndex===index?'active':''" v-for="(item,index) in salaryType" :key="item.id" @click="selectSalaryTyp(item.id,index)">{{item.typeName}}</div>
                            <div v-if="salaryType.length==0" style="font-size:16px;margin-top:30px;padding-left:10px;">暂无数据 ~ </div>
                        </div>
                    </div>
                </div>
                <div class="salary-right">
                    <!--搜索表单-->
                    <div class="salary-box">
                        <el-form ref="searchForm" :inline="true" :model="searchForm" size="mini">
                            <div>
                                <el-form-item label="发放时间:">
                                    <el-date-picker style="width:250px;" v-model="searchForm.rangeTime" type="daterange" format="yyyy-MM-dd" value-format="yyyy-MM-dd" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
                                </el-form-item>
                                <el-form-item label="职工名称:" prop="name">
                                    <el-input v-model="searchForm.name" placeholder="请输入职工名称"></el-input>
                                </el-form-item>
                                <el-form-item label="发放状态:" prop="releaseState">
                                    <el-select class="stu-status" v-model="salaryGrantSaveStatus" placeholder="请选择发放状态" @change="statusChange">
                                        <el-option v-for="(item,index) in statusList" :key="index" :label="item" :value="index"></el-option>
                                    </el-select>
                                </el-form-item>
                                <el-form-item>
                                    <el-button type="primary" id="findBtn" @click="submit()">查询</el-button>
                                    <el-button  type="warning" plain @click="clear">清空</el-button>
                                </el-form-item>
                            </div>
                            <div v-if="salaryType.length>0">
                                <el-form-item>
                                    <el-button style="margin-right: 20px;vertical-align: bottom;" type="info" class="iconfont icon-tianjia" @click="showAddDialog('')">手动录入</el-button>
                                    <el-button-group style="vertical-align: bottom;">
                                        <el-button type="clear" class="iconfont icon-daoru" @click="dialogUploadVisible=true">导入</el-button>
                                        <el-button type="common" class="iconfont icon-daochu" @click="exportSalary()">导出</el-button>
                                    </el-button-group>
                                    <el-button type="primary" id="grantBtn" @click="grantSalary()" style="margin-left:20px;">发放工资</el-button>
                                    <el-button type="primary"  @click="sendAllEmail(salaryTypeId)" style="margin-left:20px;">一键发送邮箱</el-button>
                                    <el-button type="primary"  @click="sendAllTel(salaryTypeId)" style="margin-left:20px;">一键发送短信</el-button>
                                </el-form-item>
                            </div>
                        </el-form>
                        <!--表格-->
                        <el-table style="width:100%" :data="tableData" class="table-ui" :stripe="true" @selection-change="selAllSalaryId">
                            <el-table-column type="selection" width="55" :selectable='isCheckbox' disabled='true'></el-table-column>
                           <!-- <el-table-column prop="row" label="序号" width="80"></el-table-column>-->
                            <el-table-column prop="work_number" label="工号"></el-table-column>
                            <el-table-column prop="name" label="职工名称" ></el-table-column>
                            <el-table-column prop="salary_time" label="工资月份" ></el-table-column>
                            <el-table-column v-for="item in salaryAttribute" :prop="item.wageAttributeId" :label="item.attributeName" :key="item.wageAttributeId"></el-table-column>
                            <el-table-column label="发放状态">
                                <template slot-scope="scope">
                                    <span v-if="scope.row.release_state==0">未发放</span>
                                    <span v-else>已发放</span>
                                </template>
                            </el-table-column>
                            <el-table-column prop="release_time" label="发放时间">
                                <template slot-scope="scope">
                                    <span v-if="scope.row.release_time">{{scope.row.release_time}}</span>
                                    <span v-else>--</span>
                                </template>
                            </el-table-column>
                            <el-table-column  label="操作" width="110">
                                <template slot-scope="scope">
                                    <el-dropdown>
                                        <el-button type="primary">
                                         更多操作<i class="el-icon-arrow-down el-icon--right"></i>
                                        </el-button>
                                        <el-dropdown-menu slot="dropdown">
                                            <span  @click="showAddDialog(scope.row.id, scope.row.release_state)" v-if="scope.row.release_state==1">
                          <el-dropdown-item>查看</el-dropdown-item>
                                            </span>
                                            <span   @click="showAddDialog(scope.row.id, scope.row.release_state)" v-else>
                          <el-dropdown-item>编辑</el-dropdown-item>
                                            </span>
                                            <span  @click="deleteData(scope.row.id)" v-if="scope.row.release_state==0">
                          <el-dropdown-item>删除</el-dropdown-item>
                                            </span>
                                            <span  @click="sendDate(scope.row.id,salaryTypeId)" >
                          <el-dropdown-item>发送邮箱</el-dropdown-item>
                                            </span>
                                        </el-dropdown-menu>
                                    </el-dropdown>

                                    <!--<el-button type="warning" round @click="showAddDialog(scope.row.id, scope.row.release_state)" v-if="scope.row.release_state==1">查看</el-button>
                                    <el-button type="success" round  @click="showAddDialog(scope.row.id, scope.row.release_state)" v-else>编辑</el-button>
                                    <el-button type="info" round @click="deleteData(scope.row.id)" v-if="scope.row.release_state==0"> 删除</el-button>
                                    <el-button type="danger" round @click="sendDate(scope.row.id,salaryTypeId)" v-if="scope.row.release_state==0"> 发送邮箱</el-button>-->

                                </template>
                            </el-table-column>
                        </el-table>
                        <el-pagination 
                            style="margin-top: 10px;padding-bottom: 20px; text-align: center;" 
                            background 
                            layout="total, sizes, prev, pager, next, jumper" 
                            :total="searchForm.pager.totalCount" 
                            :page-size="searchForm.pager.pageSize" 
                            :current-page.sync="searchForm.pager.page" 
                            :page-sizes="[10, 20, 30, 40, 50, 100]" 
                            @size-change="sizeChange" 
                            @current-change="currentChange" 
                            @prev-click="currentChange" 
                            @next-click="currentChange">
                        </el-pagination>
                    </div>
                </div>
            </div>
            <el-dialog top="15vh" title="批量导入" width="460px" height="250px" :visible.sync="dialogUploadVisible">
                <el-row>
                    <el-button type="common" style="height: 50px;text-align: center;width: 100%;border-radius: 5px;" @click="exportTemplate">点击下载模板
                    </el-button>
                </el-row>
                <el-row>
                    <el-upload class="lead-in-stu" style="height: 50px;border:1px #4dbd73 solid;text-align: center;line-height: 50px;border-radius: 5px;margin-top:30px;color: #4dbd73 ;" :action="uploadURL" :data="importXls" :headers="headers" multiple :show-file-list="false" :on-success="handleSalarySuccess" :before-upload="beforeSalaryUpload">
                        <div class="">导入教师工资信息</div>
                    </el-upload>
                </el-row>
            </el-dialog>
            <el-dialog title="无法导入" width="500px" :visible.sync="dialogUploadErrorVisible">
                <el-row style="margin-buttom:1rem;">
                    请检查一下内容格式是否正确
                </el-row>
                <el-row style="max-height:300px;overflow-y:auto;">
                    <p v-for="error in uploadErrors" :key="error" style="padding: 0.5rem;">{{error}}</p>
                </el-row>
            </el-dialog>
        </div>
        <save-or-update-salary v-if="salaryAddVisible" :id="salaryTypeId" :listId="listId" :releaseState="releaseState" @showBack="showBack"></save-or-update-salary>
    </div>
</template>

<script>
    import axios from 'axios'
    import saveOrUpdateSalary from './saveOrUpdateSalary.vue'
    import fileDownload from "js-file-download";
    export default {
        name: "salaryEntry",
        components:{
            saveOrUpdateSalary
        },
        data(){
            return{
                isActive:true,
                loading:{},
                tabPosition:'left',
                salaryInfoVisible: true,
                salaryAddVisible: false,
                searchForm:{
                    rangeTime:null,
                    name:'',
                    releaseState:'',
                    wageTypeId:'',
                    pager:{
                        sortField:'createTime',
                        sortOrder:'desc',
                        page:1,
                        pageSize:10,
                        totalCount:0
                    }
                },
               headers: {
                    token: this.$store.getters.getToken
                }, //导入信息时用到
                dialogUploadVisible: false, //导入信息时用到
                dialogUploadErrorVisible: false, //导入信息时用到
                uploadErrors: [], //导入异常
                uploadURL: `/api/wageTypeWorker/update/uploadWage`,
                loading: {},
                importXls:{
                    wageTypeId:''
                },

                salaryGrantSaveStatus:'', //发放状态
                statusList:['全部','已发放','未发放'],
                salaryAttribute:[], //表头工资属性
                tableData:[], //表格数据
                salaryType:[], //左边工资类型id
                listId: '', //表格每行id
                salaryTypeId:'', //工资类型id
                activeIndex: 0, //默认显示第一个工资类型
                selAllWorkId:[], //选中的要发放工资的职工
                selAllEmail:[],//选中的邮箱
                selAllTel:[],//选中的手机号
                releaseState:'', //发放工资后的状态
            }
        },
        created(){
            this.getSalaryType();
        },
        methods:{
            //导入
            exportTemplate() {
                const downs={};
                downs.wageTypeId=this.salaryTypeId;
                axios({
                    url: `/api/wageTypeWorker/update/exportWageTemplate`,
                    method: "POST",
                    responseType: "arraybuffer",
                    data:downs
                }).then(res => {
                    fileDownload(res, "工资模板.xls");
                });
            },
            beforeSalaryUpload(file) {
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
            handleSalarySuccess(res, file){
                this.loading.close();
                console.log(res);
                if (res.data.code == 200) {
                    this.dialogUploadVisible = false;
                    this.$message({
                        message: "职工工资导入成功",
                        type: "success"
                    });
                    this.submit();
                } else if(res.data.code == 201){
                    this.$message.error(res.data.error);
                } else if(res.data.code == 202){
                    this.$message.error(res.data.error);
                } else {
                    this.dialogUploadVisible = false;
                    this.uploadErrors = res.data.errors;
                    this.dialogUploadErrorVisible = true;
                }
            },
            // 导出
            exportSalary(){
                const down={};
                down.wageTypeId=this.salaryTypeId;
                down.pager={};
                axios({
                    url: `/api/wageTypeWorker/update/exportWage`,
                    method: "POST",
                    data: down,
                    responseType: "arraybuffer"
                }).then(res => {
                    fileDownload(res, "工资.xls");
                });
            },
            // 是否禁用表格的复选框(状态为已发放禁用，未发放可勾选)
            isCheckbox(row,index){
                if(row.release_state==0){
                    return 1;
                }else{
                    return 0;
                }
            },
            //选择发放状态
            statusChange() {
                // this.searchForm.releaseState = this.salaryGrantSaveStatus;
                if(this.salaryGrantSaveStatus==0){
                    this.searchForm.releaseState='0,1';
                }else if(this.salaryGrantSaveStatus==1){
                    this.searchForm.releaseState=this.salaryGrantSaveStatus;
                }else{
                    this.searchForm.releaseState=0;
                }
            },
            //新增or编辑
            showAddDialog(listId,releaseState) {
                //手动录入职工工资
                this.listId = listId;
                this.releaseState=releaseState;
                this.salaryAddVisible = true;
                this.salaryInfoVisible = false;
                this.isActive=false;
            },
            showBack(msg) {
                this.salaryInfoVisible = true;
                this.salaryAddVisible = false;
                this.isActive = true;
                this.getTableData();
            },
            // 获取选中
            selAllSalaryId(val){
                this.selAllWorkId = val.map(obj =>obj.id);
                this.selAllEmail = val.map(obj =>obj.email);
                this.selAllTel = val.map(obj =>obj.tel);
            },

            // 获取左侧工资类型
            getSalaryType(){
                axios({
                    url:`/api/wageType/update/findWageTypeListByState`,
                    method:'POST',
                    data:{}
                }).then(res=>{
                    if(res.result.success){
                        this.salaryType=res.data;
                        this.salaryTypeId = this.salaryType[0].id;
                        this.searchForm.wageTypeId=this.salaryTypeId;
                        this.importXls.wageTypeId=this.salaryTypeId;
                    }
                }).then(() => {
                    this.getTableData();
                }).catch(function (error) {
                    console.log(error);
                });
            },
            //选择工资类型
            selectSalaryTyp(id,index){
                this.activeIndex = index;
                this.salaryTypeId = id;
                this.searchForm.wageTypeId=this.salaryTypeId;
                this.importXls.wageTypeId=this.salaryTypeId;

                this.getTableData();
            },
            //发送邮箱
            sendDate(id,typeid){
                axios({
                    url:`/api/wageTypeWorker/sendEmailToWorker`,
                    method:'POST',
                    data: {id:id,wageTypeId:typeid}
                }).then(res=>{
                    this.$message({
                        type: 'success',
                        message: '邮件已发送，请稍后查看'
                    });
                })
            },
            // 获取表格数据
            getTableData() {
                this.salaryAttribute=[];
                axios({
                    url:`/api/wageType/update/findWageAttributeListByTypeId`,
                    method:'POST',
                    data: {id:this.salaryTypeId}
                }).then(res=>{
                    if(res.result.success){
                        this.salaryAttribute=res.data; //表头数据
                    }
                }).then(() => {
                    this.submit(); //表格数据
                }).catch(function (error) {
                    console.log(error);
                });
            },
            // 查询
            submit(){
                axios({
                    url:`/api/wageTypeWorker/update/findWageValueByTypeId`,
                    method:'POST',
                    data:this.searchForm
                }).then(res=>{
                    if(res.result.success){
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
                    }
                }).catch(function (error) {
                    console.log(error);
                });
            },
            // 清空
            clear(){
                this.$refs['searchForm'].resetFields();
                this.salaryGrantSaveStatus='';
                this.searchForm.rangeTime=null;
            },
            //发放工资条
            grantSalary(){
                if(this.selAllWorkId.length>0){
                    this.$confirm('确定下发这些工资条么?', '温馨提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        axios({
                            url: `/api/wageTypeWorker/update/updateWageTypeWorkerReleaseState`,
                            method: 'POST',
                            data:{selAllWorkId:this.selAllWorkId}
                        }).then(res => {
                            if(res.data=='success'){
                                this.$message({
                                    type: 'success',
                                    message: res.data2
                                });
                                this.getTableData();
                            }
                        }).catch(error => {
                            console.log(error);
                        })
                    }).catch(() => {
                        this.$message({
                            type: 'info',
                            message: '已取消发放'
                        });          
                    });
                }else{
                    this.$message({
                        type: 'warning',
                        message: '请选择工资条!'
                    });
                }
            },
            sendAllEmail(typeid){
               /* if(this.selAllEmail.length>0){*/
                 /*   this.$confirm('确定发送工资条给以下职工么?', '温馨提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {*/
                        axios({
                            url: `/api/wageTypeWorker/sendAllEmailToWorker`,
                            method: 'POST',
                            data:{wageTypeId:typeid}
                        }).then(res => {
                                this.$message({
                                    type: 'success',
                                    message: "邮件发送成功"
                                });
                                this.getTableData();
                        }).catch(error => {
                            console.log(error);
                        })
                   /* }).catch(() => {
                        this.$message({
                            type: 'info',
                            message: '已取消发送'
                        });
                    });*/
            /*    }else{
                    this.$message({
                        type: 'warning',
                        message: '请选择职工!'
                    });
                }*/
            },
            sendAllTel(typeid){
                /*if(this.selAllTel.length>0){
                    this.$confirm('确定发送工资条给以下职工么?', '温馨提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {*/
                        axios({
                            url: `/api/wageTypeWorker/sendSalaryToAllTel`,
                            method: 'POST',
                            data:{wageTypeId:typeid}
                        }).then(res => {
                            this.$message({
                                type: 'success',
                                message: "短信发送成功"
                            });
                            this.getTableData();
                        }).catch(error => {
                            console.log(error);
                        })
                   /* }).catch(() => {
                        this.$message({
                            type: 'info',
                            message: '已取消发送'
                        });
                    });
                }else{
                    this.$message({
                        type: 'warning',
                        message: '请选择职工!'
                    });
                }*/
            },

            //删除工资条
            deleteData(id){
                this.$confirm('确定删除吗?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    axios({
                        url: `/api/wageTypeWorker/update/deleteWageValueByRecordId/${id}`,
                        method: 'GET'
                    }).then(res => {
                        this.$message({
                            type: 'success',
                            message: '删除成功!'
                        });
                        this.getTableData();
                    }).catch(error => {
                        console.log(error);
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });          
                });
            },
            
            sizeChange(pageSize){
                this.searchForm.pager.pageSize=pageSize;
                this.submit();
            },
            currentChange(page){
                this.searchForm.pager.page=page;
                this.submit();
            },
        }
    }
</script>

<style lang="scss" scoped>
    .salary-wrap{
        min-height:calc(100% - 60px);
        &.active{
            background: rgb(242, 242, 242);
        }
        .salary-left{
            width: 200px;
            float: left;
            background: #fff;
            .left{
                .left-type{
                    height: 40px;
                    line-height: 40px;
                    padding: 0 10px;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                    cursor: pointer;
                    &.active{
                        background: #f0faf4;
                    }
                }
                .left-y{
                    max-height: 690px;
                    overflow-y: auto;
                }
            }
        }
        .salary-right{
            margin-left: 205px;
            background: #fff;
            padding: 20px;
        }
    }
</style>
<style scoped>
    .salary-box >>> .el-table tr th:first-child .cell {
        padding-left: 30px;
    }
</style>
