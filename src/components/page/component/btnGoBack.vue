<template>
  <a class="btn-go-back" href="javascript:;" @click="clickHandle()"><img :src="imgIconSrc" alt=""><span>{{btnText}}</span></a>
</template>

<script>
export default {
  props: ['clickHandle', 'btnText'],
  data() {
    return {
      imgIconSrc: require('../../../assets/img/back_icon.png')
    };
  }
}
</script>

<style lang="scss" scoped>
$blue: #4dbd73;
.btn-go-back {
  display: block;
  box-sizing: border-box;
  width: 70px;
  height: 30px;
  font-size: 16px;
  line-height: 30px;
  color: $blue;
  text-align: center;
  text-decoration: none;
  &:hover {
    // line-height: 28px;
    // border: 1px solid $blue;
    // border-radius: 15px;
    text-decoration: underline;
  }
  & > * {
    display: inline-block;
    vertical-align: middle;
  }
  img {
    margin-right: 5px;
  }
}
</style>

