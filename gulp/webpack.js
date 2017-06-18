'use strict';
const Gulp = require('gulp');
const Gutil = require('gulp-util');
const Path = require('path');
const Webpack = require('webpack');


let executionCount = 0;


Gulp.task('webpack', (callback) => {

    const plugins = [
        new Webpack.optimize.CommonsChunkPlugin({
            name: 'core',
            filename: '../core.min.js',
            minSize: 2
        }),
        new Webpack.DefinePlugin({
            'process.env': {
                'NODE_ENV': `"${process.env.NODE_ENV}"`
            }
        })
    ];

    let devtool = 'source-map';

    if (process.env.NODE_ENV === 'production') {
        plugins.push(new Webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            }
        }));

        devtool = 'cheap-module-source-map';
    }

    const config = {
        watch: global.isWatching,
        entry: {
            contact: './client/pages/contact/index',
            login: './client/pages/login/index',
            signup: './client/pages/signup/index',
            profile: './client/pages/profile/index',
            adminpanel: './client/pages/adminpanel/index',
            groups: './client/pages/groups/index',
            accounts: './client/pages/accounts/index',
            posts: './client/pages/posts/index'
        },
        output: {
            path: Path.resolve(__dirname, '../public/pages'),
            filename: '[name].min.js'
        },
        resolve: {
            extensions: ['.js', '.jsx']
        },
        module: {
            rules: [{
                test: /\.jsx?$/,
                include: [
                    Path.resolve(__dirname, '../client')
                ],
                loader: 'babel-loader',
                query: {
                    presets: ['react', 'es2015']
                }
            }]
        },
        devtool,
        plugins
    };

    Webpack(config, (err, stats) => {

        if (err) {
            throw new Gutil.PluginError('webpack', err);
        }

        Gutil.log('[webpack]', stats.toString({
            colors: true,
            chunkModules: false
        }));

        if (executionCount === 0) {
            callback();
        }

        executionCount += 1;
    });
});
