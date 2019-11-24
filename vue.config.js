const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    configureWebpack: config => {
        config.entry = {
            app: [
                './frontend/src/main.js'
            ]
        };
        config.resolve = {
            ...config.resolve,
            alias: {
                '@': path.resolve(__dirname, './frontend/src'),
                vue$: 'vue/dist/vue.runtime.esm.js'
            },
            extensions: [
                '.wasm',
                '.mjs',
                '.js',
                '.jsx',
                '.vue',
                '.json'
            ],
            modules: [
                'node_modules',
                path.resolve(__dirname, './node_modules'),
                path.resolve(__dirname, './node_modules/@vue/cli-service/node_modules'),
            ]
        };
        config.devServer = {
            ...config.devServer,
            proxy: {
                '/': {
                    target: 'http://localhost:3000'
                }
            }
        };
        config.plugins = [
            ...config.plugins,
            new HtmlWebpackPlugin({
                filename: 'index.html',
                favicon:  path.resolve(__dirname, './frontend/favicon.png'),
                template: path.resolve(__dirname, './frontend/index.html'),
                inject: true
            })
        ]
    }
};
