'use strict';

var path = require('path');
var glob = require('glob');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');

var env = process.env.NODE_ENV || 'development';

var js = glob.sync('./src/*.js').reduce(function (prev, curr) {
    prev[curr.slice(6, -3)] = [curr];
    return prev;
}, {});

var html = glob.sync('./src/*.html').map(function (item) {
    return new HtmlWebpackPlugin({
        data: {
            env: env
        },
        filename: item.substr(6),
        template: 'ejs-compiled!' + item,
        inject: false
    });
});

var config = {
    entry: js,
    resolve: {
        root: [
            path.resolve('./src/modules')
        ]
    },
    output: {
        path: path.resolve('./build'),
        filename: '[name].js'
    },
    module: {
        loaders: [{
            test: /\.js$/,
            loader: 'babel',
            exclude: /node_modules/
        }]
    },
    babel: {
        presets: ['es2015'],
        plugins: [
            'transform-runtime'
        ]
    },
    plugins: ([
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify(env)
        })
    ]).concat(html),
    node: {
        process: false,
        setImmediate: false
    },
    debug: false,
    bail: true
};

if (env === 'production') {
    config.plugins = config.plugins.concat([
        new webpack.optimize.OccurrenceOrderPlugin(),
        new webpack.optimize.DedupePlugin(),
        new webpack.optimize.AggressiveMergingPlugin(),
        new webpack.optimize.UglifyJsPlugin({
            sourceMap: false,
            compress: {
                pure_getters: true,
                screw_ie8: true,
                unsafe: true,
                unsafe_comps: true,
                warnings: false
            },
            output: {
                comments: false
            }
        })
    ]);
}

if (env === 'development') {
    config.debug = true;
    config.bail = false;
    config.plugins = config.plugins.concat([
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoErrorsPlugin()
    ]);
    config.devServer = {
        host: '0.0.0.0',
        port: 8081,
        contentBase: path.resolve('./build'),
        historyApiFallback: true,
        inline: true,
        hot: true,
        stats: {
            colors: true,
            modules: false,
            children: false,
            chunks: false,
            chunkModules: false
        }
    };
}

module.exports = config;
