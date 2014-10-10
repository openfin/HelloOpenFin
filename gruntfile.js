/* jshint node: true*/
'use strict';
module.exports = function(grunt) {
    var jsFiles = [
        'gruntfile.js',
        'public/**/*.js',
        'package.json',
        'server.js',
        'app.json',
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
                    open: true,
                    base: [
                        'public'
                    ]
                }
            }

        }
    });
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-jsbeautifier');
    grunt.loadNpmTasks('grunt-contrib-connect');

    grunt.registerTask('default', ['jshint', 'jsbeautifier']);
    grunt.registerTask('test', ['jshint', 'jsbeautifier']);
    grunt.registerTask('serve', ['test', 'connect:livereload', 'watch']);

};
