<template>
    <div class="saveOrUpdateCrud">
        <!--<el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item></el-breadcrumb-item>
            <el-breadcrumb-item>{{title}}</el-breadcrumb-item>
        </el-breadcrumb>-->
        <el-form :model="upsertForm" size="mini" :rules="rules" ref="upsertForm" label-width="80px" style="margin-top: 20px;" >
            <input type="hidden" :value="upsertForm.id">
                      <el-form-item label="属性名称" prop="attributeName">
                         <el-input style="width: 200px"  v-model="upsertForm.attributeName" auto-complete="off"></el-input>
                     </el-form-item>
        </el-form>
        <div  class="dialog-footer" style="margin-left: 5%">
            <el-button class="large" size="mini" @click="close" type="cancel">取 消</el-button>
            <el-button class="large" size="mini" type="primary" v-if="title=='增加'"  @click="saveOrUpdate('upsertForm')">确 定</el-button>
            <el-button class="large" size="mini" type="primary" v-else  @click="saveOrUpdate('upsertForm')">确 定</el-button>
        </div>
    </div>
</template>

<script>
    import axios from 'axios'
    export default {
        name: "saveOrUpdateWageAttribute",
        props: ['title','id'],
        data(){
            return {
                upsertForm:{
                        id:'',
                        attributeName:'',
                        updateTime:''
                },
                rules: {
                          attributeName: [
                                  { required: true, message: '请输入属性名称', trigger: 'blur' },
                                  {  max: 32, message: '长度必须少于32个字符', trigger: 'blur' }
                              ],
                          updateTime: [
                                  { required: true, message: '请输入更新时间', trigger: 'blur' },
                                  {  max: 32, message: '长度必须少于32个字符', trigger: 'blur' }
                              ],
                }
            }
        },
        created(){
          if(this.title=='修改'){
              axios({
                  url:`/api/wageAttribute/update/findWageAttributeById/${this.id}`,
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
                            url:`/api/wageAttribute/${this.title==='增加'?'saveWageAttribute':'update/updateWageAttribute'}`,
                            method:'POST',
                            data:this.upsertForm
                        }).then(res=>{
                            if(res.result.success==true){
                                this.$message({
                                    message: res.result.msg,
                                    type: 'success'
                                });
                                this.$emit('closeSaveOrUpdate',true);
                            }else {
                                this.$message({
                                    message: res.result.msg,
                                    type: 'error'
                                });
                            }


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

<style scoped lang="scss">

</style>