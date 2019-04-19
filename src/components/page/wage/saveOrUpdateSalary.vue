<template>
    <div style="width:780px;">
        <el-form :model="upsertForm" ref="upsertForm" label-width="120px" size="mini">
            <el-form-item label="工号:" prop="workCode" :rules="{ required: releaseState==1?false:true, message: '请输入工号'}">
                <span v-if="releaseState==1">{{upsertForm.workCode}}</span>
                <el-input v-else placeholder="请输入工号" v-model="upsertForm.workCode" auto-complete="off" maxlength="50"></el-input>
            </el-form-item>
            <el-form-item label="职工名称:" prop="workName" :rules="{ required: releaseState==1?false:true, message: '请输入职工名称'}">
                <span v-if="releaseState==1">{{upsertForm.workName}}</span>
                <el-input v-else placeholder="请输入职工名称" v-model="upsertForm.workName" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="工资月份:" prop="salaryTime" :rules="{ required: releaseState==1?false:true, message: '请选择日期'}">
                <span v-if="releaseState==1">{{upsertForm.salaryTime}}</span>
                <el-date-picker v-else value-format='yyyy-MM' v-model="upsertForm.salaryTime" type="month" placeholder="请选择日期"></el-date-picker>
            </el-form-item>
            <el-form-item 
                v-for="(item,index) in upsertForm.dataModel"
                :label="item.attributeName+':'"
                :key="index"
                :prop="'dataModel.' + index + '.value'"
                :rules="[{required: releaseState==1?false:true, message: `请输入${item.attributeName}`},{validator:checkNumber, trigger: 'blur'}]">
                <span v-if="releaseState==1">{{item.value}} (元)</span>
                <template v-else>
                    <el-input :placeholder="'请输入'+item.attributeName" v-model="item.value" auto-complete="off" maxlength="6"></el-input>&nbsp;&nbsp;&nbsp;&nbsp;元
                </template>
            </el-form-item>
            <el-form-item  class="center-button" v-if="releaseState==1">
                <el-button class="large" type="common" size="small"  @click="back()">返回</el-button>
            </el-form-item>
            <el-form-item  class="center-button" v-else>
                <el-button type="cancel" class="large" @click="back" size="small">取消</el-button>
                <el-button class="large" type="common" size="small"  @click="saveOrUpdate('upsertForm')">确认</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
import axios from 'axios'
export default {
    name:'saveOrUpdateSalary',
    props: ['id','listId','releaseState'],
    data(){
        return{
            upsertForm:{
                workCode: '',
                workName: '',
                salaryTime: '',
                dataModel:[]
            },
            inputData:[], //动态表单数据
            dyna:{}, //提交表单时用
        }
    },
    created(){
        this.getInputList();
    },
    methods:{
        // 验证数字
        checkNumber:(rule, value, callback) => {
            if (!isNaN(value)==0) {
                callback(new Error('请输入数字值'));
            } else {
                if(value<0){
                    callback(new Error('金额不能小于0'));
                } else if(!/^\d+\.?\d{0,2}$/.test(value)){
                    callback(new Error('小数点后不能超过2位'));
                } else {
                    callback();
                }
                // /^\d+$/
            }
        },
        //取消
        back() {
            this.$emit("showBack", 200);
        },
        // 获取表单列表
        getInputList(listId){
            if(this.listId == '') {
                //新增工资
                axios({
                    url:`/api/wageType/update/findWageAttributeListByTypeId`,
                    method:'POST',
                    data:{id:this.id}
                }).then(res=>{
                    if(res.result.success){
                        this.inputData = res.data
                        this.inputData.forEach(item => {
                            this.upsertForm.dataModel.push({id: item.wageAttributeId, value: '',attributeName:item.attributeName})
                        })
                    }
                }).catch(function(err){
                    console.log(err);
                })
            } else {
                //编辑工资
                axios({
                    url:`/api/wageType/update/findWageAttributeListByTypeId`,
                    method:'POST',
                    data:{id:this.id}
                }).then(res=>{
                    if(res.result.success){
                        this.inputData = res.data;
                        this.inputData.forEach(item => {
                            this.upsertForm.dataModel.push({id: item.wageAttributeId, value: '',attributeName:item.attributeName})
                        })
                    }
                }).then(() => {
                    axios({
                        url:`/api/wageTypeWorker/update/findWageValueByRecordId/${this.listId}`,
                        method:'POST',
                        data:{id:this.listId}
                    }).then(res=>{
                        if(res.result.success){
                            this.upsertForm.workCode = res.data[0].work_number;
                            this.upsertForm.workName = res.data[0].name;
                            this.upsertForm.salaryTime = res.data[0].salary_time;
                            this.upsertForm.dataModel.forEach(item => {
                                item.value=res.data[0][item.id];
                            })
                        }
                    })
                }).catch(function(err){
                    console.log(err);
                })
            }
            
        },
        // 确认提交表单
        saveOrUpdate(formName){
            this.dyna = {};
            this.upsertForm.dataModel.forEach(item => {
                this.dyna[item.id] = item.value;
            })
            this.$refs[formName].validate(valid => {
                if (valid) {
                    if(!this.listId){
                        axios({
                            url: `/api/wageTypeWorker/saveWageTypeValue`,
                            method: "POST",
                            data: {'propmap':this.dyna,'name': this.upsertForm.workName,'workNumber':this.upsertForm.workCode,'salaryTime':this.upsertForm.salaryTime,'wageTypeId': this.id}
                        }).then(res => {
                            if(res.data=='false'){
                                this.$message({
                                    message: res.data2,
                                    type: "warning"
                                });
                            }else{
                                this.$message({
                                    message: res.data2,
                                    type: "success"
                                });
                                this.back();
                            }
                        }).catch(error => {
                            console.log(error);
                        });
                    }else{
                        axios({
                            url: `/api/wageTypeWorker/update/updateWageTypeValue`,
                            method: "POST",
                            data: {'propmap':this.dyna,'name': this.upsertForm.workName,'workNumber':this.upsertForm.workCode,'salaryTime':this.upsertForm.salaryTime,'id': this.listId}
                        }).then(res => {
                            if(res.data=='false'){
                                this.$message({
                                    message: res.data2,
                                    type: "warning"
                                });
                            }else{
                                this.$message({
                                    message: res.data2,
                                    type: "success"
                                });
                                this.back();
                            }
                        }).catch(error => {
                            console.log(error);
                        });
                    }
                }
            });
        }
    }
}
</script>

<style lang="scss" scoped>
.el-range-editor--mini.el-input__inner, .el-input{
    width: 200px !important;
}
</style>

