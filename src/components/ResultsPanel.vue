<template>
  <div id="results" class="panel">
    <div class="panel__head">
      <div class="padded">
        <h2 class="dsSectionHeader">View Analysis</h2>
        <p>
          See how <b>{{currentColor.name}}</b> contrasts against
          other colors in <b>{{palette.name}}</b>.<br />
          <br />
          <small>Results sorted from High to Low contrast (higher is better).</small>
        </p>
      </div>
      <form class="filter">
        <div class="searchbox">
          <input 
            placeholder="Search contrast results..." 
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
      <div 
        :key="result.id" 
        class="result" 
        v-for="result in sortedResults">

        <ds-disclosure class="result__summary" :aria-controls="result.id">
          <div class="data">
            <div class="control">
              <ds-icon class="expand-icon" type="caret-down"></ds-icon>
            </div>
            <div class="datum">
              <div class="datum__value">{{ result.contrast | toFixed }}</div>
              <span class="datum__label">Contrast</span>
            </div>
            <div class="datum">
              <div class="datum__value">
                <ds-icon v-if="result.wcag['AA-sm'] && result.wcag['AA-lg']" class="superb" type="star"></ds-icon>
                <ds-icon v-else-if="result.wcag['AA-sm'] || result.wcag['AA-lg']" class="pass" type="check"></ds-icon>
                <ds-icon v-else type="times-circle-fill" class="fail"></ds-icon>
              </div>
              <span class="datum__label">AA</span>
            </div>
            <div class="datum">
              <div class="datum__value">
                <ds-icon v-if="result.wcag['AAA-sm'] && result.wcag['AAA-lg']" class="superb" type="star"></ds-icon>
                <ds-icon v-else-if="result.wcag['AAA-sm'] || result.wcag['AAA-lg']" class="pass" type="check"></ds-icon>
                <ds-icon v-else type="times-circle-fill" class="fail"></ds-icon>
              </div>
              <span class="datum__label">AAA</span>
            </div>
            <div class="datum datum--description">
              <div class="datum__value">{{ result.bgColor.name }}</div>
              <span class="datum__label">Background</span>
            </div>
            <div class="datum">
              <div class="datum__value"></div>
              <span class="datum__label"></span>
            </div>
            <color-sample
              class="datum datum--sample"
              :fg="result.fgColor.value"
              :bg="result.bgColor.value">
              Aa
            </color-sample>
          </div>
        </ds-disclosure>

        <ds-reveal class="result__details" :id="result.id">
          <table class="table--wcag">
            <thead>
              <tr>
                <th>Size</th>
                <th>AA</th>
                <th>AAA</th>
                <th>Example</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Normal</td>
                <td class="aa">
                  <ds-icon v-if="result.wcag['AA-sm']" class="pass" type="check"></ds-icon>
                  <ds-icon v-else type="times-circle-fill" class="fail"></ds-icon>
                </td>
                <td class="aaa">
                  <ds-icon v-if="result.wcag['AAA-sm']" class="pass" type="check"></ds-icon>
                  <ds-icon v-else type="times-circle-fill" class="fail"></ds-icon>
                </td>
                <td class="sample" :style="sampleStyle(result)">
                  <code>{{result.fgColor.value}} on {{result.bgColor.value}}</code>
                </td>
              </tr>
              <tr>
                <td>Large</td>
                <td class="aa">
                  <ds-icon v-if="result.wcag['AA-lg']" class="pass" type="check"></ds-icon>
                  <ds-icon v-else type="times-circle-fill" class="fail"></ds-icon>
                </td>
                <td class="aaa">
                  <ds-icon v-if="result.wcag['AAA-lg']" class="pass" type="check"></ds-icon>
                  <ds-icon v-else type="times-circle-fill" class="fail"></ds-icon>
                </td>
                <td class="sample sample--lg" :style="sampleStyle(result)">
                  <code>{{result.fgColor.value}} on {{result.bgColor.value}}</code>
                </td>
              </tr>
            </tbody>
          </table>
          <p>
            <ds-icon type="info-circle"></ds-icon>
            <a href="https://www.w3.org/TR/WCAG20/#visual-audio-contrast" target="_blank">
              WCAG 2.0 <ds-icon type="external-link"></ds-icon>
            </a><br />
            <small>
              <i>Level AA:</i> Normal text requires 4.5:1 contrast while large text requires 3:1<br />
              <i>Level AAA:</i> Normal text requires 7:1 contrast while large text requires 4.5:1
            </small>
          </p>
          <!--
          <pre>{{result}}</pre>
          -->
        </ds-reveal>
      </div>
    </div>
  </div>
