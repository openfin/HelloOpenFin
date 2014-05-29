/* jshint node: true*/
'use strict';
module.exports = function(grunt) {
    var files = [
        'gruntfile.js',
        'public/**/*.js',
        'package.json',
        'server.js'
    ];

    grunt.initConfig({
        watch: {
            files: files,
            tasks: ['default']
        },
        jshint: {
            files: files,
            options: {
                node: false
            }
        },
        jsbeautifier: {
            files: files,
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
        }
    });
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-jsbeautifier');

    grunt.registerTask('default', ['jshint', 'jsbeautifier']);
    grunt.registerTask('test', ['jshint', 'jsbeautifier']);

};
