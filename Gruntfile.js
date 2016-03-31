/*jshint node:true, strict:false*/
module.exports = function ( grunt ) {
	grunt.loadNpmTasks( 'grunt-contrib-jshint' );
	grunt.loadNpmTasks( 'grunt-jscs' );
	grunt.loadNpmTasks( 'grunt-banana-checker' );
	grunt.loadNpmTasks( 'grunt-contrib-watch' );
	grunt.loadNpmTasks( 'grunt-notify' );
	grunt.loadNpmTasks( 'grunt-svg2png' );
	grunt.loadNpmTasks( 'grunt-jsduck' );

	grunt.initConfig( {
		files: {
			js: 'resources/**/*.js',
			jsTests: 'tests/qunit/**/*.js'
		},
		jshint: {
			options: {
				jshintrc: true
			},
			tests: '<%= files.jsTests %>',
			sources: [
				'<%= files.js %>'
			]
		},
		jscs: {
			main: [
				'<%= files.js %>'
			],
			test: {
				options: {
					config: '.jscsrctest.js',
				},
				files: {
					src: '<%= files.jsTests %>'
				}
			}
		},
		banana: {
			all: ['i18n/']
		},
		watch: {
			lint: {
				files: [ '<%= files.js %>', '<%= files.jsTests %>' ],
				tasks: [ 'lint' ]
			},
			scripts: {
				files: [ '<%= files.js %>', '<%= files.jsTests %>' ],
				tasks: [ 'test' ]
			},
			configFiles: {
				files: [ 'Gruntfile.js' ],
				options: {
					reload: true
				}
			}
		},
		jsduck: {
			main: {
				src: [ '<%= files.js %>', '!<%= files.jsExternals %>' ],
				dest: 'docs/js',
				options: {
					'builtin-classes': true,
					'external': [
						'Hogan.Template',
						// from MobileFrontend
						'Page',
						'HandleBars.Template',
						'jQuery.Deferred',
						'jQuery.Event',
						'jQuery.Object',
						'jqXHR',
						'File',
						'mw.user',
						'OO.EventEmitter'
					],
					'ignore-global': true,
					'tags': './.docs/jsduckCustomTags.rb',
					'warnings': [ '-nodoc(class,public)', '-dup_member', '-link_ambiguous' ]
				}
			}
		}
	} );

	grunt.registerTask( 'lint', [ 'jshint', 'jscs', 'banana' ] );
	grunt.registerTask( 'docs', [ 'jsduck:main' ] );

	grunt.registerTask( 'test', [ 'lint' ] );
	grunt.registerTask( 'default', [ 'test' ] );
};
