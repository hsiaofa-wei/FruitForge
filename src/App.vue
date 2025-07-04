<template>
  <div id="app">
    <router-view /> 
  </div>
</template>

<script>
export default {
  name: 'App',
};
</script>

<style>
/* 确保全局样式不影响弹窗 */
body {
  overflow: auto;
}

#app {
  position: static; 
  font-family: Arial, sans-serif;
}
</style>