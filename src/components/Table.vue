<template>
<div class="vue-table__wrapper">
    <div class="vue-table__actions">
        <SearchBar v-if="hasSearch" :on-search="search" @update-search="updateSearch" />
        <div :class="{ 'full-width': !hasSearch }" class="vue-table__actions-slot">
            <slot name="actions" />
        </div>
    </div>
    <table class="vue-table">
        <thead class="vue-table__header">
            <tr>
                <SortableHeader v-for="header in headers"
                    :key="header.label"
                    v-bind="header"
                    :order="defaultParams.order"
                    :selected="defaultParams.selectedCol"
                    :loading="loading"
                    @select-col="selectCol" />
            </tr>
        </thead>
        <tbody class="vue-table__body">
            <slot v-for="(row, idx) in formattedTableData"
                :id="'row-' + idx"
                :row="row"
                :index="idx"
                :vue="vue"
                name="row" />
            <tr v-if="loading">
                <td :colspan="headers.length">
                    Loading...
                </td>
            </tr>
            <tr v-else-if="tableData.length == 0">
                <td :colspan="headers.length">
                    No data available ...
                </td>
            </tr>
        </tbody>
    </table>
    <div v-if="!loading && showPagination" class="vue-table__navigation">
        <button :disabled="!pagination.prev" class="pagination" @click="update(pagination.prev)">
            &larr;
        </button>
        <div v-if="internalData.length > 0 || (pagination.current_page && pagination.last_page)" class="current-page">
            Page {{ pagination.current_page }} of {{ pagination.last_page }}
        </div>
        <button :disabled="!pagination.next" class="pagination"  @click="update(pagination.next)">
            &rarr;
        </button>
    </div>
</div>
</template>

<script>
import SearchBar from './SearchBar';
import SortableHeader from './SortableHeader';
import defaults from '../options';

