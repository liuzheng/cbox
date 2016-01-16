#!/usr/bin/env python
#  coding: utf-8
#  Copyright (c) 2016
#  Gmail:liuzheng712

import sys
import os

sys.path.append(os.path.dirname(os.path.abspath(__file__)))

import tornado.options
import tornado.ioloop
import tornado.web
import tornado.wsgi
import tornado.template
import tornado.auth
import tornado.websocket
import tornado.httpserver
import uuid
import json

settings = {
    "static_path": os.path.join(os.path.dirname(__file__), "./static/"),
    "cookie_secret": "--------------------------------------------",
    "debug": True,
}


class Chat(tornado.websocket.WebSocketHandler):
    users = dict()

    def allow_draft76(self):
        # for iOS 5.0 Safari
        return True

    def check_origin(self, origin):
        return True

    def getAll(self):
        user = []
        for u in Chat.users:
            us = Chat.users[u]
            user.append({'nick': us.nick})
        data = {'users': {'id': self.userID, 'nick': self.nick, 'online': user}}
        return data

    def open(self):
        print "term socket open"
        self.userID = str(uuid.uuid4())
        self.nick = 'Anonymous'
        Chat.users[self.userID] = self

        self.write_message(json.dumps(self.getAll()))
        # self.pty()

    def on_message(self, msg):
        self.write_message(json.dumps({'msg': msg}))

    def on_close(self):
        print "term close"
        del Chat.users[self.userID]
        for u in Chat.users:
            us = Chat.users[u]
            us.write_message(json.dumps(self.getAll()))
        self.close()


def main():
    tornado.options.define("port", default=8000, help="Run server on a specific port", type=int)
    tornado.options.parse_command_line()
    application = tornado.web.Application([
        ('/ws', Chat),
        (r"/()", tornado.web.StaticFileHandler, dict(path=os.path.join(os.path.dirname(__file__),
                                                                       "static/index.html"))),
        (r"/(.*)", tornado.web.StaticFileHandler, dict(path=os.path.join(os.path.dirname(__file__), "static"))),
    ], **settings)

    server = tornado.httpserver.HTTPServer(application)
    server.listen(tornado.options.options.port)

    tornado.ioloop.IOLoop.instance().start()


if __name__ == "__main__":
    main()