</template>

<script>
  import chroma from '../assets/chroma.min.js';
  import ColorSample from './ColorSample.vue';

  export default {
    name: 'results-panel',
    components: {
      'color-sample': ColorSample,
    },
    props: {
      palette: Object,
      currentColor: Object,
    },
    data () {
      return {
        filter: '',
      };
    },
    methods: {
      sampleStyle (result) {
        return {
          color: result.fgColor.value,
          backgroundColor: result.bgColor.value,
        };
      },
      clearFilter () {
        this.filter = '';
        this.$refs.txtFilter.focus();
      }
    },
    computed: {
      excludingFgColor () {
        return this.palette.colors.filter( color => {
          return color.value !== this.currentColor.value;
        });
      },
      filteredColors () {
        let filteredResults = this.excludingFgColor;
        if (this.filter) {
          let reFilter = new RegExp(this.filter, 'gi');
          filteredResults = this.excludingFgColor.filter( color => {
            return color.name.match(reFilter);
          });
        }
        return filteredResults;
      },
      results () {
        if (!this.currentColor) {
          return [];
        } else {
          return this.filteredColors.map( (bgColor) => {
            let fgColor = this.currentColor;
            let _contrast = chroma.contrast(fgColor.value, bgColor.value);
            _contrast = Number(_contrast.toFixed(1));

            let _reUnsafe = /\W+/gi;
            let _id = [
              fgColor.name.replace(_reUnsafe, ''),
              bgColor.name.replace(_reUnsafe, ''),
            ].join('-');

            return {
              id: _id,
              fgColor: fgColor,
              bgColor: bgColor,
              contrast: _contrast,

              wcag: {
                'AA-sm': _contrast >= 4.5,
                'AA-lg': _contrast >= 3,
                'AAA-sm': _contrast >= 7,
                'AAA-lg': _contrast >= 4.5,
              }
            };
          });
        }
      },
      sortedResults () {
        return this.results.sort( (a,b) => {
          let result = b.contrast - a.contrast;
          if (result === 0) {
            // sort by name (desc) if contrast is same
            if (b.name < b.name) {
              result = -1;
            }
            if (b.name > a.name) {
              result = 1;
            }
            result = 0;
          }
          return result;
        });
      },
    }
  }
</script>

<style lang="less">
  @import (reference) '../vars';
  .result {
    & + & {
      border-top: 1px solid @ui-border-color;
    }

    &__summary {
      display: flex;
      height: 3.5rem;
      background-color: white;

      &:hover {
        background-color: @state-info;
      }

      &:focus {
        outline: none; // FIXME
      }

      &[aria-expanded="true"] {
        border-bottom: 1px solid @ui-border-color;
        position: sticky;
        top: 0;

        .expand-icon {
          transform: scaleY(-1);
        }
      }
    }

    &__details {
      background-color: white;
      padding: 1rem 0.5rem 1rem 2rem;

      &[open] {
        box-shadow: inset 1rem 0 @ui-border-color;
      }
    }
  }

  .sample {
    padding: 0.5rem;
    text-align: center;

    &--lg {
      font-size: 14pt;
      font-weight: bold;
    }
  }

  .superb {
    color: gold;

    svg path {
      stroke: goldenrod;
      stroke-width: 1px;
    }
  }

  .pass { 
    color: royalblue;
  }

  .fail { 
    color: crimson; //@state-danger-dark;
  }
</style>
