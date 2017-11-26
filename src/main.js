import Vue from 'vue';
import App from './App.vue';

// TODO: Modularize vue filters
Vue.filter('toFixed', numberValue => {
    try {
        return numberValue.toFixed(1);
    } catch (e) {
        return numberValue;
    }
});

Vue.filter('toJSON', value => {
    return JSON.stringify(value);
});

new Vue({
    el: '#app',
    render: h => h(App)
});
