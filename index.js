var express = require("express");
var app = express();
var server = require("http").createServer(app);
var io = require("socket.io").listen(server);
var fs = require("fs");
server.listen(process.env.PORT || 3000);

app.get("/", function (req, res) {
    res.sendFile(__dirname + "/index.html");
});

console.log("Server is running!!");

var arrayUser = [];

io.sockets.on('connect', function (socket) {

    console.log("Có thiết bị vừa được kết nối! " + socket.id);

    socket.on('client-register-user', function (data) {

        if (arrayUser.indexOf(data) == -1) {
            //Ko ton tai user -> dc phep add user
            arrayUser.push(data);

            //gan ten socket cho user
            socket.un = data;

            ////gui danh sach user ve tat car cac may
            io.sockets.emit('server-send-userlist', { "danhsach": arrayUser });
        }

    });

    socket.on('client-request-userlist', function () {
        ////gui danh sach user ve tat car cac may
        io.sockets.emit('server-send-userlist', { "danhsach": arrayUser });
    });

    socket.on('client-send-message', function (data) {
        ////gui danh sach user ve tat car cac may
        io.sockets.emit('server-send-message', {
            "user": data.user,
            "message": data.message
        });
    });

    socket.on('client-exits', function (data) {
        const index = arrayUser.indexOf(data);
        if (index > -1) {
            arrayUser.splice(index, 1);
        }
    });

});