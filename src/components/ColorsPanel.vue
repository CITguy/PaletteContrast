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
  .color {
    background-color: white;
    border: 1px solid #ccc;
    display: flex;
    flex-grow: 1;
    height: 4rem;
    margin: 0.75rem 1rem;

    &:hover {
      cursor: pointer;
      background-color: hsl(0, 0%, 95%);
    }

    &.current {
      background-color: aliceblue;
      border-color: black;
      bottom: 0;
      position: sticky;
      top: 0;
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
