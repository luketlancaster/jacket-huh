'use strict';

module.exports = function (grunt) {
  require('load-grunt-tasks')(grunt);

  grunt.initConfig({
    autoprefixer: {
      options: {
        browsers: ['> 1% in US']
      },

      build: {
        src: 'public/css/main.css'
      }
    },
    clean: {
      temp: ['.tmp'],
      dist: ['public']
    },
    copy: {
      main: {
        files: [
          {
            expand: true,
            cwd: 'app/',
            src: [
              '**',
              '!**/*.jade',
              '!**/*.{sass,scss}'
            ],
            dest: 'public/',
            filter: 'isFile'
          }
        ]
      }
    },

    connect: {
      options: {
        port: 8888,
        useAvailablePort: true,
        hostname: 'localhost'
      },

      server: {
        options: {
          livereload: true,

          middleware: function (connect) {
            return [
              connect.static('public'),
              connect().use('/scripts', connect.static('./app/scripts')),
              connect().use('/bower_components', connect.static('./bower_components'))
            ];
          }
        }
      },
    },

    jade: {
      compile: {
        options: {
          pretty: true
        },
        files: [{expand: true, cwd: 'app/', src: ['**/*.jade', '!**/_*.jade'], dest: 'public/', ext: '.html'}]
      }
    },
    sass: {
      options: {
        sourceMap: true
      },
      dist: {
        files: {
          'public/css/main.css': 'app/styles/main.scss',
          'public/css/normalize.css': 'bower_components/normalize.css/normalize.css'
        }
      }
    },

    usemin: {
      html: ['public/**/*.html']
    },

    useminPrepare: {
      html: ['public/index.html'],

      options: {
        dest: 'public',
        root: 'app'
      }
    },

    watch: {
      bower: {
        files: ['bower.json'],
        tasks: ['wiredep']
      },

      livereload: {
        options: {
          livereload: true
        },

        files: [
          'public/**/*.html',
          'public/css/**/*.css',
          'public/js/**/*.js',
          'public/scripts/**/*.js'
        ]
      },

      other: {
        files: ['app/**', '!app/**/*.jade', '!app/**/*.{sass,scss}'],
        tasks: ['copy']
      },
      jade: {
        files: ['app/**/*.jade'],
        tasks: ['jade']
      },
      sass: {
        files: ['app/**/*.{sass,scss}'],
        tasks: ['sass', 'autoprefixer']
      }
    },

    concat: {
      mine: {
        dist: {
          src: ['app/js/main.js'],
          dest: 'public/js/main.min.js'
        },
      },
    },

    wiredep: {
      build: {
        src: ['public/**/*.html']
      }
    }
  });

  grunt.registerTask('default', []);
  grunt.registerTask('build', ['setup', 'combineJs']);
  grunt.registerTask('serve', ['setup', 'combineJs', 'connect', 'watch']);
  grunt.registerTask('setup', [
    'clean',
    'copy',
    'jade',
    'sass',
    'autoprefixer',
    'wiredep'
  ]);
  grunt.registerTask('combineJs', [
    'useminPrepare',
    'concat:generated',
    'concat:mine',
    'uglify:generated',
    'usemin',
    'clean:temp'
  ]);
};
