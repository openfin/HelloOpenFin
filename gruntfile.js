/* jshint node: true*/
'use strict';
module.exports = function(grunt) {
    var jsFiles = [
        'gruntfile.js',
        'public/**/*.js',
        'package.json',
        'server.js',
        'app.json',
        'src/*.js',
        '!public/bower_components/**/*.*'
    ];

    grunt.initConfig({
        watch: {
            js: {
                files: jsFiles,
                tasks: ['default'],
                options: {
                    livereload: true
                }
            },
            html: {
                files: [
                    'public/**/*.css',
                    'public/**/*.html'
                ],
                options: {
                    livereload: true
                }
            },
            livereload: {
                options: {
                    open: true,
                    base: [
                        'public'
                    ]
                },
                files: [
                    'public/**/*.css',
                    'public/*.html'
                ]
            }
        },
        jshint: {
            jsFiles: jsFiles,
            options: {
                node: false
            }
        },
        jsbeautifier: {
            jsFiles: jsFiles,
            options: {
                js: {
                    braceStyle: "collapse",
                    breakChainedMethods: false,
                    e4x: false,
                    evalCode: false,
                    indentChar: " ",
                    indentLevel: 0,
                    indentSize: 4,
                    indentWithTabs: false,
                    jslintHappy: false,
                    keepArrayIndentation: false,
                    keepFunctionIndentation: false,
                    maxPreserveNewlines: 10,
                    preserveNewlines: true,
                    spaceBeforeConditional: true,
                    spaceInParen: false,
                    unescapeStrings: false,
                    wrapLineLength: 0
                }
            }
        },
        connect: {
            options: {
                port: 5000,
                // Change this to '0.0.0.0' to access the server from outside.
                hostname: '0.0.0.0',
                livereload: 35729
            },
            livereload: {
                options: {
                    open: false,
                    base: [
                        'public'
                    ]
                }
            }
        },
        openfin: {
            options: {
                configPath: 'http://localhost:5000/app.json'
            }
        }
    });

    //modifies the app.config to point to a specific server
    grunt.registerTask('config-builder', 'open fin launcher', function() {
        var configBuilder = require('./src/configBuilder'),
            target = grunt.option('target'),
            //this task is asynchronous.
            done = this.async();

        if (target) {
            //request the config to be updated with a given target and pass the grunt done function.
            configBuilder.build(target, done);
        } else {
            console.log('no target specific, app.json running defaults');
            done();
        }
    });

    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-jsbeautifier');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-openfin');

    grunt.registerTask('default', ['jshint', 'jsbeautifier']);
    grunt.registerTask('test', ['jshint', 'jsbeautifier']);
    grunt.registerTask('serve', ['test', 'config-builder', 'connect:livereload', 'openfin', 'watch']);
    grunt.registerTask('build', ['test', 'config-builder']);

};
