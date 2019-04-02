<template>
    <div class="saveOrUpdateCrud">
        <div style="position: absolute;top: 80px;right: 60px;z-index:999">
            <go-to-back :clickHandle="close" :btnText="'返回'"></go-to-back>
            <!-- <a class="table-edit" @click="back"><strong class="iconfont icon-undo"></strong>返回</a> -->
        </div>
        <el-form :model="upsertForm" size="mini" ref="upsertForm" label-width="100px" >
            <input type="hidden" :value="upsertForm.id">
            <el-form-item label="类型名称:" prop="typeName">
               {{upsertForm.typeName}}
            </el-form-item>
            <el-form-item label="包含属性:" prop="inclusionProperty">
                    <div  v-for="(item,index) in upsertForm.sortList" :key="index" class="box">
                        <span>{{item.attributeName}}</span><span>权重：{{item.sort}}</span>
                    </div>
            </el-form-item>
            <el-form-item label="是否立即使用:" prop="state">
                <template slot-scope="scope">
                <span v-if="upsertForm.state=='1'">立即投入使用</span>
                    <span v-if="upsertForm.state=='0'">暂不投入使用</span>
                </template>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
    import axios from 'axios'
    import goToBack from '../component/btnGoBack'
    export default {
        components:{goToBack},
        name: "wageTypeShow",
        props: ['title', 'id'],
        data() {
            return {
                upsertForm: {
                    id: '',
                    createTime: '',
                    typeName: '',
                    inclusionProperty: [],
                    sortList: [],
                    state:''
                },
                wageAttributeList: [],
                options: []
            }
        },
        created() {
            axios({
                url: `/api/wageType/update/findWageTypeById/${this.id}`,
                method: 'GET'
            }).then(res => {
                Object.assign(this.upsertForm, res.data);
            }).catch(error => {

            })
            this.findwageSortList();
        },
        mounted() {

        },
        computed: {

        },
        methods: {
            getList(item) {
                let c = this.upsertForm.sortList.findIndex(i => i.id === item.id);
                if (c >= 0) {
                    this.upsertForm.sortList.splice(c, 1);
                } else {
                    this.$set(item, 'sort', 1);
                    this.upsertForm.sortList.push(item);
                }
            },
            close() {
                this.$emit('closeSaveOrUpdate');
            },
            handleChange(value) {
                console.log(value);
            },
            findwageSortList() {
                axios({
                    url: `/api/wageType/update/findWageTypeByTypeId/${this.id}`,
                    method: 'GET'
                }).then(res => {
                    res.data.forEach(item => {
                        this.upsertForm.inclusionProperty.push(item.id)
                    })
                    this.upsertForm.sortList = res.data;
                }).catch(error => {
                    //do something
                })
            }
        }
    }
</script>

<style scoped lang="scss">
    .saveOrUpdateCrud{
        width:60%;
        // margin: 20px 0 0 10px;
        .box{
            width: 200px;
            display: flex;
            justify-content: space-between;
            margin-bottom: 10px;
        }
        .title-box{
            span{
                display: inline-block;
                font-size: 20px;
            }
            .span1{
                margin: 0 0 20px 70px;
            }
            .span2{
                margin: 0 0 20px 185px;
            }
        }
    }
</style>