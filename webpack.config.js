const path = require('path');
const { DefinePlugin, ProvidePlugin } = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

// Export webpack config
module.exports = {
    mode: 'development',
    entry: {
        polyfill: '@babel/polyfill',
        app: [
            path.resolve(__dirname, 'src/index.scss'),
            path.resolve(__dirname, 'src/index.js'),
        ],
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'static/[name].bundle.js',
        publicPath: '/',
    },
    module: {
        rules: [
            {
                test: /\.m?jsx?$/,
                include: path.resolve(__dirname, 'src'),
                use: [
                    'babel-loader',
                ],
            },
            {
                test: /\.(sa|sc|c)ss$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    {
                        loader: 'css-loader',
                        options: {
                            importLoaders: 1,
                            sourceMap: true,
                        },
                    },
                    {
                        loader: 'postcss-loader',
                        options: {
                            plugins: () => [
                                require('autoprefixer'),
                                require('cssnano'),
                            ],
                            sourceMap: true,
                        },
                    },
                    {
                        loader: 'sass-loader',
                        options: {
                            sourceMap: true,
                        },
                    },
                ],
            },
            {
                exclude: [/\.m?jsx?$/, /\.(sa|sc|c)ss$/, /\.json$/, /\.html$/],
                loader: 'file-loader',
                options: {
                    name: 'static/media/[name].[ext]',
                },
            },
        ],
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, 'src/index.html'),
            inject: true,
        }),
        new ProvidePlugin({
            $: 'jquery',
            Popper: ['popper.js', 'default']
        }),
        new MiniCssExtractPlugin({
            filename: 'static/[name].bundle.css',
        }),
    ],
    stats: 'minimal',
    devServer: {
        host: '127.0.0.1',
        port: 4200,
        contentBase: path.resolve(__dirname, 'dist'),
        historyApiFallback: true,
        clientLogLevel: 'none',
        compress: true,
        overlay: true,
        stats: {
            all: false,
            builtAt: true,
            warnings: true,
            errors: true,
            errorDetails: true,
            performance: true,
            colors: true,
        },
    },
};
