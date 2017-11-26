<template>
  <div class="color__sample" :style="style"><slot></slot></div>
</template>

<style>
  .color__sample {
    flex-shrink: 0;
    width: 4rem;
  }
</style>

<script>
export default {
  props: {
    fg: {
      type: String,
      default: 'inherit'
    },
    bg: {
      type: String,
      default: 'transparent'
    }
  },
  computed: {
    style () {
      return {
        color: this.fg,
        backgroundColor: this.bg
      }
    }
  }
}
</script>
