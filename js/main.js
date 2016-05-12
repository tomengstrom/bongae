// Ripping extensively from
// https://github.com/zerojuan/pwdo-runman/blob/master/

requirejs.config({
	baseUrl : './js',
	shim : {		
		'App' : {
			deps: [
		       'jquery',
		       'easel',
		       'sound',
		       'preload',
		       'tween'
			]			
		} 	
	},
	paths: {
		// Createjs
		'easel': 	'lib/easeljs-0.8.2.min', 
		'sound': 	'lib/soundjs-0.6.2.min', 
		'preload': 	'lib/preloadjs-0.6.2.min',
		'tween': 	'lib/tweenjs-0.6.2.min',

		// jQuery
		'jquery': 		'lib/jquery-2.2.0.min',
		
//		'cssplugin': 	'lib/cssplugin',
//		'text' : 		'lib/text',
		
		// Our modules
		'App':				'App',
		
		'Debug':			'utils/Debug',
		'constants':		'utils/constants',
		
		
		'Button':			'ui/Button',
		'Crosshair':		'ui/Crosshair'
		
//		'tilemap':			'utils/tilemap',	
		
//		'parallaxLayer':	'entities/parallaxlayer',
//		'hero':				'entities/hero',
//		'platform':			'entities/platform',
//		'platformManager':	'entities/platformmanager'
		
	},
	
	urlArgs: "cachebust=" + ( new Date() ).getTime()
} );

require( ['App'], function(App) {
	App.initialize();		
} );