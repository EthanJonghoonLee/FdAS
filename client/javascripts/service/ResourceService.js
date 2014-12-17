'use strict';

/**
 * @author: CodeforSeoul by blim(kkh975@naver.com)
 */

define([], function(){

	function ResourceService( $resource, Define ){
		return {
			'user': {
				'method': $resource( 'http://' + Define.serviceHost + '/api/users', null ),
				'count': $resource( 'http://' + Define.serviceHost + '/api/users/count', null ),
				'auth': $resource( 'http://' + Define.serviceHost + '/auth/account', null )
			},
			'feed': {
				'method': $resource( 'http://' + Define.serviceHost + '/api/services', null, {
					'update': {
						method: 'PUT'
					},
					'delete': {
						method: 'PUT'
					}
				}),
				'count': $resource( 'http://' + Define.serviceHost + '/api/services/count', null ),
				'findOne': $resource( 'http://' + Define.serviceHost + '/api/services/findOne', null ),
				'item': $resource( 'http://' + Define.serviceHost + '/api/services/:id', {
					'id': '@id'
				}, {
					'update': {
						method: 'PUT'
					},
					'delete': {
						method: 'PUT'
					}
				}),

				'reply': {
					'method': $resource( 'http://' + Define.serviceHost + '/api/replies', null, {
						'update': {
							method: 'PUT'
						},
						'delete': {
							method: 'PUT'
						}
					}),
					'count': $resource( 'http://' + Define.serviceHost + '/api/replies/count', null )
					// angular :id 뒤에 추가 url 에러발생
					// 'count': $resource( 'http://' + Define.serviceHost + '/api/services/:id/replies/count', {
					// 	'id': '@id'
					// })
				},

				'star': {
					'method': $resource( 'http://' + Define.serviceHost + '/api/grades', null, {
						'update': {
							method: 'PUT'
						},
						'delete': {
							method: 'PUT'
						}
					}),
					'count': $resource( 'http://' + Define.serviceHost + '/api/grades/count', null )
				}
			}
		};

		/*function helpFind( _list, _keys ){
			var key = _keys.shift(),
				item = null;

			for( item in _list ){

				if ( item === key ){

					if ( _keys.length === 0 ){
						return _list[ key ];
					} else {
						return helpFind( _list[ key ], _keys );
					}
				}
			}
		}

		return function( name ){
			return helpFind( list, name.split( '.' ) ).$promise;
		}*/
	}

	ResourceService.$inject = [
		'$resource',
		'Define'
	];

	return ResourceService;
});