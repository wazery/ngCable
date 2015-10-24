module.exports = function (grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> - v<%= pkg.version %> (<%= pkg.homepage %>) */\n'
            },
            ngCable: {
                files: {
                    './src/ngCable.min.js': ['./src/ngCable.js'],
                    './src/action-cable.min.js': ['./src/action-cable.js']
                }
            }
        },
        jshint: {
            options: {
                ignores: ['./src/ngCable.min.js']
            },
            files: ['*.js']
        }
    });

    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-uglify');

    grunt.registerTask('default', ['jshint']);
    grunt.registerTask('build', ['uglify']);
};
