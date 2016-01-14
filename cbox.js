var link = document.createElement('link');
link.rel = 'stylesheet';
link.href = 'https://assets-cdn.github.com/assets/gist/embed-b7ba3882812e204df7d37b2cebe14079b8f58e84562a71b32c4e6ff81af31e23.css';
document.head.appendChild(link);

function makecomments() {
    var contant = {};
    var textarea = jQuery('textarea');
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
    var user = cbox.data('gist');
    var gist = 'https://api.github.com/gists/';
    var list = 'https://api.github.com/users/' + user + '/gists';
    var domain = document.domain;
    var domain = 'ilz.me';
    var comments = document.createElement('p');


    if (localStorage.getItem(window.location.pathname)) {
        makecomments()

    }

    $.get(list, function (e) {
        for (var i in e) {
            for (var j in e[i].files) {
                if (j == domain) {
                    var Clist = e[i].files[j]['raw_url'];
                    break
                }
            }
            if (Clist)break
        }
        $.get(Clist, function (e) {
            var json = JSON.parse(e);
            for (i in json) {
                localStorage.setItem(i, json[i]);
                if (i == window.location.pathname && cbox[0].children.length == 1) {
                    makecomments()
                }
            }
        })
    });
    var child = document.createElement('div');
    child.style.position = 'absolute';
    child.style.width = '20px';
    child.style.height = '20px';
    child.style.backgroundColor = 'red';
});
