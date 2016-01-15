var link = document.createElement('link');
link.rel = 'stylesheet';
link.href = 'https://assets-cdn.github.com/assets/gist/embed-b7ba3882812e204df7d37b2cebe14079b8f58e84562a71b32c4e6ff81af31e23.css';
document.head.appendChild(link);

function makecomments() {
    var contant = {};
    var textarea = jQuery('#editor').parent();
    $.get("https://api.github.com/gists/" + localStorage.getItem(window.location.pathname), function (e) {
        for (var i in e['files']) {
            var res = JSON.parse(e['files'][i]['content']);
            contant[res['timestamp']] = {'name': i, 'text': res['text']}
        }
        if (contant) {
            for (var i in contant) {
                console.log(contant[i]['name'] + ':' + contant[i]['text']);
                var gist = document.createElement('div');
                gist.innerHTML = '<div class="gist"><div class="gist-file"><div class="gist-data"><div class="js-gist-file-update-container js-task-list-container file-box"><div class="file"><div class="blob-wrapper data type-text"><table class="highlight tab-size js-file-line-container" data-tab-size="8"><tbody><tr><td class="blob-code blob-code-inner js-file-line">' + contant[i]['text'] + '</td></tr></tbody></table></div></div></div></div><div class="gist-meta"><a href="https://github.com/liuzheng712" style="float: right"> Power by liuzheng712</a><a href="#">' + contant[i]['name'] + '</a></div></div></div>';
                textarea.before(gist);
            }
        }
    })
}

$(document).ready(function () {
    var cbox = jQuery('#cbox');
    var gist = 'https://api.github.com/gists/' + cbox.data('gist');
    var domain = document.domain;
    var domain = 'ilz.me';

    marked.setOptions({
        gfm: true,
        tables: true,
        breaks: false,
        pedantic: false,
        sanitize: true,
        smartLists: true,
        smartypants: false
    });
    var textarea = jQuery('#editor').parent();
    var button = document.createElement('button');
    button.style.float = 'right';
    button.innerText = '提交';
    button.onclick = function () {
        var nick = $('#nick').val();
        var email = $('#email').val();
        var text = editor.codemirror.getValue();
        if (nick && email && text) {
            if (email.match(/^[a-z]([a-z0-9]*[-_]?[a-z0-9]+)*@([a-z0-9]*[-_]?[a-z0-9]+)+[\.][a-z]{2,3}([\.][a-z]{2})?$/i)) {
                $.ajax({
                    type: 'POST',
                    url: 'url',
                    data: {'nick': nick, 'email': email, 'text': text},
                    success: function () {
                        window.location.reload()
                    }
                })
            }
        } else {
            alert('Error input')
        }
    };
    textarea.after(button);
    var editor = new Editor();
    editor.render();

    if (localStorage.getItem(window.location.pathname)) {
        makecomments()

    }

    $.get(gist, function (e) {
        for (var j in e.files) {
            if (j == domain) {
                var Clist = e.files[j]['raw_url'];
                break
            }
        }
        if (Clist)
            $.get(Clist, function (e) {
                var json = JSON.parse(e);
                for (i in json) {
                    localStorage.setItem(i, json[i]);
                    if (i == window.location.pathname && $('.gist').length == 0) {
                        makecomments()
                    }
                }
            })
    });
});
