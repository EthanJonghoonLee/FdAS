'use strict';

/**
 * @author: CodeforSeoul by blim(kkh975@naver.com)
 */

define([], function(){
	
	return function(){
		
		return {
			'getDefineArrType': function( val, arr ){
				var map = [];

				val = parseInt( val, 10 );
				map = arr.filter( function( each ){
					return each.val === val;
				});

				return map.length > 0 ? map[ 0 ] : arr[ 0 ];
			}
		};
	};
})