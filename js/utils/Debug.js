define( 'Debug',
	[],	
	function() {
		var Debug;
		/*
		 * util object for debug 
		 * (c) 2016 Tom Engström
		 * 
		 */

		Debug = {
			__is_scope_enabled: {},
		
			enable_scope: function(scope) {
				this.__is_scope_enabled[scope] = true;
				return;
			},
			disable_scope: function(scope) {
				this.__is_scope_enabled[scope] = false;
				return;
			},
			
			__log: function( message, object ) {
				console.log(message);
				if ( object ) {
					console.log(object);
				}
				return;
			},
			
			// Basic togglable console debugger
			log: function( scope, message, object ) {
				var self = this;
				if ( !self.__is_scope_enabled[scope] ) return;
				return self.__log( scope + ':: ' + message, object);
			}
		};
	
		return Debug;
} );