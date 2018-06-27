<template>
    <div class="vue-table__searchbar" :class="{ expanded: expanded }" :style="theme">
        <div class="input-icon" :class="iconSide">
            <i v-if="iconClasses && iconSide" :class="iconClasses" aria-hidden="true"></i>
            <input v-model="currentSearch"
                   type="text"
                   placeholder="Search..."
                   @keyup.enter="searchEnter"
                   @focus="expand(true)"
                   @blur="expand(false)" />
        </div>
    </div>
</template>

<script>
    import defaults from '../options';

    export default {
        name: 'searchbar',

        props: {
            /* Determines if the search bar expands when selected */
            expandible: {
                type: Boolean,
                default: () => defaults.expandible
            },

            /* Classes to generate icon for search bar */
            iconClasses: {
                type: String,
                default: () => defaults.iconClasses
            },

            /* The side to show the search icon on */
            iconSide: {
                type: String,
                default: () => defaults.iconSide
            },

            /* The variable that determines if the search is loading */
            loading: {
                type: Boolean,
                default: false
            },

            /* The function to run on search */
            onSearch: {
                type: Function,
                required: true
            },

            /* How frequently the search runs */
            searchWhen: {
                type: String,
                default: () => defaults.searchWhen,
                validator(value) {
                    var types = [
                        'onDelay',
                        'onEnter'
                    ];
                    if (types.indexOf(value) > -1) {
                        return true;
                    } else {
                        return false;
                    }
                }
            },

            /* Custom styling for searchbar */
            theme: {
                type: String,
                default: null
            },

            /* The delay on search when searchWhen set to onDelay */
            timeoutDelay: {
                type: Number,
                default: () => defaults.timeoutDelay
            }
        },

        data() {
            return {
                currentSearch:  null,
                expanded:       false,
                timeout:        null
            }
        },

        watch: {
            currentSearch() {
                this.delayedSearch();
            }
        },

        methods: {
            delayedSearch() {
                if (this.searchWhen != 'onDelay') { return; }

                if (this.timeout) {
                    clearTimeout(this.timeout);
                }
                this.timeout = setTimeout(() => {
                    this.search();
                }, this.timeoutDelay);
            },

            expand(truthy) {
                if (this.expandible) {
                    this.expanded = truthy;
                }
            },

            searchEnter() {
                if (this.searchWhen != 'onEnter') { return; }
                this.search();
            },

            search() {
                this.onSearch(this.currentSearch);
            }
        }
    }
</script>

<style lang="scss">
$searchbar-font-color: #626262;
$searchbar-bg-color: #dfdede;
$base-width: 50%;
$expanded-width: 100%;
$border-radius: 0px;

.vue-table__searchbar {

    flex: 25%;
    /* Transition */
    -webkit-transition: width 0.5s ease-out;
       -moz-transition: width 0.5s ease-out;
         -o-transition: width 0.5s ease-out;
            transition: width 0.5s ease-out;
    max-width: 25%;

    &.expanded .input-icon {
        width: $expanded-width;
    }

    .input-icon {
        position: relative;
        width: $base-width;

        /* Transition */
        -webkit-transition: width 0.5s ease-out;
           -moz-transition: width 0.5s ease-out;
             -o-transition: width 0.5s ease-out;
                transition: width 0.5s ease-out;

        & > i {
            -webkit-transform: translate(0, -50%);
               -moz-transform: translate(0, -50%);
                -ms-transform: translate(0, -50%);
                 -o-transform: translate(0, -50%);
                    transform: translate(0, -50%);

            color: $searchbar-font-color;
            position: absolute;
            display: block;
            top: 50%;
            pointer-events: none;
            width: 25px;
            text-align: center;
            font-style: normal;
        }

        & > input {

            /* Border Radius */
            -webkit-border-radius: $border-radius;
               -moz-border-radius: $border-radius;
                -ms-border-radius: $border-radius;
                 -o-border-radius: $border-radius;
                    border-radius: $border-radius;

            /* Box Shadow */
            -webkit-box-shadow: none;
               -moz-box-shadow: none;
                    box-shadow: none;

            background-color: $searchbar-bg-color;
            display: block;
            height: 36px;
            width: 100%;
            padding: 6px 12px;
            font-size: 14px;
            line-height: 1.6;
            color: $searchbar-font-color;
            border: none;
            resize: none;
            margin: 0px;

            &:focus {
                /* Box Shadow */
                -webkit-box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075);
                   -moz-box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075);
                        box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075);

                background-color: darken($searchbar-bg-color, 5%);
                background-image: none;
                outline: none;
                width: $expanded-width;
            }

            &:hover {
                background-color: darken($searchbar-bg-color, 5%);
            }

            &::placeholder {
                color: $searchbar-font-color;
            }
        }

        &.left > input {
            padding: 6px 12px 6px 37px;
        }

        &.right {
            & > i {
                -webkit-transform: translate(0, -50%);
                   -moz-transform: translate(0, -50%);
                    -ms-transform: translate(0, -50%);
                     -o-transform: translate(0, -50%);
                        transform: translate(0, -50%);

                position: absolute;
                display: block;
                top: 50%;
                right: 10px;
                pointer-events: none;
                width: 25px;
                text-align: center;
                font-style: normal;

                &.clickable {
                    pointer-events: all;
                    cursor: pointer;
                }
            }

            & > input {
                padding-left: 12px;
                padding-right: 37px;
            }
        }

        .loader {
            top: 30%;
        }
    }
}

</style>
