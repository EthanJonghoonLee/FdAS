'use strict';

/**
 * @author: CodeforSeoul by blim(kkh975@naver.com)
 */

define([], function(){

	function FeedItemController( $scope, $routeParams, $q, Define, ResourceService, AuthService, FeedService ){
		var feedId = $routeParams.feedId,
			itemPromise = null,
			replyListCnt = 0,
			replyNowPage = 0;

		function getConditionParam(){
			return {
				'feedId': feedId
			};
		}

		function getReply(){
			ResourceService.feed.reply.method.query({
				'filter': {
					'order': 'addDate DESC',
					'limit': Define.repliesLimit,
					'skip': replyNowPage * Define.repliesLimit,
					'where': getConditionParam()
				}
			}, function( result ) {
				$scope.replies = $scope.replies.concat( result );
				$scope.hasReplyList = replyListCnt > Define.repliesLimit * ++replyNowPage;
			}); 
		}

		function getReplyCount(){
			ResourceService.feed.reply.count.get({
				'where': getConditionParam()
			}, function( data ) {
				$scope.hasReplyList = ( replyListCnt = data.count ) > 0;
				getReply();
			});		
		}

		// reply
		$scope.replies = [];

		// reply action
		$scope.getReply = getReply;

		$scope.saveReply = function(){

			if ( $scope.replyForm.$invalid ){
				alert( '댓글을 확인해주세요.' );
			}
		};
		
		$scope.postReply = function(){
			var deferred = $q.defer(),
				promise = deferred.promise;

			AuthService.loginChaining( deferred );

			promise.then( function( user ){
				ResourceService.feed.reply.method.save({
					'userId': user._id,
					'feedId': feedId,
					'addDate': new Date().getTime() + '',
					'body': $scope.reply
				}, function(){
					$scope.$parent.reloadPage();
				}, function(){
					alert( '죄송합니다. 댓글 등록에 실패했습니다.' );
				});
			});
			promise.catch( function(){
				$scope.$emit( 'dialog', 'dialog.login' );
			});
		};

		// feed action
		[ 'scrap', 'star', 'modify', 'remove' ].forEach( function( key, index ){
			$scope.$on( 'service.feed.' + key, function( e, data ){
				console.log( data )
				FeedService[ key ].call( null, $scope, data );
			});
		});

		// feed
		ResourceService.feed.item.get({
			'id': feedId
		}, function( result ){
			$scope.feed = result;
			getReplyCount();
		}, function(){
			$scope.$parent.moveLink( '404' );
		});
	}

	FeedItemController.$inject = [
		'$scope', 
		'$routeParams',
		'$q',
		'Define',
		'ResourceService',
		'AuthService',
		'FeedService'
	];

	return FeedItemController;
});