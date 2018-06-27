<template>
    <th class="sortable-header" :class="{ selected: selected == sortBy }" @click="selectCol" :style="style">
        {{ label }}
        <template v-if="selected == sortBy">
            <span v-if="order == 'asc'">&uarr;</span>
            <span v-if="order == 'desc'">&darr;</span>
        </template>
    </th>
</template>

<script>
    export default {
        name: 'sortable-header',

        props: {
            disabled: {
                type:       Boolean,
                default:    false
            },

            label: {
                type:       String,
                required:   true
            },

            loading: {
                type: Boolean,
            },

            sortBy: {
                type:       String,
                required:   true
            },

            selected: {
                type:       String,
                default:    null
            },

            width: {
                type:       String,
                default:    null
            },

            order: {
                type: String,
                default: 'asc'
            }
        },
        mounted() {
            this.orderData = this.order ? this.order : 'asc';
        },
        computed: {
             style() {
                 return {
                     width: this.width ? this.width + 'px' : '100px'
                 }
             }
        },

        methods: {
            selectCol() {
                if (this.disabled || this.loading) { return; }
                let sort = ''

                if (this.sortBy != this.selected) {
                    sort = 'asc';
                } else {
                    sort = this.order == 'asc' ? 'desc' : 'asc';
                }

                this.$emit('select-col', { col: this.sortBy, sort });
            }
        }
    }
</script>

<style lang="scss">
    .vue-table__header {
        .sortable-header {
            cursor: pointer;
            text-align: left;
            font-weight: bold;
            font-size: 16px;
            padding: 10px;

            i {
                margin-left: 5px;
            }
        }
    }
</style>
