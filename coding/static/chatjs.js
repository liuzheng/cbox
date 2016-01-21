/**
 * Created by liuzheng on 1/18/16.
 */
'use strict';
var NgAPP = angular.module('Chat', []);
NgAPP.config(function ($interpolateProvider) {
    $interpolateProvider.startSymbol('{[{');
    $interpolateProvider.endSymbol('}]}');
});
NgAPP.directive('ngEnter', function () {
    return function (scope, element, attrs) {
        element.bind("keydown keypress", function (event) {
            if (event.which === 13) {
                scope.$apply(function () {
                    scope.$eval(attrs.ngEnter, {$event: event});
                });
                event.preventDefault();
            }
        });
    };
});
NgAPP.controller('chatBoxCtrl', function ($scope, $http) {
    var sockURL = "ws://" + document.URL.match(new RegExp('//(.*?)/'))[1] + "/ws";
    //sockURL = "ws://cbox.coding.io/ws";
    sockURL = "ws://localhost:8000/ws";
    var sock = new WebSocket(sockURL);
    sock.onopen = function () {

    };
    $scope.sendMSG = function () {
        if ($scope.msg) {
            sock.send(JSON.stringify({'msg': $scope.msg}));
        }

    };
    sock.onclose = function () {
        sock = new WebSocket("ws://" + document.URL.match(new RegExp('//(.*?)/'))[1] + "/ws");
        sock.onopen = function () {
        };
    };
    $scope.messages = [{
        msg: "请文明聊天，如让宝宝不开心，宝宝将剥夺你讲话的权利",
        nick: "宝宝",
        uid: "null",
        avatar: "https://github.com/identicons/2660e83ae26ec8c77de57ae4aa9f9651.png",
        timestamp: 1453268259
    }];
    $scope.baobao = $scope.messages;
    $scope.online = $scope.baobao;
    $scope.me = {};
    sock.onmessage = function (e) {
        var data = JSON.parse(e.data);
        for (var i in data) {
            if (data.hasOwnProperty(i)) {
                if (i == 'myinfo') {
                    $scope.me['nick'] = data[i]['nick'];
                    $scope.me['uid'] = data[i]['uid'];
                    $scope.me['avatar'] = data[i]['avatar'];
                    $scope.me['email'] = data[i]['email'];
console.log($scope.me)
                } else if (i == 'online') {
                    $scope.online = [].concat($scope.baobao, data[i]);
                    console.log($scope.online)
                } else if (i == 'msgFrom') {
                    $scope.messages.push(data[i]);
                }
            }
        }
        $scope.lcbMessagesHeight = $('div.lcb-chat').height() - 150;
        $scope.$apply();
        CheckTime();
        var Box = document.getElementsByClassName('lcb-messages')[0];
        Box.scrollTop = Box.scrollHeight;
    };
    $scope.$watch("me['email']", function () {
        console.log($scope.me['email'])
    });
    $scope.updateInfo= function () {
        if ($scope.me['nick'] && $scope.me['email'].match(/^[a-z]([a-z0-9]*[-_]?[a-z0-9]+)*@([a-z0-9]*[-_]?[a-z0-9]+)+[\.][a-z]{2,3}([\.][a-z]{2})?$/i)) {
            sock.send(JSON.stringify({'updateInfo':{'nick': $scope.me['nick'],'email':$scope.me['email']}}));
        }
    }
});
