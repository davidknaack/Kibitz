'use strict';


angular.module('kibitz', ['kibitzServices']).
    config(['$routeProvider', function($routeProvider) {
        $routeProvider.
            when('/login', {templateUrl: 'partials/login.html', controller: LoginCtrl}).
            when('/chat', {templateUrl: 'partials/chat.html', controller: ChatCtrl}).
            otherwise({redirectTo: '/login'});
        }]);