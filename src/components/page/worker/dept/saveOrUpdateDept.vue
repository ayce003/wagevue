<template>
    <div class="saveOrUpdateCrud">
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item></el-breadcrumb-item>
            <el-breadcrumb-item>{{title}}</el-breadcrumb-item>
        </el-breadcrumb>
        <el-form :model="upsertForm" size="mini" :rules="rules" ref="upsertForm" label-width="80px" style="margin-top: 20px;" >
            <input type="hidden" :value="upsertForm.id">
                      <el-form-item label="部门名称" prop="deptName">
                         <el-input  v-model="upsertForm.deptName" auto-complete="off"></el-input>
                     </el-form-item>
                      <el-form-item label="部门id" prop="deptId">
                         <el-input  v-model="upsertForm.deptId" auto-complete="off"></el-input>
                     </el-form-item>
        </el-form>
        <div  class="dialog-footer" style="text-align: center;">
            <el-button class="large" size="mini" @click="close">取 消</el-button>
            <el-button class="large" size="mini" type="primary" v-if="title=='增加'" v-display:dept-save @click="saveOrUpdate('upsertForm')">确 定</el-button>
            <el-button class="large" size="mini" type="primary" v-else v-display:dept-update @click="saveOrUpdate('upsertForm')">确 定</el-button>
        </div>
    </div>
</template>

<script>
    import axios from 'axios'
    export default {
        name: "saveOrUpdateDept",
        props: ['title','id'],
        data(){
            return {
                upsertForm:{
                        id:'',
                        deptName:'',
                        deptId:'',
                        createTime:'',
                        updateTime:''
                },
                rules: {
                          deptName: [
                                  { required: true, message: '请输入部门名称', trigger: 'blur',transform:val=>val.trim() },
                                  {  max: 32, message: '长度必须少于32个字符', trigger: 'blur' }
                              ],
                          deptId: [
                                  { required: true, message: '请输入部门id', trigger: 'blur',transform:val=>val.trim() },
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
                }
            }
        },
        created(){
          if(this.title=='修改'){
              axios({
                  url:`${home}/dept/update/findDeptById/${this.id}`,
                  method:'GET'
              }).then(res=>{
                  Object.assign(this.upsertForm,res.data);
              }).catch(error=>{

              })
          }
        },
        mounted(){

        },
        methods:{
            saveOrUpdate(formName){
                this.$refs[formName].validate(valid=>{
                    if(valid){
                        axios({
                            url:`${home}/dept/${this.title==='增加'?'saveDept':'update/updateDept'}`,
                            method:'POST',
                            data:this.upsertForm
                        }).then(res=>{
                            this.$message({
                                message: this.title+'成功',
                                type: 'success'
                            });
                            this.$emit('closeSaveOrUpdate',true);
                        }).catch(error=>{
                            //do something
                        })


                    }
                })
            },
            close(){
                this.$emit('closeSaveOrUpdate');
            }
        }
    }
</script>

<style scoped>
    .saveOrUpdateCrud{
        margin: 20px 0 0 10px;
    }
</style>