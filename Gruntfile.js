module.exports = function(grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
            },
            dist: {
                files: {
                    'ya-map-2.0.min.js': ['example/2.0/ya-map-2.0.js'],
                    'ya-map-2.1.min.js': ['example/2.1/ya-map-2.1.js'],
                    'ya-map-2.2.min.js': ['example/2.2/ya-map-2.2.js']
                }
            }
        }
    });


    // Load the plugin that provides the "uglify" task.
    grunt.loadNpmTasks('grunt-contrib-uglify');

    // Default task(s).
    grunt.registerTask('default', ['uglify']);
};