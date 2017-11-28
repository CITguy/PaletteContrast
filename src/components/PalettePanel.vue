<template>
  <div id="palettes" class="panel">
    <header class="panel__head">
      <div class="padded">
        <h2 class="dsSectionHeader">Choose Palette</h2>
        <p>
          Select a color palette to get started.
        </p>
      </div>
    </header>
    <div class="panel__body" v-if="palettes.length > 0">
      <div
        v-for="palette in palettes"
        :class="['palette', { current: isCurrent(palette) }]"
        @click="select(palette)">

        <div class="datum datum--description">
          <div class="datum__value">{{palette.name}}</div>
          <span class="datum__label">{{palette.description}}</span>
        </div>
        <div class="datum">
          <span class="count pill">{{palette.colors.length}}</span>
        </div>

        <!--
        <div class="control">
          <ds-icon type="angle-right"></ds-icon>
        </div>
        -->
      </div>
    </div>
    <div class="panel__body padded" v-else>
      <p>No Palettes Defined</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'palette-panel',
  props: {
    palettes: {
      type: Array,
      default: [],
    },
    currentPalette: {
      type: Object,
      default: function () {
        if (this.palettes.length > 0) {
          return this.palettes[0];
        } else {
          return {};
        }
      }
    }
  },
  data () {
    return {
      value: {},
    };
  },
  created: function () {
    this.value = this.currentPalette;
  },
  methods: {
    isCurrent (palette) {
      return palette === this.value;
    },
    select (palette) {
      this.value = palette;
      this.$emit('change', this.value);
    }
  }
}
</script>

<style lang="less">
  @import (reference) '../vars';
  .palette {
    background-color: transparent;
    border: 1px solid @gray-20;
    display: flex;
    min-height: 4rem;
    margin: 0.75rem;

    &:hover {
      background-color: @gray-05;
      cursor: pointer;
    }

    &.current {
      background-color: white;
      border-color: @gray-90;
      box-shadow: 0 4px 6px -4px @gray-90;
      position: sticky;
      top: 0;
    }
  }
</style>
