<template>
    <div>
        <el-card class="box-card">
            <div slot="header" class="clearfix">
                <span>
                    部门管理树
                </span>
                <el-button style="float: right; padding: 3px 0" type="text" @click="showAddDialog">添加部门</el-button>
            </div>
            <el-tree
                    :props="defaultProps"
                    :data="perms"
                    node-key="id"
                    :default-expanded-keys="openKeys"
                    :expand-on-click-node="false">
                      <span class="custom-tree-node" slot-scope="{ node, data }">
                      <template>
                          <span>
                              {{data.deptName}}
                          </span>
                      </template>
                        <span >
                          <el-button type="text" size="mini" @click="() => appendChild(data)">添加子部门</el-button>
                          <el-button type="text" size="mini" @click="() => updatePerm(data)">编辑</el-button>
                          <el-button type="text" size="mini" @click="() => deleteData(data.id,data.parentId)">删除</el-button>
                        </span>
                      </span>
            </el-tree>
        </el-card>
        <!--添加或者修改表单-->
        <el-dialog   :title="dialog.title"  width="650px"  :visible.sync="dialog.dialogFormVisible">
            <el-form class="upsertForm" :model="upsertForm" :rules="rules" ref="upsertForm" label-width="80px" >
                <input type="hidden" :value="upsertForm.id">
                <input type="hidden" :value="upsertForm.parentId"/>
                <el-form-item label="部门名称" prop="deptName">
                    <el-input v-model="upsertForm.deptName" auto-complete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="clear">取 消</el-button>
                <el-button v-if="dialog.title=='增加'" type="primary" @click="saveOrUpdate('upsertForm')">确 定</el-button>
                <el-button v-else  type="primary" @click="saveOrUpdate('upsertForm')">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    /**
     * 学校总权限
     */
    import axios from 'axios';
    export default {
        name: "dept1",
        data() {
            return {
                iconDialog:{
                    visible:false,
                    iconList:[],
                    searchKey:''
                },
                perms: [],
                openKeys:[],
                defaultProps: {
                    id: "id",
                    label: "deptName",
                    children: 'children',
                },
                dialog:{
                    dialogFormVisible:false,
                    title:'增加',
                    showAutoBtn:true
                },
                upsertForm:{
                    id:'',
                    deptName: '',
                    parentId: '',
                    level: 0,
                    leaf: 0,
                    path: '',
                    deptId: '',
                    sort: 0,
                    createTime: '',
                    updateTime: '',
                },
                rules: {
                    deptName: [
                        { required: true, message: '请输入部门名称', trigger: 'blur',transform:val=>val.trim()  }
                    ]
                }
            }
        },
        created(){
            this.loadPerms();
        },
        methods: {
            loadPerms(id){
                axios({
                    url:`api/dept/findDeptsTreeByCondition`,
                    method:'GET'
                }).then(res=>{
                    this.perms=res.data;
                    if(id){
                        this.openKeys = [id];
                    }
                }).catch(error=>{
                })
            },
            showAddDialog(e,pId){
                this.dialog.dialogFormVisible=true;
                this.dialog.title='增加';
                this.upsertForm.parentId=pId;
            },
            appendChild({id:id}){
                this.showAddDialog(undefined, id);
            },
            updatePerm({id:id}){
                this.showUpdateDialog(id);
            },
            showUpdateDialog(id){
                axios({
                    url:`api/dept/update/findDeptById/${id}`,
                    method:'GET'
                }).then(res=>{
                    Object.assign(this.upsertForm, res.data);
                    this.dialog.dialogFormVisible=true;
                    this.dialog.title = '修改';
                }).catch(error=>{

                })

            },
            saveOrUpdate(formName){
                this.$refs[formName].validate(valid=>{
                    if(valid){

                        axios({
                            url:`api/dept/findDeptsByCondition`,
                            method:'POST',
                            data:{
                                deptName:this.upsertForm.deptName,
                                parentId:this.upsertForm.parentId,
                            }
                        }).then(res=>{
                            let num = res.data.length;
                            if(num>0){
                                this.$message({
                                type: 'warning',
                                message: '该部门名已存在'
                                });
                                this.$refs.upsertForm.resetFields();//清空
                                this.dialog.dialogFormVisible = false;
                            }else {
                                axios({
                                    url:`api/dept/${this.dialog.title==='增加'?'saveDept':'update/updateDept'}`,
                                    method:'POST',
                                    data:this.upsertForm
                                }).then(res=>{
                                    this.$message({
                                        message: this.dialog.title+'成功',
                                        type: 'success'
                                    });
                                    this.dialog.dialogFormVisible = false;
                                    this.loadPerms(this.upsertForm.id?this.upsertForm.id:this.upsertForm.parentId);
                                    this.$refs.upsertForm.resetFields();//清空
                                });

                            }

                        }).catch(error=>{
                            //do something
                        })

                    }
                })
            },
            deleteData(id,parentId){
                this.$confirm('删除吗?删除将删除地下所有子节点', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    axios({
                        url: `api/dept/deleteDept/${id}`,
                        method: 'GET'
                    }).then(res => {
                        this.$message({
                            type: 'success',
                            message: '删除成功!'
                        });
                        this.loadPerms(parentId);
                    }).catch(error => {

                    })

                });

            },
            operHeader(h, { column, $index }){
                return h('span',{
                        'class':{
                            cell:true
                        }
                    },
                    [
                        h('span',{domProps:{innerHTML:'操作'}}),
                        h('i',{
                            'class':{
                                iconfont:true,
                                'icon-add':true
                            },
                            style:{
                                marginLeft:'10px',
                                fontSize:'20px',
                                color:config.skin,
                                verticalAlign:'middle',
                                cursor:'pointer'
                            },
                            on: {
                                click: this.showAddDialog
                            }
                        })
                    ]
                );
            },
            submit(){

            },
            clear(){
                this.dialog.dialogFormVisible = false;
                this.upsertForm.deptName=null;
                this.$refs.upsertForm.resetFields();//清空
            },


        }
    }
</script>

<style scoped lang="scss">
    .box-card {
        width: 500px;
    }
    .custom-tree-node {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 14px;
        padding-right: 8px;
    }
    .upsertForm .el-input{
        width:480px;
    }
    .upsertForm {
        .icon{
            width:200px;
            /deep/  .el-input__inner{
                width:200px;
                background-color: #f4f4f4;
            }

        }
        .iconfont{
            margin-left: 10px;
            font-size: 25px;
            vertical-align: middle;
            cursor: pointer;
        }
    }
    .el-uploader img{
        width:168px;
        height: 134px;
    }
    .uploadAppIcon /deep/ .el-form-item__content{
        line-height: normal;
        i.el-uploader-icon{
            width:168px;
            height: 134px;
            line-height: 134px;
        }
    }
</style>