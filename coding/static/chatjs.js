/**
 * Created by liuzheng on 1/18/16.
 */
$(document).ready(function () {
    var sock = new WebSocket("ws://" + document.URL.match(RegExp('//(.*?)/'))[1] + "/ws");
    sock.onopen = function () {

//            sock.send('T' + termID);
        //sock.send('C' + rc.x.toString() + "," + rc.y.toString());
    };
    $('button.lcb-entry-button')[0].onclick = function () {
        var msg = $('textarea.lcb-entry-input').val();
        if (msg) {
            sock.send(JSON.stringify({'msg': msg}));
        }

    };
    sock.onclose = function () {
        sock = new WebSocket("ws://" + document.URL.match(RegExp('//(.*?)/'))[1] + "/ws");
        sock.onopen = function () {
//                sock.send('T' + termID);
        };
    };
    var nick, online, uid, avatar;
    sock.onmessage = function (e) {
        var data = JSON.parse(e.data);
        for (var i in data) {
            if (i == 'myinfo') {
                nick = data[i]['nick'];
                uid = data[i]['uid'];
                avatar = data[i]['avatar'];
            } else if (i == 'online') {
                online = data[i]
            } else if (i == 'msgFrom') {
                var li = '<li class="lcb-message lcb-message-own" data-owner="' + data[i]['uid'] + '"><img class="lcb-message-avatar lcb-avatar lcb-room-poke" src="' + data[i]['avatar'] + '"><div class="lcb-message-meta"><span class="lcb-message-name"><span class="lcb-room-poke"><span class="lcb-message-displayname">' + data[i]['nick'] + '\</span><span class="lcb-message-username">@' + data[i]['nick'] + '\</span></span></span><time class="lcb-message-time" title="' + data[i]['timestamp'] + '"\></time><div class="lcb-message-text">' + data[i]['msg'] + '\</div></div></li>';
                $('ul.lcb-messages').append(li);
                var Box = document.getElementsByClassName('lcb-messages')[0];
                Box.scrollTop = Box.scrollHeight;
            }

        }
    };
});