export default {
    name: 'VueTable',

    components: {
        SearchBar,
        SortableHeader
    },

    props: {
        data: {
            type:       Array,
            default:    () => []
        },

        hasSearch: {
            type: Boolean,
            default: true
        },

        headers: {
            required:   true,
            type:       Array
        },

        methods: {
            type:      Object,
            default:   () => new Object()
        },

        paginate: {
            type:       Number,
            default:    10
        },

        searchParams: {
            type:       Object,
            default:    () => new Object()
        },

        showPagination: {
            type:       Boolean,
            default:    true
        },

        showEmpty: {
            type:       Boolean,
            default:    defaults.showEmpty
        },

        url: {
            type:       String,
            default:    null
        },

        vuexSet: {
            type:       String,
            default:    null
        },

        vuexGet: {
            type:       String,
            default:    null
        },

        beforeUpdate: {
            type:       Function,
            default:    null
        },

        afterUpdate: {
            type:       Function,
            default:    null
        }
    },

    computed: {
        tableData: {
            get() {
                if (!this.vuexGet) {
                    return this.filteredData;
                } else {
                    return this.$store.getters[this.vuexGet] || this.filteredData;
                }
            },
            set(val) {
                val.forEach(item => {
                    item.methods = this.methods;
                });

                this.filteredData = val;
                if (this.vuexSet) {
                    this.$store.commit(this.vuexSet, val);
                }
            }
        },

        formattedTableData: {
            get() {
                if (this.showEmpty && this.tableData.length < this.paginate) {
                    let blank = this.headers.reduce((acc, cur) => ({
                        ...acc,
                        [cur.sortBy]: String.fromCharCode(160)
                    }), {});

                    return [
                        ...this.tableData,
                        ...new Array(this.paginate - this.tableData.length).fill(blank)
                    ];
                }

                return this.tableData;
            }
        }
    },

    data: () => ({
        filteredData:       [],
        internalData:       [],

        loading:            false,

        pagination: {
            current_page:   null,
            last_page:      null,
            next:           null,
            prev:           null
        },

        defaultParams: {
            order:          'asc',
            paginate:       10,
            selectedCol:    null,
            term:           null
        },

        vue: null
    }),

    mounted() {
        this.defaultParams.paginate = this.paginate;

        for (const key of Object.keys(this.searchParams)) {
            this.defaultParams[key] = this.searchParams[key];
        }

        this.refresh();

        this.vue = this.$root;
    },

    methods: {
        refresh() {
            if (this.url) {
                this.update(this.url);
            } else {
                this.internalData = this.data;
                this.filteredData = this.data;
            }
        },

        selectCol({ col, sort }) {
            this.defaultParams.selectedCol = col;
            this.defaultParams.order = sort;

            if (this.url) {
                this.update(this.url);
            } else {
                this.filteredData.sort((a, b) => {
                    var aCol = a[col];
                    var bCol = b[col];

                    if ((typeof a[col]) == 'string') {
                        aCol = a[col].toUpperCase();
                        bCol = b[col].toUpperCase();
                    }

                    switch (sort) {
                        case 'asc':
                            if (aCol < bCol) { return -1; }
                            else if (aCol > bCol) { return 1; }
                            else { return 0; }
                        case 'desc':
                            if (aCol < bCol) { return 1; }
                            else if (aCol > bCol) { return -1; }
                            else { return 0; }
                    }
                });
            }
        },

        search(term) {
            this.defaultParams.term = term;
            if (this.url) {
                var initialParams = [ 'order', 'paginate', 'selectedCol', 'term' ];

                Object.keys(this.defaultParams).forEach(k => {
                    if (initialParams.indexOf(k) == -1) {
                        delete this.defaultParams[k];
                    }
                });

                Object.keys(this.searchParams).forEach(k => {
                    this.defaultParams[k] = this.searchParams[k];
                });

                this.update(this.url);
            } else {
                term = term.toLowerCase();
                this.filteredData = this.internalData.filter(i => {
                    var combined = Object.values(i).join(' ').toLowerCase();
                    return combined.indexOf(term) > -1;
                });
            }
        },

        update(url) {
            if (typeof this.beforeUpdate === 'function') {
                this.beforeUpdate();
            }

            this.tableData = [];
            this.loading = true;
            axios.get(url, { params: this.defaultParams }) // eslint-disable-line no-undef
                .then(response => {
                    this.tableData = response.data && response.data.data || [];

                    this.pagination = {
                        prev: response.data.prev_page_url,
                        next: response.data.next_page_url,
                        current_page: response.data.current_page,
                        last_page: response.data.last_page
                    };
                    this.loading = false;

                    if (typeof this.afterUpdate === 'function') {
                        this.afterUpdate();
                    }
                })
                .catch(errors => { // eslint-disable-line no-unused-vars
                    this.loading = false;
                });
        },

        updateSearch(term) {
            this.defaultParams.term = term;
        }
    },

    watch: {
        searchParams: {
            handler: function(n) {
                for (const key of Object.keys(n)) {
                    this.defaultParams[key] = n[key];
                }
                this.search(n.term);
            },
            deep: true
        },

        data(val) {
            this.internalData = val;
            this.filteredData = val;
        },

        url(val) {
            this.url = val;
            this.update(this.url);
        },
    },

};
</script>

<style lang="scss">
    $btn-color: #fff;

    .vue-table {
        width: 100%;
        border-collapse: collapse;

        &__actions {
            margin: 10px 0px;
            display: flex;
            align-items: center;
            justify-content: space-between;

            &-slot {
                text-align: right;
                display: flex;
                justify-content: flex-end;
                align-items: center;
                flex: 0 0 75%;
                max-width: 75%;

                button {
                    padding: 6px 10px;
                    font-size: 16px;
                    cursor: pointer;

                    &:focus {
                        outline: none;
                    }
                }

                &.full-width {
                    flex: 100%;
                    max-width: 100%;
                }
            }
        }

        &__body {
            td {
                padding: 10px;
                font-size: 13px;
            }

            tr {
                background: #fff;

                &:nth-child(2n + 1) {
                    background: darken(#fff, 5%);
                }
            }
        }

        &__navigation {
            margin-top: 15px;
            margin-bottom: 15px;
            width: 100%;
            text-align: right;

            .pagination {
                font-size: 16px;
                border: none;
                background: $btn-color;
                padding: 7px 10px;
                cursor: pointer;

                &:focus {
                    outline: none;
                }

                &:hover {
                    background: darken($btn-color, 20%);
                }
            }

            .current-page {
                padding: 10px;
                font-size: 14px;
                display: inline-block;
            }
        }
    }
</style>
