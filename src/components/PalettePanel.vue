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
  .palette {
    background-color: white;
    border: 1px solid #ccc;
    display: flex;
    min-height: 4rem;
    margin: 0.75rem;

    &:hover {
      background-color: hsl(0, 0%, 95%);
      cursor: pointer;
    }

    &.current {
      border-color: blue;
      position: sticky;
      top: 0;
    }
  }
</style>
