import Table from './components/Table.vue';
import options from './options';

const VueTablePlugin = {
    install(Vue, globalOptions) {
        if (globalOptions) {
            Object.keys(globalOptions).map(function (key) {
                // update values in options.js so they can be imported elsewhere
                options[key] = globalOptions[key];
            });
        }
        // Globally register vue-table
        Vue.component(Table.name, Table);
    }
};

export default VueTablePlugin;
