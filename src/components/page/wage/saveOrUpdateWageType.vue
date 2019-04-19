<template>
    <div class="saveOrUpdateCrud">
       <!-- <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item></el-breadcrumb-item>
            <el-breadcrumb-item>{{title}}</el-breadcrumb-item>
        </el-breadcrumb>-->
        <el-form :model="upsertForm" size="mini" :rules="rules" ref="upsertForm" label-width="120px" style="margin-top: 20px;" >
            <input type="hidden" :value="upsertForm.id">
                      <el-form-item label="类型名称" prop="typeName">
                         <el-input  v-model="upsertForm.typeName" auto-complete="off"></el-input>
                     </el-form-item>
                    <el-form-item label="包含属性" prop="inclusionProperty">
                        <el-checkbox-group v-model="upsertForm.inclusionProperty" >
                            <el-checkbox @change="getList(item)" v-for="item in wageAttributeList" :label="item.id"  :key="item.id">{{item.attributeName}}</el-checkbox>
                        </el-checkbox-group>
                    </el-form-item>

            <el-form-item>
                <p>发放工资条按照设置权重从左往右排放（权重1为最高，依次权重逐渐减弱）</p>
                <div class="title-box"><span class="span1">已选择属性</span><span class="span2">设置权重</span></div>
                <div v-for="(item,index) in upsertForm.sortList" :key="index" class="box">
                    <span style="font-size: 15px;margin-left: 90px;">{{item.attributeName}}</span>
                    <el-input-number style="margin-left: 140px" v-model="item.sort" controls-position="right" :min="1" :max="100" :class="{active:error(item.sort)}"></el-input-number>
                    <!--<el-input style="width: 40px;margin-left: 140px" v-model="item.sort" ></el-input>-->
                </div>

      </el-form-item>
            <el-form-item label="是否立即使用" prop="state">
                <el-radio v-model="upsertForm.state" label="1">立即投入使用</el-radio>
                <el-radio v-model="upsertForm.state" label="0">暂不投入使用</el-radio>
            </el-form-item>
    </el-form>
    <div class="dialog-footer" style="margin-left: 20%;margin-top:10%">
      <el-button class="large" size="mini" @click="close" type="cancel">取 消</el-button>
      <el-button class="large" size="mini" type="primary" v-if="title=='增加'"  @click="saveOrUpdate('upsertForm')">确 定</el-button>
      <el-button class="large" size="mini" type="primary" v-else  @click="saveOrUpdate('upsertForm')">确 定</el-button>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  name: "saveOrUpdateWageType",
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
      options: [],
      searchParams: {
        pager: {}
      },
      rules: {
        typeName: [
          { required: true, message: '请输入类型名称', trigger: 'blur' }
        ],
        inclusionProperty: [
          { required: true, message: '请选择包含属性', trigger: 'blur' }
        ],
          state: [
              { required: true, message: '请确认是否启用', trigger: 'blur' },
          ],
      },
      repeatSort:[],
    }
  },
  created() {
    if (this.title == '修改') {
      axios({
        url: `/api/wageType/update/findWageTypeById/${this.id}`,
        method: 'GET'
      }).then(res => {
        Object.assign(this.upsertForm, res.data);
      }).catch(error => {

      })
        this.findwageSortList();
    }
    this.findwageAttributList();

  },
  mounted() {

  },
  computed:{
    // 计算权重出现相同的次数
    isCount(){
      let r = [];
      this.upsertForm.sortList.forEach(item => {
          let i = this.containCount(r, item);
          if (i != -1) {
              r[i].count++;
          } else {
              item &&
                  r.push({
                      sort: item.sort,
                      count: 1
                  });
          }
      });
      return r;
    },
  },
  methods: {
    getList(item) {
      let c = this.upsertForm.sortList.findIndex(i => i.id === item.id);
      if (c >= 0) {
        this.upsertForm.sortList.splice(c, 1);
        this.upsertForm.sortList.forEach((item,index) => {
          this.$set(item, 'sort', index+1);
        })
      } else {
        this.$set(item, 'sort', this.upsertForm.sortList.length+1);
        this.upsertForm.sortList.push(item);
      }
    },
    saveOrUpdate(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let canSubmit = true
          this.repeatSort = []; //每次判断前要先清空之前的缓存
          this.isCount.forEach(item=>{
            if(item.count>1){
              this.repeatSort.push(item.sort);
              canSubmit = false
            }
          })
          if(canSubmit) {
            axios({
                url: `/api/wageType/${this.title === '增加' ? 'saveWageType' : 'update/updateWageType'}`,
                method: 'POST',
                data: this.upsertForm
              }).then(res => {
                this.$message({
                  message: this.title + '成功',
                  type: 'success'
                });
                this.$emit('closeSaveOrUpdate', true);
              }).catch(error => {
                //do something
              })
          } else {
            this.$message({
                message: '属性权重不能一样',
                type: 'warning'
              });
          }
        }
      })
    },
    error(sort){
      let hasActive = false
      this.repeatSort.forEach(item=>{
        if(item==sort){
          hasActive=true;
        }
      })
      return hasActive
    },
    containCount(arr, obj) {
        if (!obj) return -1;
        return arr.findIndex(item => {
            return item.sort == obj.sort;
        });
    },

    close() {
      this.$emit('closeSaveOrUpdate');
    },
    findwageAttributList() {
      axios({
        url: `/api/wageAttribute/update/findWageAttributeListByCondition`,
        method: 'POST',
        data: this.searchParams
      }).then(res => {
        this.wageAttributeList = res.data;
      }).catch(error => {
        //do something
      })
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
        .el-checkbox{
          margin: 0 30px 0 0;
        }
        .box{
          width: 480px;
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
    .active{
      border :1px solid red;
    }
</style>