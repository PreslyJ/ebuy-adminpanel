module.exports = function(grunt) {

    grunt.initConfig({
        concat: {
            options: {
                separator: ';',
            },
            dist: {
                src : [
                    "js/app.js",
                    "js/service/route.js",
                    "js/service/resourceErrorHandler.js",
                    "js/service/resourceSuccessHandler.js",
                    "js/service/host.js",
                    "js/service/dashboardService.js",
                    "js/controller/dashboardController.js",
                    "js/controller/loginController.js",
                    "js/directive/export-table.js",
                    "js/directive/num-only.js",
                    "js/directive/spec-char-removal.js",


                ],
                dest: "js/sims.concat.js",
            },
        },
        uglify: {
            options: {
                mangle: false
            },
            my_target: {
                files: {
                    'js/sims.min.js': ['js/sims.concat.js']
                }
            }
        },
        shell: {
            multiple: {
                command: [
                    'npm update',
                    'bower update --allow-root',
                    'touch version.txt',
                    'echo $(git describe --tags `git rev-list --tags --max-count=1`)  > version.txt',
                    'cp -R css img js libraries login views index.html version.txt /usr/local/apache2/htdocs',
                ].join('&&')
            }
        }
    });
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-shell');
    grunt.registerTask('default', ['concat', 'uglify', 'shell']);

};
