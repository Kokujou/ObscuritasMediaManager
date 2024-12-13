const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    mode: 'development',
    entry: './all-entries.ts',
    module: {
        rules: [
            {
                test: /all-entries\.ts$/,
                use: [
                    {
                        loader: 'ts-loader',
                        options: {
                            transpileOnly: true,
                        },
                    },
                    {
                        loader: require.resolve('./entry-loader.js'),
                    },
                ],
            },
            {
                test: /\.ts$/,
                use: [
                    {
                        loader: 'ts-loader',
                        options: {},
                    },
                ],
                exclude: [/node_modules/, /dist/, /all-entries.ts/],
            },
        ],
    },
    resolve: {
        extensions: ['.ts', '.js'],
        alias: {
            'lit-element/decorators': path.resolve(__dirname, './node_modules/lit-element/decorators.js'),
        },
    },
    output: {
        clean: true,
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist'),
    },
    // plugins: [new LitAnalyzerPlugin()],
    plugins: [
        new HtmlWebpackPlugin({
            template: './index.html',
            filename: 'index.html',
        }),
    ],
    devtool: 'source-map', // Fügt Source Maps hinzu
};
