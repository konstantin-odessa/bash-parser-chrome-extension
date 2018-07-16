const path = require('path');
const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const ChromeExtensionReloader  = require('webpack-chrome-extension-reloader');

module.exports = {
    mode: 'development',
    entry: {
        popup: './src/popup.ts',
        background: './src/background.ts',
        content: './src/content.ts'
    },
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, 'dist')
    },

    // watch: true,
    watchOptions: {
        ignored: [
            /node_modules/,
            /dist/
        ]
    },

    devtool: 'inline-source-map',
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: [ 'ts-loader' ],
                exclude: /node_modules/
            },
            // {
            //     test: /\.css$/,
            //     exclude: /node_modules/,
            //     use: ExtractTextPlugin.extract({
            //         fallback: "style-loader",
            //         use: "css-loader",
            //     }),
            // }
        ]
    },
    resolve: {
        extensions: [ '.tsx', '.ts', '.js', '.css' ]
    },
    plugins: [
        new webpack.ProvidePlugin({
            $: "jquery",
            jQuery: "jquery"
        }),
        new CopyWebpackPlugin([
            './src/manifest.json',
            './src/popup.html',
            './src/content.css'
        ]),
        new ChromeExtensionReloader({
            port: 9090, // Which port use to create the server
            reloadPage: true, // Force the reload of the page also
            entries: { //The entries used for the content/background scripts
                contentScript: 'content', //Use the entry names, not the file name or the path
                background: 'background',
            }
        }),
        // new ExtractTextPlugin('content.css'),
    ]
};