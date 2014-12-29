/* jshint node: true*/
'use strict';
module.exports = function(grunt) {
    var target = grunt.option('target') || 'http://localhost:5000',
        jsFiles = [
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
                open: true,
                configPath: target + '/app.json',
                config: {
                    create: true,
                    filePath: 'public/app.json',
                    options: {
                        startup_app: {
                            name: 'Hello OpenFin',
                            url: target + '/index.html',
                            applicationIcon: target + '/img/openfin.ico',
                        },
                        shortcut: {
                            icon: target + '/img/openfin.ico'
                        }
                    }
                }
            },
            serve: {
                options: {
                    open: true
                }
            },
            build: {
                options: {
                    open: false
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-jsbeautifier');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-openfin');

    grunt.registerTask('default', ['jshint', 'jsbeautifier']);
    grunt.registerTask('test', ['jshint', 'jsbeautifier']);
    grunt.registerTask('serve', ['test', 'connect:livereload', 'openfin:serve', 'watch']);
    grunt.registerTask('build', ['test', 'openfin:build']);

};
