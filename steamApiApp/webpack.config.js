const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MODE = process.env.NODE_ENV;
const enabledSourceMap = MODE === "development";
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

// debug時の画像読み込み
const urlLoader = {
    test: /\.(png|jpe?g|gif)$/,
    loader: 'url-loader',
    options: {
    esModule: false
    }
}

  // build時の画像パス書き換え
const fileLoader = {
    test: /\.(jpg|png|gif)$/,
    use: [
    {
        loader: 'file-loader',
        options: {
        name: '[name].[ext]',
        outputPath: function(path, resource, context) {
            return `img/${path}`
        },
        publicPath: function(path, resource, context) {
            return `../img/${path}`
        },
        esModule: false
        }
    }
    ]
}

const imgLoader = enabledSourceMap ? urlLoader : fileLoader

module.exports = {
    mode: MODE,
    entry: './src/js/index.js',

    output: {
        path: path.join(__dirname, 'dist'),
        filename: 'js/[name].js',
        },

    module: {
        rules: [
            {
                test:/\.(sa|sc|c)ss$/,
                use: [
                    enabledSourceMap ? "style-loader" : MiniCssExtractPlugin.loader,
                    {
                        loader: "css-loader",
                        options: {
                            url: true,
                            sourceMap: enabledSourceMap,
                            importLoaders: 2
                        }
                    },
                    {
                        loader: 'postcss-loader',
                        options: {
                            sourceMap: true,
                            plugins: [
                                require('autoprefixer')({
                                    grid: true
                                })
                            ]
                        }
                    },
                    {
                        loader: "sass-loader",
                        options: {
                            sourceMap: enabledSourceMap
                        }
                    }
                ]
            },
            {
                test: /\.js$/,
                use: [
                    {
                        loader: 'babel-loader',
                        options: {
                            presets: ['@babel/preset-env'],
                        }
                    }
                ]
            },
            {
                test: /\.html$/,
                loader: 'html-loader'
            },
            imgLoader
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/html/index.html',
            filename: './html/index.html'
        }),
        new MiniCssExtractPlugin({
            filename: `css/[name].css`
        }),
    ],

    devServer: {
        contentBase: path.join(__dirname, 'dist'),
        publicPath: '/',
        watchContentBase: true,
        port: 3000,
        inline: true,
        hot: true,
    },

    resolve: {
        modules: ['node_modules'],
        extensions: ['.js'],
    },
};