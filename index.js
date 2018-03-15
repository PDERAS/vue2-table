import Table from './components/Table.vue';
import options from './options';

function install (Vue, globalOptions) {
    if (globalOptions) {
        Object.keys(globalOptions).map(function(key) {
            options[key] = globalOptions[key];
        });
    }

    Vue.component('vue-table', Table);
}

export default install;
