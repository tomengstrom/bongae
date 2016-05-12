define( 'App', [

	'jquery',	
	'Debug',
	'utils/constants',
	
	'tween',
	'easel',
	'sound',
	'preload'
	
], function(
		
	$,
	Debug,
	constants
	
) {
	var App;
	
	Debug.enable_scope('app');

	App = {
			
		__canvas: 	null,
		__stage: 	null,
		__assets: 	null,
		
		__children: null,
		
		__stroke_width: 0.5,
		
		__stroke_color: 'white',
		__fill_color: 'black',
		
		__get_rectangle_count: function() {
			return 200;
		},

		__get_visible_rectangle_index: function() {
			var self = this;
			var d_h = $(document).height() - $(window).height();
			if ( d_h == 0 ) {
				d_h = 1;
			}
			
			index = $(window).scrollTop() / d_h * self.__get_rectangle_count();
			if ( index < 4 ) {
				return 4;
			}
			Debug.log( 'app', '__get_visible_rectangle_index', {
				height: $(document).height(),
				window_height: $(window).height(),
				scrolltop: $(window).scrollTop(),
				rect_count: self.__get_rectangle_count(),
				index: index
			});
			return index;
		},
			
		__get_canvas_center: function() {
			return {
				x: this.__stage.canvas.width / 2,
				y: this.__stage.canvas.height / 2
			};
		},
		
		__get_canvas_size: function() {
			return {
				width: this.__stage.canvas.width,
				height: this.__stage.canvas.height
			}
		},
		
		__draw_grid_rectangles: function() {
			var self = this;
			
			var stroke_color = self.__stroke_color;
			var fill_color = self.__fill_color;
			
			var visible_index = self.__get_visible_rectangle_index();
			var rect_count = self.__get_rectangle_count();
			var rect_size_ratio = Math.sqrt(1.05);
			
			var rect_points = [];
			for ( i = 0; i < rect_count; i++ ) {
				if ( i == 0 ) {
					rect_points[i] = {
						x1: 0,
						x2: self.__stage.canvas.width,
						y1: 0,
						y2: self.__stage.canvas.height,
						w: self.__stage.canvas.width,
						h: self.__stage.canvas.height
					};
				}
				else {
					var prev = rect_points[i-1];
					var prev_w = prev.w;
					var prev_h = prev.h;
					
					var new_w = prev_w / rect_size_ratio;
					var new_h = prev_h / rect_size_ratio;
					
					var d_w = prev_w - new_w;
					var d_h = prev_h - new_h;
					
					rect_points[i] =  {
						x1: prev.x1 + d_w / 2,
						x2: prev.x2 - d_w / 2,
						y1: prev.y1 + d_h / 2,
						y2: prev.y2 - d_w / 2,
						w: new_w,
						h: new_h,
						c_x: prev.x1 + d_w / 2 + (new_w / 2),
						c_y: prev.y1 + d_w / 2 + (new_h / 2)
					};
				}
			}
			
			// Lazy init rectangle array
			if (!self.__rectangles) {
				self.__rectangles = [];
			}
			else {
				// Clear rectangles
				for ( var i = 0 ; i < self.__rectangles.length; i++) {
					self.__grid_container.removeChild(self.__rectangles[i]);
				}
				self.__rectangles = [];
			}
			
			for ( var i = 0; i < rect_points.length; i++ ) {
//				Debug.log( 'app', 'drawing rect', rect_pt);
				if ( i > visible_index ) {
					continue;
				}
				var rect_pt = rect_points[i];
				var rect = new createjs.Shape();
				
				// Stroke color
				rect.graphics.setStrokeDash([],0);
				rect.graphics.setStrokeStyle( self.__stroke_width, 0, 0, 10);
				rect.graphics.beginStroke( stroke_color );
				
				var lightness;
				if (fill_color == 'black') {
					lightness = 100 - (i / (rect_points.length - 1)) * 100;
				}
				else {
					lightness = (i / (rect_points.length - 1)) * 100;
				}
				var hue = (visible_index / rect_points.length) * 360;
//				var color = createjs.Graphics.getHSL( 0, 0, lightness );

				if ( i == Math.floor(visible_index)) {
					rect.graphics.beginFill( stroke_color );
				}
				
//				Debug.log('app', 'rect color is', {
//					color: color,
//					i: i,
//					length: rect_points.length
//				});
				
				rect.graphics.drawRect( rect_pt.x1, rect_pt.y1, rect_pt.w, rect_pt.h );
//				rect.graphics.drawCircle( rect_pt.c_x, rect_pt.c_y, rect_pt.w, rect_pt.h );
//				rect.graphics.drawPolyStar( rect_pt.x1, rect_pt.y1, rect_pt.w, 10);
//				rect.regX = rect_pt.c_x;
//				rect.regY = rect_pt.c_y;
//				rect.rotation = 5*i;
//				rect.x = rect_pt.c_x;
//				rect.y = rect_pt.c_y;
//				rect.setBounds( rect_pt.x1, rect_pt.y1, rect_pt.w, rect_pt.h );
				
//				rect.graphics.setStrokeStyle( 0, 0, 0, 10 );
//				rect.graphics.beginStroke();
//				rect.graphics.beginFill('red');
//				rect.graphics.drawCircle( rect_pt.x1, rect_pt.y1, 2, 2 );
//				
//				rect.graphics.beginFill('red');
//				rect.graphics.drawCircle( rect_pt.x2 - 2, rect_pt.y1, 2, 2 );
				
				var text = constants.create_text({
					content: 'bongae'
				});
//				rect.addChild(text);
				
				self.__grid_container.addChild(rect);
				self.__rectangles.push(rect);
			}
			return;
		},
		
		__draw_grid_lines: function() {
			var self = this;
			
			var stroke_color = self.__stroke_color;
			
			self.__stage.canvas.width 	= $(window).width();
			self.__stage.canvas.height 	= $(window).height();
			
			// Update line points
			var sect_count = 8;
			var sect_w = self.__stage.canvas.width / sect_count;
			var sect_h = self.__stage.canvas.height / sect_count;
			var h_points = [];
			var w_points = [];
			for ( var i = 0; i < sect_count + 1; i++) {
				h_points[i] = sect_h * i;
				w_points[i] = sect_w * i;
			}
			
			// Clear previous line shape
			if(self.__line_shape) {
				self.__grid_container.removeChild(self.__line_shape);
			}
			
			// Redraw line grid
			self.__line_shape = new createjs.Shape();
			var sh = self.__line_shape;
			sh.graphics.setStrokeDash([],0);
			sh.graphics.setStrokeStyle( self.__stroke_width, 0, 0, 10);
			sh.graphics.beginStroke( stroke_color );

			var c_x = self.__stage.canvas.width / 2;
			var c_y = self.__stage.canvas.height / 2;
			for ( var i=0; i < sect_count + 1; i++) {
				sh.graphics.moveTo( 0, h_points[i] );
				sh.graphics.lineTo( c_x, c_y );
				sh.graphics.lineTo( self.__stage.canvas.width, h_points[i] );
				sh.graphics.moveTo( w_points[i], 0 );
				sh.graphics.lineTo( c_x, c_y );
				sh.graphics.lineTo( w_points[i], self.__stage.canvas.height );
			}
//			self.__line_shape.setBounds(0,0, self.__stage.canvas.width, self.__stage.canvas.height);
			self.__grid_container.addChild(self.__line_shape);
			return;
		},
		
		__update: function(event) {
			var self = this;
			self.__stage.update();
			return;
		},
		
		__on_scroll: function() {
			var self =this;
			self.__draw_grid_rectangles();
			self.__stage.update();
			return;
		},
		
		initialize: function() {			
			var self = this;
			
			Debug.log( 'app', 'initialize()' );
			Debug.log( 'app', 'constants is', constants );

			self.__children = [];
			
			// Get canvas
			self.__canvas = $('#myCanvas')[0];
			
			// Create stage
			self.__stage = new createjs.Stage( self.__canvas);
			createjs.Touch.enable( self.__stage);
			self.__stage.enableMouseOver(20);
			
			// Set global FPS
			createjs.Ticker.setFPS(30);

			// Preload
			var asset_manifest = constants.manifest;
			self.total_assets = asset_manifest.length;
			self.loaded_assets = 0;
			var queue = new createjs.LoadQueue();
			queue.installPlugin( createjs.Sound );		
			var result_of = {};
			// Define load callbacks
			queue.on('fileload', function(event) {
				result_of[event.item.id] = event.result;
				return;
			});
			queue.on('complete', function(event) {
				// Preload complete, populate assets
				self.__assets = result_of;
				
				for ( var key in result_of ) {
					var result = result_of[key];
					Debug.log('app', 'got a loaded result for key ' + key, result);
					$('.image-container').append(result);
				}
				
				return;
			} );
			// Init load
			queue.loadManifest( asset_manifest );

			self.__grid_container = new createjs.Container();
			self.__stage.addChild(self.__grid_container);
			
			
			var vertically_center_element = function(selector) {
				var height = $(selector).height();
				$(selector).css({
					top: $(window).height() / 2 + 'px',
					marginTop: -height / 2 + 'px'
				});
				return;
			};
			
			var reposition_description = function( selector, is_left, tweak ) {
				if(!tweak) tweak = 0;
				var title_offset = $('.title p').width() / 2;
				var center_x = $(window).width() / 2;
				var selector_width = $(selector).width();
				
				var attribute = is_left ? 'left' : 'right';
				var value = center_x - ( title_offset / 2 + selector_width + 20 + tweak );
				var desc_css = {};
				desc_css[attribute] = value + 'px';
				$(selector).css(desc_css);
				
				Debug.log('app', 'reposition description', {
					selector: selector,
					title_offset: title_offset,
					center_x: center_x,
					selector_width: selector_width,
					value: value
				});
				
				return;
			};
			
			var reposition_title = function() {
				vertically_center_element('.title');
				vertically_center_element('.description-1');
				vertically_center_element('.description-2');
				
				reposition_description('.description-1', true);
				reposition_description('.description-2', false, 3);
				
				return;
			};

			var adjust_image_container_margins = function() {
				var image_container_margin = $(window).height() - 50;
				$('.image-container').css({
					marginTop: image_container_margin,
					marginBottom: image_container_margin
				});
			};
			
			// Set up resize listener
			$(window).on( 'resize', function() {
				
				// Redraw elements
				self.__draw_grid_lines();
				self.__draw_grid_rectangles();
				// Reposition title
				reposition_title();
				
				adjust_image_container_margins();
				
				self.__stage.update();
			} );
			adjust_image_container_margins();
			
			self.__draw_grid_lines();
			self.__draw_grid_rectangles();
			reposition_title();
			
			// Set up animations
			self.__is_flashing_enabled = false;
			var is_black = true;
//			var white_filter = new createjs.ColorFilter(0, 0, 0, 1,  255, 255, 255, 0);
			var flash = function() {
				
				self.__stroke_color = is_black ? 'white' : 'black';
				self.__fill_color = is_black ? 'black' : 'white';
				
				$(self.__canvas).css({
					backgroundColor: self.__fill_color
				});
				
				$('.title').css({
					color: self.__fill_color
				});
				
				self.__draw_grid_lines();
				self.__draw_grid_rectangles();
				self.__stage.update();
			};
			
			var shake = function(time) {
				if (time == 0) {
					self.__grid_container.x = 0;
					self.__grid_container.y = 0;
					self.__stage.update();
					return;
				}
				
				var delta_x = Math.random() * 10* Math.sin(time);
				var delta_y = Math.random() * 10* Math.cos(time);
				self.__grid_container.x = delta_x;
				self.__grid_container.y = delta_y;
				self.__stage.update();
				//createjs.Tween.get(self.__grid_container).to({y:50}, 500, createjs.Ease.getPowIn(2.2));
			};
			
			// Scroll listener
			$(window).on('scroll', function() {
				self.__on_scroll();
			});
			$(window).scrollTop(0);
			
			// Start ticker
			var flashing_timer = 0;
			self.__ticker_handle = createjs.Ticker.addEventListener( "tick", function(event) {
				
				//Debug.log('app', 'flashing timer is ' + flashing_timer );
				
				// Enable flashing at random intervals
				if ( flashing_timer > 2 * createjs.Ticker.getFPS()  ) {
					self.__is_flashing_enabled = true;
					is_black = !is_black;
					flash();
					shake(flashing_timer);
				}
				if ( flashing_timer > 2.5 * createjs.Ticker.getFPS() ) {
					self.__is_flashing_enabled = false;
					is_black = true;
					flash();
					flashing_timer = 0;
					shake(flashing_timer);
				}
				flashing_timer++;
				
				self.__update(event);
			} );
			
			
			return;
		}

	}

	return App;
} );