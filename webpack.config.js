const path = require('path');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

// noinspection SpellCheckingInspection
module.exports = {
    mode: 'production',
    plugins: [
        new CleanWebpackPlugin(),
        new CopyWebpackPlugin([
            'LICENSE',
            'README.md',
            'package.json'
        ])
    ],
    optimization: {
        minimize: false
    },
    entry: './src/index.ts',
    devtool: 'source-map',
    output: {
        path: path.resolve(__dirname, 'dist'),
        libraryTarget: 'umd',
        filename: 'index.js'
    },
    module: {
        rules: [
            {
                test: /\.ts?$/,
                use: 'ts-loader',
                exclude: [
                    /node_modules/
                ]
            }
        ]
    },
    resolve: {
        extensions: ['.ts', '.js']
    },
};
