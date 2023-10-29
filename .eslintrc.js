// ngay lúc này ESlint nó sẽ sinh ra cho chúng ta 1 file cấu hình ESlint, chúng ta có thể thêm sửa tùy biến 1 xíu trong này
// project của chúng ta sẽ áp dụng những cấu hình ESLint như thế này trong suốt quá trình làm để đảm bảo code đúng và chuẩn nhất có thể em nhé

module.exports = {
    env: {
        browser: true,
        commonjs: true,
        es2021: true,
    },
    extends: 'standard',
    overrides: [
        {
            env: {
                node: true,
            },
            files: ['.eslintrc.{js,cjs}'],
            parserOptions: {
                sourceType: 'script',
            },
        },
    ],
    parserOptions: {
        ecmaVersion: 'latest',
    },
    rules: {
        indent: ['warn', 4],
        'space-before-function-paren': 'off',
        'comman-dangle': [2, 'always-multiline'],
        semi: 'always',
        'no-unused-vars': [
            'warn',
            {
                vars: 'all',
                args: 'after-used',
                ignoreRestSiblings: false,
                argsIgnorePattern: '^_.*?$',
            },
        ],
        'no-duplicate-imports': ['error', { includeExports: true }],
        'no-console': 'warn',
        'no-return-await': 'warn',
        'no-useless-return': 'warn',
        'no-var': 'warn',
        'no-void': 'warn',
        'prefer-const': 'warn',
        'prefer-destructuring': 'warn',
        'require-await': 'warn',
        'func-names': 'warn',
        'no-underscore-danger': 'warn',
        'consistent-return': 'warn',
    },
};
