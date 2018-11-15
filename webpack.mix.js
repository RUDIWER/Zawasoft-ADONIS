let mix = require('laravel-mix');

mix.setPublicPath('public');

/*
 |--------------------------------------------------------------------------
 | Mix Asset Management
 |--------------------------------------------------------------------------
 |
 | Mix provides a clean, fluent API for defining some Webpack build steps
 | for your Adonis application. By default, we are compiling the Sass
 | file for the application as well as bundling up all the JS files.
 |
 */

mix
	.js('resources/assets/js/app.js', 'public/js')
	.sass('resources/assets/sass/app-admin.scss', 'public/admin-panel/css/app-admin.css')
	.sass('resources/assets/sass/app.scss', 'public/css/app.css')
	.copyDirectory('resources/assets/images', 'public/images');
