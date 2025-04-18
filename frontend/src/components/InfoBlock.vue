<template>
  <div class="info-block">
    <div class="header">
      {{ title }}
    </div>
    <div class="content">
      <template v-if="isHtmlContent">
        <span v-html="content"></span>
      </template>
      <template v-else>
        {{ content }}
      </template>
      <svg-icon v-if="icon" type="mdi" :path="icon" width="24" height="24" />

    </div>
  </div>
</template>

<script>
import SvgIcon from '@jamescoyle/vue-icon';

export default {
  components: {
    SvgIcon,
  },
  props: {
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    isHtmlContent: {
      type: Boolean,
      default: false,
    },
    icon: String,

  },
}
</script>

<style>
.info-block {
  min-width: 200px;
  max-width: 250px;
  margin: 15px;
  display: flex;
  flex-direction: column;
  background: #130377;
}
.header {
  color: #b5f40a;
  border-bottom: 1px solid red;
  height: 40px;
  align-content: center;
}
.content {
  color: #dddddd;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 10px 0;
}
</style>