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
                        options: {
                            transpileOnly: true,
                        },
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
    devtool: 'source-map', // Fügt Source Maps hinzu
};
