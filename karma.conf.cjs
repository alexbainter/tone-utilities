// Karma configuration
// Generated on Tue Jan 04 2022 23:22:34 GMT-0600 (Central Standard Time)

const nodeResolveRollupPlugin = require('@rollup/plugin-node-resolve');

module.exports = function (config) {
  config.set({
    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',

    // frameworks to use
    // available frameworks: https://www.npmjs.com/search?q=keywords:karma-adapter
    frameworks: ['mocha', 'chai'],
    plugins: [
      require('karma-rollup-preprocessor'),
      require('karma-mocha'),
      require('karma-chai'),
      require('karma-chrome-launcher'),
    ],

    // list of files / patterns to load in the browser
    files: [
      { pattern: 'src/**/*.spec.js', watched: false },
      {
        pattern: 'test-assets/**/*',
        watched: false,
        included: false,
        served: true,
        nocache: false,
      },
    ],

    // list of files / patterns to exclude
    exclude: [],

    // preprocess matching files before serving them to the browser
    // available preprocessors: https://www.npmjs.com/search?q=keywords:karma-preprocessor
    preprocessors: { 'src/**/*.spec.js': ['rollup'] },
    rollupPreprocessor: {
      output: {
        format: 'iife',
        name: 'testBundle',
        sourcemap: 'inline',
        globals: {
          'chai/interface/expect': 'expect',
        },
      },
      plugins: [nodeResolveRollupPlugin.default()],
      external: ['chai/interface/expect'],
    },

    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://www.npmjs.com/search?q=keywords:karma-reporter
    reporters: ['progress'],

    // web server port
    port: 9876,

    // enable / disable colors in the output (reporters and logs)
    colors: true,

    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,

    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: false,

    // start these browsers
    // available browser launchers: https://www.npmjs.com/search?q=keywords:karma-launcher
    browsers: ['ChromeHeadless'],

    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false,

    // Concurrency level
    // how many browser instances should be started simultaneously
    concurrency: Infinity,
  });
};
