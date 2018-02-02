<template>
    <div class="vue-table-wrapper">
        <table class="vue-table">
            <thead>
                <tr class="vue-table-header">
                    <sh v-for="header in headers"
                        :key="header.label"
                        v-bind="header"
                        @select-col="selectCol"
                        :selected="searchParams.selectedCol"
                        :loading="loading" />
                </tr>
            </thead>
            <tbody class="vue-table-body">
                <slot name="row"
                      v-for="(row, idx) in tableData"
                      :id="'row-' + idx"
                      :row="row" />
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
            <button :disabled="!pagination.prev" class="pagination" @click="update(pagination.prev)">
                &larr;
            </button>
            <div class="current-page" v-if="internalData.length > 0">
                Page {{ pagination.current_page }} of {{ pagination.last_page }}
            </div>
            <button :disabled="!pagination.next" class="pagination"  @click="update(pagination.next)">
                &rarr;
            </button>
        </div>
    </div>
</template>

<script>
    import sh from './SortableHeader';

    export default {
        name: 'vue-table',

        components: {
            sh
        },

        props: {
            data: {
                type:       Array,
                default:    () => []
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

            searchParams: {
                order:          'asc',
                paginate:       10,
                selectedCol:    null
            }
        }),

        mounted() {
            this.searchParams.selectedCol = this.selectedCol ? this.selectedCol : null;
            this.searchParams.paginate = this.paginate;

            this.url ? this.update(this.url) : this.internalData = this.data;
        },

        computed: {
            tableData: {
                get() {
                    if (!this.vuexGet) {
                        return this.internalData;
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

        methods: {
            selectCol({ col, sort }) {
                this.searchParams.selectedCol = col;
                this.searchParams.order = sort;
                this.update(this.url);
            },

            update(url) {
                this.tableData = [];
                this.loading = true;
                axios.get(url, { params: this.searchParams })
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
            }
        }

    }
</script>

<style lang="scss">
    $btn-color: #fff;

    .vue-table-wrapper {
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
