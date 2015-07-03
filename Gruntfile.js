module.exports = function(grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		watch: {
			sass: {
				files: ['Includes/Penfolds/sass/**/*.{scss,sass}','Includes/Penfolds/sass/_partials/**/*.{scss,sass}'],
				tasks: ['sass:dist']
			},
			livereload: {
				files: ['*.html', '*.php', 'js/**/*.{js,json}', 'Includes/Penfolds/css/*.css','img/**/*.{png,jpg,jpeg,gif,webp,svg}'],
				options: {
					livereload: true
				},
				files:[
					'Includes/Penfolds/css/penfolds-gifting.css'
				]
			}
		},
		sass: {
			options: {
				sourceMap: true,
				//outputStyle: 'compressed'
				outputStyle: 'expanded'
			},
			dist: {
				files: {
					'Includes/Penfolds/css/penfolds-gifting.css': 'Includes/Penfolds/sass/penfolds-gifting.scss'
				}
			}
		}
	});
	grunt.registerTask('default', ['sass:dist', 'watch']);
	grunt.loadNpmTasks('grunt-sass');
	grunt.loadNpmTasks('grunt-contrib-watch');
};
