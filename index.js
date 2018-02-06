import Table from './components/Table.vue';
import options from './options';

export default {
    install (Vue, globalOptions) {
        if (globalOptions) {
            Object.keys(globalOptions).map(function(key) {
                options[key] = gloablOptions[key];
            });
        }

        Vue.component('vue-table', Table);
    }
}