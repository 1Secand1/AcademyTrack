import pluginVue from 'eslint-plugin-vue'
import globals from 'globals'

export default [
  ...pluginVue.configs['flat/essential'],
  ...pluginVue.configs['flat/strongly-recommended'],
  ...pluginVue.configs['flat/recommended'],
  {
    languageOptions: {
      globals: globals.browser,
    },
    rules: {
      // Запрещает неиспользуемые переменные в компонентах Vue
      'vue/no-unused-vars': 'error',

      // Требует, чтобы имена компонентов состояли из нескольких слов
      'vue/multi-word-component-names': 'error',

      // Требует, чтобы у всех входных параметров (props) были указаны типы
      'vue/require-prop-types': 'error',

      // Требует, чтобы у всех входных параметров (props) было описание
      'vue/require-prop-types': 'error',

      // Требует использование атрибута :key при работе с v-for
      'vue/require-v-for-key': 'error',

      // Запрещает использовать v-if вместе с v-for
      'vue/no-use-v-if-with-v-for': 'error',

      // Требует, чтобы компоненты без контента внутри были самозакрывающимися
      'vue/html-self-closing': ['error', {
        'html': {
          'void': 'always',
          'normal': 'always',
          'component': 'always',
        },
        'svg': 'always',
        'math': 'always',
      }],

      // Требует, чтобы имена компонентов внутри шаблона были написаны в PascalCase
      'vue/component-name-in-template-casing': ['error', 'PascalCase'],

      // Требует, чтобы имена компонентов в JavaScript/JSX были написаны в PascalCase
      'vue/component-definition-name-casing': ['error', 'PascalCase'],

      // Требует, чтобы входные параметры (props) объявлялись всегда в camelCase
      'vue/prop-name-casing': ['error', 'camelCase'],

      // Требует, чтобы элементы с множеством атрибутов придерживались правила: один атрибут на строку
      'vue/max-attributes-per-line': ['error', {
        'singleline': 1,
        'multiline': 1,
      }],

      // Требует, чтобы шаблоны компонента включали в себя только простые выражения
      'vue/valid-template-root': 'error',

      // Требует, чтобы непустые значения HTML-атрибутов всегда были внутри кавычек
      'vue/html-quotes': ['error', 'double'],

      // Требует использовать сокращения директив Vue
      'vue/v-on-style': ['error', 'shorthand'],

      // Требует, чтобы атрибуты элемента (включая компоненты) сохраняли консистентность в порядке
      'vue/attributes-order': ['error', {
        'order': [
          'DEFINITION',
          'LIST_RENDERING',
          'CONDITIONALS',
          'RENDER_MODIFIERS',
          'GLOBAL',
          ['UNIQUE', 'SLOT'],
          'TWO_WAY_BINDING',
          'OTHER_DIRECTIVES',
          'OTHER_ATTR',
          'EVENTS',
          'CONTENT',
        ],
        'alphabetical': false,
      }],

      // Требует добавлять одну пустую строку между многострочными свойствами
      'vue/padding-line-between-blocks': ['error', 'always'],

      // Требует чтобы порядок элементов в компоненте был template, script-setup,style-scoped

      'vue/block-order': ['error', {
        'order': [['template', 'script[setup]'], 'style[scoped]'],
      }],

      // Это правило обеспечивает единый стиль отступов в <script>.
      'vue/script-indent': [
        'error',
        2,
        {
          baseIndent: 1,
          switchCase: 1,
          ignores: [],
        },
      ],

      // Использование одинарных кавычек
      'quotes': ['error', 'single'],

      // Всегда использовать точку с запятой
      'semi': ['error', 'always'],

      // Запрещать неиспользуемые переменные
      'no-unused-vars': ['error', { vars: 'all', args: 'after-used', ignoreRestSiblings: false }],

      // Запрещать использование var, использовать let или const
      'no-var': 'error',

      // Предпочитать const если переменная не переопределяется
      'prefer-const': 'error',

      // Требовать пробелы до и после стрелочной функции
      'arrow-spacing': ['error', { before: true, after: true }],

      // Ограничение количества пустых строк
      'no-multiple-empty-lines': ['error', { max: 1, maxEOF: 0 }],

      // Запрещать пробелы в конце строки
      'no-trailing-spaces': 'error',

      // Требовать пробел перед блоками
      'space-before-blocks': ['error', 'always'],

      // Требовать пробелы до и после ключевых слов
      'keyword-spacing': ['error', { before: true, after: true }],

      // Требовать пробелы вокруг инфиксных операторов
      'space-infix-ops': 'error',

      // Запрещать пробелы внутри круглых скобок
      'space-in-parens': ['error', 'never'],

      // Запрещать пробелы внутри квадратных скобок массива
      'array-bracket-spacing': ['error', 'never'],

      // Требовать пробелы внутри фигурных скобок
      'object-curly-spacing': ['error', 'always'],

      // Требовать запятую после последнего элемента в многострочных структурах
      'comma-dangle': ['error', 'always-multiline'],

      // Запрещать использование async функции в исполнителе промиса
      'no-async-promise-executor': 'error',

      // Запрещать async функции без await
      'require-await': 'error',

      // Запрещать return await
      'no-return-await': 'error',
    },
  },
  {
    files: ['*.vue'],
    rules: {
      'indent': 'off',
    },
  },
]