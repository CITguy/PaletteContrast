import Vue from 'vue'
import App from './App.vue'

Vue.config.productionTip = false

// TODO: Modularize vue filters
Vue.filter('toFixed', numberValue => {
    try {
        return numberValue.toFixed(1)
    } catch (e) {
        return numberValue
    }
});

Vue.filter('toJSON', value => {
    return JSON.stringify(value)
})

let app = new Vue({
    render: h => h(App)
})

app.$mount('#app')
