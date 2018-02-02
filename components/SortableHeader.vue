<template>
    <th class="sortable-header" :class="{ selected: selected == sortBy }" @click="selectCol" :style="style">
        {{ label }}
        <template v-if="selected == sortBy">
            <i v-if="order == 'asc'" aria-hidden="true">&uarr;</i>
            <i v-if="order == 'desc'" aria-hidden="true">&darr;</i>
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
            }
        },

        data: () => ({
            order: 'asc'
        }),

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
                if (this.sortBy != this.selected) {
                    this.order = 'asc';
                } else {
                    this.order == 'asc' ? this.order = 'desc' : this.order = 'asc';
                }

                this.$emit('select-col', { col: this.sortBy, sort: this.order });
            }
        }
    }
</script>

<style lang="scss">
    .sortable-header {
        cursor: pointer;

        i {
            margin-left: 5px;
        }
    }
</style>
