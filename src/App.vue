<style lang="less">
@import (reference) 'vars';
@import 'styles/reset';
@import 'styles/base';
@import 'styles/tables';
@import 'styles/searchbox';

@import 'styles/control';
@import 'styles/datum';
@import 'styles/panel';
@import 'styles/pill';

@import 'styles/helpers';

#app {
  height: 100vh;
  margin: 0;
  padding: 0;

  /* legacy */
  display: -ms-grid;
  -ms-grid-columns: 1fr 1fr 35rem;
  -ms-grid-rows: 100vh;

  /* modern */
  display: grid;
  grid-template-columns: 1fr 1fr 35rem;
  grid-template-rows: 100vh;
  grid-template-areas: 'palettes colors results';
}

#palettes {
  -ms-grid-row: 1;
  -ms-grid-column: 1;
  grid-area: palettes;
}
#colors {
  -ms-grid-row: 1;
  -ms-grid-column: 2;
  grid-area: colors;
}
#results {
  -ms-grid-row: 1;
  -ms-grid-column: 3;
  grid-area: results;
}
</style>

<template>
  <div id="app">
    <palette-panel
       :palettes="palettes"
       :currentPalette="currentPalette"
       @change="onPaletteChange"></palette-panel>

    <colors-panel
       :palette="currentPalette"
       :currentColor="fgColor"
       @change="onColorChange"></colors-panel>

    <results-panel
       :palette="currentPalette"
       :currentColor="fgColor"></results-panel>
  </div>
</template>

<script>
import Palettes from './data/palettes'
import PalettePanel from './components/PalettePanel.vue'
import ColorsPanel from './components/ColorsPanel.vue'
import ResultsPanel from './components/ResultsPanel.vue'
import chroma from 'chroma-js'

export default {
  name: 'app',
  data () {
    return {
      palettes: Palettes,
      currentPalette: {}, // placeholder for selected palette
      fgColor: {} // placeholder for selected foreground color
    }
  },
  components: {
    'palette-panel': PalettePanel,
    'colors-panel': ColorsPanel,
    'results-panel': ResultsPanel
  },
  created: function () {
    this.currentPalette = this.palettes[0]
    this.fgColor = this.currentPalette.colors[0]
  },
  computed: {
    filteredResults () {
      return this.currentPalette.colors.filter(color => {
        return color.value !== this.fgColor.value
      })
    },
    results () {
      if (!this.fgColor) return []

      return this.filteredResults.map((color, idx) => {
        let _contrast = chroma.contrast(this.fgColor.value, color.value)
        _contrast = Number(_contrast.toFixed(1))

        let _reUnsafe = /\W+/gi
        let _id = [
          'result',
          this.fgColor.name.replace(_reUnsafe, ''),
          color.name.replace(_reUnsafe, '')
        ].join('-')

        return {
          id: _id,
          fgColor: this.fgColor,
          bgColor: color,
          contrast: _contrast,
          wcag: {
            'AA-sm': _contrast >= 4.5,
            'AA-lg': _contrast >= 3,
            'AAA-sm': _contrast >= 7,
            'AAA-lg': _contrast >= 4.5
          }
        }
      })
    },
    sortedResults () {
      let _results = [].concat(this.results)
      return _results.sort((a, b) => {
        let result = b.contrast - a.contrast
        if (result === 0) {
          // sort by name (desc) if contrast is same
          if (b.name < a.name) {
            result = -1
          }
          if (b.name > a.name) {
            result = 1
          }
          result = 0
        }
        return result
      })
    }
  },
  methods: {
    onPaletteChange (palette) {
      this.currentPalette = palette
      this.fgColor = palette.colors[0]
    },
    onColorChange (color) {
      this.fgColor = color
    }
  }
}
</script>
