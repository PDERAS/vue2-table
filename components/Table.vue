<template>
    <div class="vue-table-wrapper">
        <div class="vue-table-header">
            <search-bar :on-search="search" @update-search="updateSearch" v-if="hasSearch" />
            <div class="vue-table-actions">
                <slot name="actions"></slot>
            </div>
        </div>
        <table class="vue-table">
            <thead>
                <tr class="vue-table-header">
                    <sh v-for="header in headers"
                        :key="header.label"
                        v-bind="header"
                        @select-col="selectCol"
                        :selected="defaultParams.selectedCol"
                        :loading="loading" />
                </tr>
            </thead>
            <tbody class="vue-table-body">
                <slot name="row"
                      v-for="(row, idx) in tableData"
                      :id="'row-' + idx"
                      :row="row"
                      :vue="vue" />
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
        <div class="vue-table-navigation" v-if="!loading">
            <button :disabled="!pagination.prev" class="pagination" @click="changePage(pagination.prev)">
                &larr;
            </button>
            <div class="current-page" v-if="internalData.length > 0">
                Page {{ pagination.current_page }} of {{ pagination.last_page }}
            </div>
            <button :disabled="!pagination.next" class="pagination"  @click="changePage(pagination.next)">
                &rarr;
            </button>
        </div>
    </div>
</template>

<script>
    import searchBar from './Searchbar';
    import sh from './SortableHeader';

    export default {
        name: 'vue-table',

        components: {
            searchBar,
            sh
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

            selectedCol: {
                type:       String,
                default:    null
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
            }
        },

        data: () => ({
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
            }
        }),

        mounted() {
            this.defaultParams.selectedCol = this.selectedCol ? this.selectedCol : null;
            this.defaultParams.paginate = this.paginate;

            this.refresh();
            if (!this.url) {
                this.setPage(1);
            }

            this.vue = this.$root;
        },

        computed: {
            sortedData() {
                let col = this.defaultParams.selectedCol;
                let direction = this.defaultParams.order === 'asc' ? -1 : 1;
                function compare(a,b) {
                    if (a[col] < b[col])
                        return -1 * direction;
                    if (a[col] > b[col])
                        return 1 * direction;
                    return 0;
                }
                return this.internalData.sort(compare);
                
            },
            tableData: {
                get() {
                    if (!this.vuexGet) {
                        if (!this.url) {
                            if (this.pagination.current_page === null) {
                                this.pagination.currentPage = 1;
                            }
                            let start = (this.pagination.current_page - 1) * this.paginate;
                            let end = this.pagination.current_page * this.paginate;
                            
                            return this.sortedData.slice(start, end);
                        } else {
                            return this.internalData;
                        }
                    } else {
                        return this.$store.getters[this.vuexGet];
                    }
                },
                set(val) {
                    val.forEach(item => {
                        item.methods = this.methods
                    });

                    if (!this.vuexSet) {
                        this.internalData = val;
                    } else {
                        this.$store.commit(this.vuexSet, val);
                    }
                }
            }
        },

        watch: {
            searchParams() {
                this.search();
            },
            data() {
                this.refresh();
                if (!this.url) {
                    this.setPage(1);
                }
            }
        },

        methods: {
            refresh() {
                this.url ? this.update(this.url) : this.internalData = this.data;
            },

            selectCol({ col, sort }) {
                this.defaultParams.selectedCol = col;
                this.defaultParams.order = sort;
                this.refresh();
            },

            search(term) {
                var initialParams = [ 'order', 'paginate', 'selectedCol', 'term' ];

                this.defaultParams.term = term;
                Object.keys(this.defaultParams).forEach(k => {
                    if (initialParams.indexOf(k) == -1) {
                        delete this.defaultParams[k];
                    }
                });

                Object.keys(this.searchParams).forEach(k => {
                    this.defaultParams[k] = this.searchParams[k];
                });

                this.refresh();
            },

            changePage(page) {
                if (this.url) {
                    this.update(page);
                } else {
                    this.setPage(page);
                }
            },

            setPage(page) {
                let last = Math.ceil(this.data.length / this.paginate);
                this.pagination = {
                    prev: Math.max(page - 1, 1),
                    next: Math.min(page + 1, last),
                    current_page: page,
                    last_page: last
                }
            },

            update(url) {
                this.tableData = [];
                this.loading = true;
                axios.get(url, { params: this.defaultParams })
                     .then(response => {
                        this.tableData = response.data.data;
                        this.pagination = {
                            prev: response.data.prev_page_url,
                            next: response.data.next_page_url,
                            current_page: response.data.current_page,
                            last_page: response.data.last_page
                        }
                        this.loading = false;
                     })
                     .catch(errors => {
                        this.loading = false;
                     });
            },

            updateSearch(term) {
                this.defaultParams.term = term;
            }
        }

    }
</script>

<style lang="scss">
    $btn-color: #fff;

    .vue-table-wrapper {
        .vue-table-header {
            margin: 10px 0px;
            position: relative;

            .vue-table-actions {
                display: inline-block;
                float: right;
                text-align: right;
                width: 74%;
                margin-left: 0.6%;
            }
        }

        .vue-table {
            width: 100%;
            border-collapse: collapse;

            .vue-table-header th {
                text-align: left;
                font-weight: bold;
                font-size: 16px;
                padding: 10px;
            }

            tbody td {
                padding: 10px;
                font-size: 13px;
            }

            tbody tr {
                background: #fff;

                &:nth-child(2n + 1) {
                    background: darken(#fff, 5%);
                }
            }
        }

        .vue-table-navigation {
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
