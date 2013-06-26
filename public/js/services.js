'use strict';


// ChatSessions service just keeps the name of the user
angular.module('kibitzServices', []).
    factory('ChatSession', function(){
        
        // Return the service
        return {
            'nick': ""
        };
        
    });
