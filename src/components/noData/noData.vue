<template>
  <div class="nodata" :style="{padding: paddingSize+ 'px 0'}">
    <img src="../../assets/img/emp_icon.png" alt="">
    <p>{{title}}</p>
  </div>
</template>
<script>
export default {
  props: {
    title: {
      type: String,
      default: '暂无数据~'
    },
    paddingSize: {
      type: Number,
      default: 50
    }
  }
}
</script>
<style scoped lang="scss">
.nodata {
  width: 100%;
  text-align: center;
  img {
    width: 150px;
  }
  p {
    font-size: 16px;
    color: #999;
  }
}
</style>
