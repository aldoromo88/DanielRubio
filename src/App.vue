<template>
<div id="app" class="container">
  <!-- <img src="./assets/logo.png" class="img-responsive" alt="Arc Accounts Logo"> -->
  <hello></hello>
</div>
</template>

<script>
import 'vue-multiselect/dist/vue-multiselect.min.css';
import 'bootstrap-sass/assets/stylesheets/_bootstrap.scss';
import 'photoswipe/src/css/main.scss';
import 'photoswipe/dist/default-skin/default-skin.css';
import Hello from './components/Hello';

export default {
  name: 'app',
  components: {
    Hello
  }
}
</script>

<style lang="scss">
$fontColor: #333;

body,
html {
    width: 100%;
    height: 100%;
}

* {
    box-sizing: border-box;
}

body {
    font-size: 14px;
    color: $fontColor;
    font-family: sans-serif;
}
</style>
