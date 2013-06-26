'use strict';

function LoginCtrl($scope, $location, ChatSession){
    $scope.nick = "";
    
    // Login form submitted
    $scope.login = function() {
        ChatSession.nick = $scope.nick;
        
        $location.url("/chat");
    }
}
//LoginCtrl.$inject = ['$scope', '$location', 'ChatSession'];



function ChatCtrl($scope, $location, $http, $timeout, ChatSession) {
    // Force a login if we don't have an ID.
    if ( ! ChatSession.nick ) {
        $location.url("/login");
        return;
    }
    
    // Set up initial variables
    $scope.nick = ChatSession.nick;
    $scope.chatlog = [];
    $scope.message = "";
    
    // When someone hits enter.
    $scope.sendMessage = function(){
        var resetForm = function(){
            $scope.message = "";
        }
        
        // Send message, reset form
        $http.
            post('/send', {'nick':$scope.nick, 'message':$scope.message}).
            success(resetForm).
            error(resetForm);
    };
    
    // start a refresh
    // FIXME - This is probably an antipattern.
    var lastMsgId = 0;
    var refresh = function(){
        $http.get("/chatlog/" + lastMsgId).
            success(function(data){
                $scope.chatlog = data;
                if ( data.length > 0 )
                    lastMsgId = data[data.length-1].id;
                $timeout(refresh, 100);
            }).error(function(){
                $timeout(refresh, 5000);
            });
    };
    refresh();
}
//ChatCtrl.$inject = ['$scope', '$location', '$http', '$timeout', 'ChatSession'];