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
    var sock = new WebSocket("ws://" + document.URL.match(RegExp('//(.*?)/'))[1] + "/ws");
    sock.onopen = function () {

    };
    $scope.sendMSG = function () {
        if ($scope.msg) {
            sock.send(JSON.stringify({'msg': $scope.msg}));
        }

    };
    sock.onclose = function () {
        sock = new WebSocket("ws://" + document.URL.match(RegExp('//(.*?)/'))[1] + "/ws");
        sock.onopen = function () {
        };
    };
    $scope.messages = [{
        msg: "请文明聊天，如让宝宝不开心，宝宝将剥夺你讲话的权利",
        nick: "宝宝",
        uid: "null",
        avatar: "https://github.com/identicons/2660e83ae26ec8c77de57ae4aa9f9651.png",
        timestamp: 1453268259.212362
    }];
    $scope.baobao = $scope.messages;
    $scope.online = $scope.baobao;
    $scope.me = {};
    sock.onmessage = function (e) {
        var data = JSON.parse(e.data);
        for (var i in data) {
            if (i == 'myinfo') {
                $scope.me['nick'] = data[i]['nick'];
                $scope.me['uid'] = data[i]['uid'];
                $scope.me['avatar'] = data[i]['avatar'];
            } else if (i == 'online') {
                $scope.online = [].concat($scope.baobao, data[i]);
            } else if (i == 'msgFrom') {
                $scope.messages.push(data[i]);

            }
        }
        $scope.lcbMessagesHeight = $('div.lcb-chat').height() - 150;
        $scope.$apply();
        var Box = document.getElementsByClassName('lcb-messages')[0];
        Box.scrollTop = Box.scrollHeight;
    };
});
