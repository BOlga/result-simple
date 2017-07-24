'use strict';

const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const ENVIRONMENTS = require('../back/constants/envConstants');
const isProdEnv = ENVIRONMENTS.CURRENT === ENVIRONMENTS.PRODUCTION;

module.exports = {
    entry: {
        front: [path.resolve(__dirname, '..', 'front/pagebase')]
    },
    output: {
        path: path.resolve(__dirname, '..', '..', 'public'),
        filename: 'js/bundle.js'
    },
    watch: isProdEnv,
    watchOptions: {
        aggregateTimeout: 100
    },
    devtool: (isProdEnv ? 'source-map' : false),
    plugins: [
        new webpack.DefinePlugin({
            NODE_ENV: JSON.stringify(ENVIRONMENTS.CURRENT)
        }),
        new ExtractTextPlugin({
            filename: (getPath) => {
                return getPath('css/bundle.css').replace('css/js', 'css');
            },
            allChunks: true
        })],
    module: {
        loaders: [{
            test: /\.js$/,
            include: [
                path.resolve(__dirname, '..', 'back'),
                path.resolve(__dirname, '..', 'front')
            ],
            loader: 'babel-loader',
            query: {
                presets: ['env']
            },
            exclude: /\/node_modules\//
        },
        {
            test: /\.css$/,
            use: ExtractTextPlugin.extract({
                fallback: 'style-loader',
                use: [
                    {
                        loader: 'css-loader',
                        options: {
                            importLoaders: 1
                        }
                    }
                ]
            })
        }],
        noParse: /\/node_modules\/[^!]+/
    },
    node: {
        fs: 'empty',
        net: 'empty',
        tls: 'empty'
    }
};

if (isProdEnv) {
    module.exports.plugins.push(
        new webpack.optimize.UglifyJsPlugin({
            warning: false,
            drop_console: true,
            unsave: true
        })
    );
}
