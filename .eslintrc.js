const isDev = process.env.NODE_ENV === 'development'

const errorLevel = isDev ? "warn" : "error";

module.exports = {
    "root": true,
    "env": { "node": true },
    "extends": [
        "plugin:vue/recommended",
        "eslint:recommended",
        "prettier",
        "prettier/vue"
    ],
    "rules": {
        "no-debugger": errorLevel,
        "no-multiple-empty-lines": [
            errorLevel,
            { "max": 1, "maxEOF": 1 }
        ],
        "indent": [
            "error",
            4,
            { "SwitchCase": 1, "MemberExpression": 1 }
        ],
        "quotes": [
            "error",
            "single"
        ],
        "semi": [
            "error",
            "always"
        ],
        "no-unused-vars": [
            errorLevel,
            { "argsIgnorePattern": "_" }
        ],
        "no-console": [
            errorLevel,
            { "allow": ["error", "warn"] }
        ],
        "eol-last": [
            "error",
            "always"
        ],
        "vue/component-name-in-template-casing": [
            "error",
            "PascalCase"
        ],
        "vue/html-quotes": [
            "error",
            "double"
        ],
        "vue/html-closing-bracket-newline": [
            "error",
            { "singleline": "never", "multiline": "never" }
        ],
        "vue/html-self-closing": [
            "error",
            {
                "html": {
                    "void": "never",
                    "normal": "always",
                    "component": "always"
                },
                "svg": "always",
                "math": "always"
            }
        ],
        "vue/html-closing-bracket-spacing": [
            "error",
            {
                "startTag": "never",
                "endTag": "never",
                "selfClosingTag": "always"
            }
        ],
        "vue/no-unused-components": [errorLevel, {
            "ignoreWhenBindingPresent": true
        }],
        "vue/html-indent": [
            "error",
            4,
            {
                "attribute": 1,
                "baseIndent": 0,
                "closeBracket": 0,
                "alignAttributesVertically": false,
                "ignores": []
            }
        ],
        "vue/order-in-components": [
            "error",
            {
                "order": [
                    "el",
                    "name",
                    "parent",
                    "functional",
                    "delimiters",
                    "comments",
                    "directives",
                    "filters",
                    "components",
                    "extends",
                    "mixins",
                    "inheritAttrs",
                    "model",
                    ["props", "propsData"],
                    "computed",
                    "data",
                    "LIFECYCLE_HOOKS",
                    "methods",
                    "watch",
                    ["template", "render"],
                    "renderError"
                ]
            }
        ],
        "vue/mustache-interpolation-spacing": [
            "error",
            "always"
        ]
    },
    "parserOptions": {
        "parser": "babel-eslint"
    }
}
