<template>
    <div class="look">
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item></el-breadcrumb-item>
            <el-breadcrumb-item>查看</el-breadcrumb-item>
        </el-breadcrumb>
        <el-form :model="upsertForm" size="mini"  ref="upsertForm" label-width="80px" style="margin-top: 20px;" >
            <input type="hidden" :value="upsertForm.id">
                      <el-form-item label="岗位名称" prop="postName">
                         {{upsertForm.postName}}
                     </el-form-item>
                      <el-form-item label="岗位id" prop="postId">
                         {{upsertForm.postId}}
                     </el-form-item>
        </el-form>
        <div  class="dialog-footer" style="text-align: center;">
            <el-button class="large" size="mini" @click="close">取 消</el-button>
        </div>
    </div>
</template>

<script>
    import axios from 'axios'
    export default {
        name: "lookPost",
        props: ['id'],
        data(){
            return {
                upsertForm:{
                        id:'',
                        postName:'',
                        postId:'',
                        createTime:'',
                        updateTime:''
                }
            }
        },
        created(){
          axios({
                url:`${home}/post/look/lookPostById/${this.id}`,
                method:'GET'
            }).then(res=>{
                Object.assign(this.upsertForm,res.data);
            }).catch(error=>{
                console.log(error);
            })
        },
        mounted(){

        },
        methods:{
            close(){
                this.$emit('update:visible');
            }
        }
    }
</script>

<style scoped>
    .look{
        width:60%;
        margin: 20px 0 0 10px;
    }
</style>