<template>
  <div id="colors" class="panel">
    <div class="panel__head">
      <div class="padded">
        <h2 class="dsSectionHeader">Text Color</h2>
        <p>
          Choose a color from <b>{{palette.name}}</b> to use as the Text
          color when comparing the rest of the palette colors as Background colors.
        </p>
      </div>
      <form class="filter">
        <div class="searchbox">
          <input 
            placeholder="Search text colors..." 
            ref="txtFilter" 
            type="text"
            v-model="filter" />
          <button v-if="filter" @click.prevent="clearFilter()">
            <ds-icon type="times"></ds-icon>
          </button>
        </div>
      </form>
    </div>
    <div class="panel__body">
      <div v-if="filteredColors.length > 0">
        <div
          v-for="color in filteredColors"
          :class="['color', { current: isCurrent(color) }]"
          @click="select(color)">

          <color-sample :bg="color.value"></color-sample>
          <div class="color__description datum datum--description">
            <div class="datum__value">{{color.name}}</div>
            <code class="datum__label">{{color.value}}</code>
          </div>
        </div>
      </div>
      <div v-else class="padded">
        <p>No Matching Colors</p>
      </div>
    </div>
  </div>
</template>

<style lang="less">
  @import (reference) '../vars';
  .color {
    background-color: transparent;
    border: 1px solid @gray-20;
    display: flex;
    flex-grow: 1;
    height: 4rem;
    margin: 0.75rem;

    &:hover {
      cursor: pointer;
      background-color: @gray-05;
    }

    &__sample {
      border-right: 1px solid @gray-20;
    }

    &.current {
      background-color: white;
      border-color: @gray-90;
      bottom: 0;
      box-shadow: 0 4px 6px -4px @gray-90;
      position: sticky;
      top: 0;

      .color__sample {
        border-color: @gray-90;
      }
    }
  }
</style>

<script>
import ColorSample from './ColorSample.vue';

export default {
  name: 'colors-panel',
  components: {
    'color-sample': ColorSample,
  },
  props: {
    palette: Object,
    currentColor: {
      type: Object,
      default () {
        return this.palette.colors[0];
      }
    }
  },
  data () {
    return {
      value: {},
      filter: '',
    };
  },
  created () {
    this.value = this.currentColor;
    this.filter = '';
  },
  updated () {
    this.value = this.currentColor;
  },
  computed: {
    filteredColors () {
      let filtered = this.palette.colors;

      if (this.filter) {
        const reFilter = new RegExp(this.filter, 'gi');
        filtered = this.palette.colors.filter( (color) => {
          return color.name.match(reFilter);
        });
      }

      return filtered;
    },
  },
  methods: {
    isCurrent (color) {
      return this.value === color;
    },
    select (color) {
      this.value = color;
      this.$emit('change', this.value);
    },
    clearFilter () {
      this.filter = '';
      this.$refs.txtFilter.focus();
    }
  }
};
</script>
