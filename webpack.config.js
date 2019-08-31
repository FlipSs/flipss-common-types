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
    entry: {
        caching: './src/caching/index.ts',
        collections: './src/collections/index.ts',
        common: './src/common/index.ts',
        converters: './src/converters/index.ts',
        data: './src/data/index.ts',
        logs: './src/logs/index.ts',
        settings: './src/settings/index.ts',
        storages: './src/storages/index.ts',
        time: './src/time/index.ts',
        types: './src/types/index.ts',
        utils: './src/utils/index.ts'
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name]/index.js'
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
        extensions: ['.ts']
    },
};
