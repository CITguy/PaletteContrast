// Need: lodash for _.uniq
Vue.component('palette-list', {
    template: `<div>palette-list</div>`
});

Vue.component('color-list', {
    template: `<div>color-list</div>`
});

Vue.component('contrast-data', {
    template: `<div>contrast-data</div>`
});

Vue.component('contrast-result', {
    template: `
        <div :class="classes">
            {{calculate(fgcolor, bgcolor) | toFixed }}
        </div>
    `,
    props: ['fgcolor', 'bgcolor'],
    computed: {
        classes() {
            let out = ['contrast-result'];
            let contrast = this.calculate(this.fgcolor, this.bgcolor);
            if (contrast >= 7) {
                out.push('pass-aaa');
            } else if (contrast > 4.5) {
                out.push('pass-aa');
            } else {
                out.push('fail');
            }
            return out;
        }
    },
    methods: {
        calculate(color1, color2) {
            try {
                return chroma.contrast(color1, color2);
            } catch (e) {
                return 1.0;
            }
        }
    },
    filters: {
        toFixed: function (value) {
            try {
                return value.toFixed(1);
            } catch (e) {
                return value;
            }
        }
    }
});
/*
 * <div id="app">
 *   <PaletteList/> <!-- 1 -->
 *   <ColorList/> <!-- 2 -->
 *   <ContrastData/>  <!-- 3 -->
 * </div>
 *
 * 1. Palette CRUD. On 'select', update ColorList and ContrastData with palette colors.
 * 2. Color CRUD. On 'select', update ContrastData with selected color.
 * 3. Contrast analysis between selected color and all other colors in current palette.
 */
new Vue({
    el: '#app',
    data: {
        // selected palette
        palette: {
            name: '',
            description: '',
            colors: [
                { name: 'Gray-0000', value: '#ffffff' },
                { name: 'Gray-0025', value: '#fafafa' },
                { name: 'Gray-0050', value: '#f5f5f5' },
                { name: 'Gray-0100', value: '#eeeeee' },
                { name: 'Gray-0200', value: '#e7e7e7' },
                { name: 'Gray-0300', value: '#e0e0e0' },
                { name: 'Gray-0400', value: '#d8d8d8' },
                { name: 'Gray-0500', value: '#bdbdbd' },
                { name: 'Gray-0600', value: '#9e9e9e' },
                { name: 'Gray-0700', value: '#757575' },
                { name: 'Gray-0800', value: '#616161' },
                { name: 'Gray-0900', value: '#424242' },
                { name: 'Gray-0950', value: '#333333' },
                { name: 'Gray-0975', value: '#212121' },
                { name: 'Gray-1000', value: '#000000' },
                { name: 'Red-100', value: '#ffcdd2' },
                { name: 'Red-500', value: '#f44336' },
                { name: 'Red-700', value: '#d32f2f' },
                { name: 'Red-Accent', value: '#ec515f' },
                { name: 'Blue-100', value: '#bbdefb' },
                { name: 'Blue-500', value: '#3391ff' },
                { name: 'Blue-700', value: '#0d74d1' },
                { name: 'Blue-900', value: '#0d47a1' },
                { name: 'Blue-Accent', value: '#00bdff' },
                { name: 'Green-50', value: '#eef7ef' },
                { name: 'Green-100', value: '#c8e6c9' },
                { name: 'Green-500', value: '#4caf51' },
                { name: 'Green-700', value: '#2e7d32' },
                { name: 'Green-Accent', value: '#43b947' },
                { name: 'Orange-100', value: '#ffecb3' },
                { name: 'Orange-500', value: '#ffc107' },
                { name: 'Orange-700', value: '#d14904' },
                { name: 'Orange-Accent', value: '#ffd740' },
                { name: 'Purple-100', value: '#4a5acc' },
                { name: 'Purple-500', value: '#3b44a9' },
                { name: 'Purple-700', value: '#2e3187' },
                { name: 'Purple-Accent', value: '#5a74f2' },
            ],
            isCustom: true
        },
        // selected color
        fgColor: {}
    },
    beforeMount: function () {
        this.fgColor = this.palette.colors[0];
    },
    computed: {
        colorsWithContrast () {
            return this.palette.colors.filter( color => {
                return color.value !== this.fgColor.value;
            }).map( color => {
                let result = {}
                let rawContrast = chroma.contrast(this.fgColor.value, color.value);

                result.contrast = Number.parseFloat(rawContrast.toFixed(1));
                result.aa = result.contrast >= 4.5;
                result.aaa = result.contrast >= 7;
                return _.merge({}, color, result);
            }).sort( (a,b) => {
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
        }
    },
    filters: {
        toFixed: function (value) {
            try {
                return value.toFixed(1);
            } catch (e) {
                return value;
            }
        },
        toJson: function (value) {
            return JSON.stringify(value);
        }
    }
});
