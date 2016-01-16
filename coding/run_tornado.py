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
import tornado.template
import tornado.auth
import uuid

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

    def open(self):
        print "term socket open"
        self.userID = uuid.uuid4()
        Chat.users[self.userID]=self
        # self.pty()

    def on_message(self, msg):
        self.write_message('saf')

    def on_close(self):
        print "term close"
        Chat.users[self.userID].remove(self)


application = tornado.web.Application([
    ('/ws', Chat),
    (r"/()$", tornado.web.StaticFileHandler, {'path': 'static/index.html'}),
    (r"/(.*)", tornado.web.StaticFileHandler, {'path': 'static/'}),
], **settings)

if __name__ == "__main__":
    tornado.options.define("port", default=8000, help="Run server on a specific port", type=int)
    tornado.options.parse_command_line()
    application.listen(tornado.options.options.port)
    tornado.ioloop.IOLoop.instance().start()
