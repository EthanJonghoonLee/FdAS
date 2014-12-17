'use strict';

/**
 * @author: CodeforSeoul by blim(kkh975@naver.com)
 */

define([], function(){

	function feedCompile( $q, $filter, Define, CommonHelper, StoreService, ResourceService ){
		return {
			'templateUrl': '../../template/feed-temp.html',
			'restrict': 'A',
			'replace': false,
			'priority': 0,
			'transclude': false,
			'scope': {
				'feed': '=item',
				'type': '=type',
				'outer': '&'
			},
			'link': function( $scope, elem, attrs ){

				function isScrap( feedId ){
					return StoreService.get( 'myScrap' ).indexOf( feedId ) > -1
				}

				function setFeed( feedId ){
					$scope.feed.isScrap = isScrap( feedId );
					$scope.feed.isEnd = ( $scope.feed.delDate !== '' ) || $filter( 'endDate' )( $scope.feed.endDate );
					$scope.feed.area = CommonHelper.getDefineArrType( $scope.feed.area, Define.locations ).label;

					// get star
					ResourceService.feed.star.method.query({
						'filter': {
							'fields': {
								'star': true
							},
							'where': {
								'feedId': feedId
							}
						}
					}, function( result ){
						var len, sum;

						len = result.length;
						sum = 
							len === 0 ?  0 : 
							len === 1 ? result[ 0 ].star : result.reduce(function( prev, next, item ){

								if ( prev.star ){
									prev = prev.star
								}

								return parseInt( prev, 10 ) + parseInt( next.star, 10 );
							});

						$scope.feed.star = len === 0 ? 0 : Math.round( sum / len );
					});

					// get reply cnt
					ResourceService.feed.reply.count.get({
						'where': {
							'feedId': feedId
						}
					}, function( result ){
						$scope.feed.replyCnt = result.count;
					}, function(){
						$scope.feed.replyCnt = '-';
					});						
				}

				if ( $scope.feed && $scope.feed.id ){
					setFeed( $scope.feed.id );
				}

				$scope.$watch( 'feed', function( feed ){
					
					if ( feed ){
						setFeed( feed.id );	
					}
				});
			}
		};	
	}

	feedCompile.$inject = [
		'$q', 
		'$filter',
		'Define', 
		'CommonHelper',
		'StoreService', 
		'ResourceService'
	];

	return feedCompile;
});