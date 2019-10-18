<template>
<th :class="[{ selected: selected == sortBy }, cssClass]" :style="style" class="sortable-header" @click="selectCol">
    {{ label }}
    <template v-if="selected == sortBy">
        <span v-if="order == 'asc'">&uarr;</span>
        <span v-if="order == 'desc'">&darr;</span>
    </template>
</th>
</template>

<script>
export default {
    name: 'SortableHeader',

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
        },

        cssClass: {
            type: String,
            default: null
        }
    },
    computed: {
        style() {
            return {
                width: this.width ? this.width + 'px' : '100px'
            };
        }
    },
    mounted() {
        this.orderData = this.order ? this.order : 'asc';
    },

    methods: {
        selectCol() {
            if (this.disabled || this.loading) { return; }
            let sort = '';

            if (this.sortBy != this.selected) {
                sort = 'asc';
            } else {
                sort = this.order == 'asc' ? 'desc' : 'asc';
            }

            this.$emit('select-col', { col: this.sortBy, sort });
        }
    }
};
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
