define( 'utils/constants', [], function() {
	var constants = {};
	
	// Keycodes
	constants.KEY = {
		A: 97,
		S: 115
	};
	
	var cache_flush = new Date().getTime();
	
	constants.create_text = function(text_args) {
		var font_style = text_args.font_style || 'bold';
		var font_size = text_args.font_style || '20';
		var font_face = text_args.font_face || 'Arial';
		
		
		var line_width = text_args.line_width || 300;
		var align = text_args.align || 'left';
	
		var color = text_args.color || 'white'; 
	
		var font_string = font_style + ' ' + font_size + 'px ' + font_face;
		
		var text = new createjs.Text( text_args.content, font_string, color );
		text.lineWidth = line_width;
		text.textAlign = align;
		return text;
	};
	
	var filenames = [
	 
	 '160511_maze.gif', '160512_bottle-pattern.png',
	 
	 '160503_bongae_014.gif', '160503_bongae_bevel-light.gif',
	 
	 '160503_bongae_wireframe.gif', '160503_bongae_006.gif',
	 
	 '160510_bongae_hair.gif', '160414_bongae_001.gif'
	 
	];
	
	var test_filenames = [
	'test-lightning.jpg', 'test-lightning-2.jpg'
	];
	
	// Populate manifest for preload
	constants.manifest = [];
	for ( var i=0; i < test_filenames.length; i++ ) {
		constants.manifest.push( {
			src: 'assets/' + filenames[i] + '?' + cache_flush,
			id: 'image' + i
		} );
	}
	
	return constants;
} );

