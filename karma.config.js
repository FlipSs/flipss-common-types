// Karma configuration file, see link for more information
// https://karma-runner.github.io/1.0/config/configuration-file.html

module.exports = function (config) {
    // noinspection SpellCheckingInspection
    config.set({
        basePath: 'tests',
        frameworks: ['jasmine'],
        files: [
            {pattern: '**/*.spec.ts'}
        ],
        plugins: [
            require('karma-webpack'),
            require('karma-jasmine'),
            require('karma-chrome-launcher'),
            require('karma-jasmine-html-reporter')
        ],
        preprocessors: {
            '**/*.spec.ts': ['webpack']
        },
        client: {
            jasmine: {
                stopSpecOnExpectationFailure: false,
                random: false
            },
            clearContext: false
        },
        webpack: {
            devtool: 'inline-source-map',
            mode: 'none',
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
            }
        },
        reporters: ['progress', 'kjhtml'],
        port: 9876,
        colors: true,
        logLevel: config.LOG_INFO,
        autoWatch: true,
        browsers: ['Chrome'],
        singleRun: true,
        restartOnFileChange: true
    });
};
