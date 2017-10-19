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
});

Vue.filter('toFixed', function (numberValue) {
    try {
        return numberValue.toFixed(1);
    } catch (e) {
        return numberValue;
    }
});

Vue.filter('toJson', function (value) {
    return JSON.stringify(value);
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
                { name: 'Gray-0', value: '#ffffff' },
                { name: 'Gray-25', value: '#fafafa' },
                { name: 'Gray-50', value: '#f5f5f5' },
                { name: 'Gray-100', value: '#eeeeee' },
                { name: 'Gray-200', value: '#e7e7e7' },
                { name: 'Gray-300', value: '#e0e0e0' },
                { name: 'Gray-400', value: '#d8d8d8' },
                { name: 'Gray-500', value: '#bdbdbd' },
                { name: 'Gray-600', value: '#9e9e9e' },
                { name: 'Gray-700', value: '#757575' },
                { name: 'Gray-800', value: '#616161' },
                { name: 'Gray-900', value: '#424242' },
                { name: 'Gray-950', value: '#333333' },
                { name: 'Gray-975', value: '#212121' },
                { name: 'Gray-1000', value: '#000000' },
                { name: 'Cyan-50', value: '#e4f9f9' },
                { name: 'Cyan-100', value: '#b6e3eb' },
                { name: 'Cyan-500', value: '#16b9d4' },
                { name: 'Cyan-700', value: '#0e94a6' },
                { name: 'Cyan-900', value: '#0c7c84' },
                { name: 'Blue-50', value: '#e1eef9' },
                { name: 'Blue-100', value: '#bbdefb' },
                { name: 'Blue-500', value: '#3391ff' },
                { name: 'Blue-700', value: '#0d74d1' },
                { name: 'Blue-900', value: '#0d47a1' },
                { name: 'Magenta-50', value: '#fce0eb' },
                { name: 'Magenta-100', value: '#f8bbd0' },
                { name: 'Magenta-500', value: '#ec407a' },
                { name: 'Magenta-700', value: '#c2185b' },
                { name: 'Magenta-900', value: '#a5134e' },
                { name: 'Purple-50', value: '#ad87dd' },
                { name: 'Purple-100', value: '#6676bc' },
                { name: 'Purple-500', value: '#3b44a9' },
                { name: 'Purple-700', value: '#2e3187' },
                { name: 'Purple-700', value: '#232968' },
                { name: 'Orange-50', value: '#f8e1bb' },
                { name: 'Orange-100', value: '#fdd179' },
                { name: 'Orange-500', value: '#f57c00' },
                { name: 'Orange-700', value: '#dd6105' },
                { name: 'Orange-900', value: '#c15206' },
                { name: 'Green-500', value: '#c8e6c9' },
                { name: 'Green-700', value: '#4caf51' },
                { name: 'Green-900', value: '#2e7d32' },
                { name: 'Yellow-500', value: '#fff9c4' },
                { name: 'Yellow-700', value: '#ffeb3b' },
                { name: 'Yellow-900', value: '#fbc02d' },
                { name: 'Red-500', value: '#ffcdd2' },
                { name: 'Red-700', value: '#f44336' },
                { name: 'Red-900', value: '#d32f2f' },
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
});
