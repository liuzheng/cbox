#!/usr/bin/env python
#  coding: utf-8
#  Copyright (c) 2016
#  Gmail:liuzheng712

import uuid
import json
import time
import tornado.options
import tornado.ioloop
import tornado.web
import tornado.wsgi
import tornado.template
import tornado.auth
import tornado.websocket
import tornado.httpserver
import identicons

settings = {
    # "static_path": os.path.join(os.path.dirname(__file__), "./static/"),
    # "cookie_secret": "--------------------------------------------",
    "debug": False,
}


class Chat(tornado.websocket.WebSocketHandler):
    users = dict()

    @staticmethod
    def allow_draft76():
        # for iOS 5.0 Safari
        return True

    def check_origin(self, origin):
        return True

    @staticmethod
    def on_line():
        user = []
        for u in Chat.users:
            us = Chat.users[u]
            user.append({'nick': us.nick, 'uid': us.userID, 'avatar': us.avatar})
        for u in Chat.users:
            us = Chat.users[u]
            us.write_message(json.dumps({'online': user}))

    @staticmethod
    def uids():
        user = {}
        for u in Chat.users:
            us = Chat.users[u]
            user[us.userID] = us
        return user

    def my_info(self):
        self.write_message(
            json.dumps({'myinfo': {'uid': self.userID, 'nick': self.nick, 'avatar': self.avatar, 'email': self.email}}))

    def open(self):
        print "term socket open"
        online = self.on_line()
        try:
            if str(self.get_cookie('uid')) in online:
                us = online[self.get_cookie('uid')]
                self.userID = us.userID
                self.nick = us.nick
                self.avatar = us.avatar
                self.email = us.email
                self.write_message = us.write_message
                self.my_info()
                self.on_line()
            else:
                self.userID = str(uuid.uuid4())
                self.nick = 'Anonymous'
                i = identicons.Identicon(str(self.request.remote_ip))
                self.avatar = 'data:image/gif;base64,' + i.base64()
                self.email = "Your Email"
                Chat.users[self.userID] = self
                self.my_info()
                self.on_line()
        except:
            self.userID = str(uuid.uuid4())
            self.nick = 'Anonymous'
            i = identicons.Identicon(str(self.request.remote_ip))
            self.avatar = 'data:image/gif;base64,' + i.base64()
            self.email = "Your Email"
            Chat.users[self.userID] = self
            self.my_info()
            self.on_line()

    def on_message(self, msg):
        msg = json.loads(msg)
        for k in msg:
            if k == 'msg':
                self.send_all_message(msg[k])

    def send_all_message(self, msg):
        data = {'msgFrom': {'nick': self.nick, 'timestamp': int(time.time()), 'uid': self.userID, 'msg': msg,
                            'avatar': self.avatar}}
        for u in Chat.users:
            us = Chat.users[u]
            us.write_message(json.dumps(data))

    def on_close(self):
        print "term close"
        del Chat.users[self.userID]
        self.on_line()
        self.close()


class Hello(tornado.web.RequestHandler):
    def get(self):
        self.write("Hello, world")


def main():
    tornado.options.define("port", default=8000, help="Run server on a specific port", type=int)
    tornado.options.parse_command_line()
    application = tornado.web.Application([
        ('/ws', Chat),
        (r"/.*", Hello),
    ], **settings)

    server = tornado.httpserver.HTTPServer(application)
    server.listen(tornado.options.options.port)

    tornado.ioloop.IOLoop.instance().start()


if __name__ == "__main__":
    main()
