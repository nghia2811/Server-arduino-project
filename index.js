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
var exist = true;

io.sockets.on('connect', function (socket) {

    console.log("Có thiết bị vừa được kết nối! " + socket.id);

    // io.sockets.emit('serverguitinnhan', { noidung: "okbaby" });

    socket.on('client-register-user', function (data) {

        if (arrayUser.indexOf(data) == -1) {
            //Ko ton tai user -> dc phep add user
            arrayUser.push(data);
            exist = false;

            //gan ten socket cho user
            socket.un = data;

            ////gui danh sach user ve tat car cac may
            io.sockets.emit('server-send-userlist', { "danhsach": arrayUser });
        } else {
            exist = true;
        }

        // gui ket qua dang ky nguoi dung -> 1 user
        socket.emit('server-send-result', { "ketqua": exist })

    });

    socket.on('client-request-userlist', function () {
        ////gui danh sach user ve tat car cac may
        io.sockets.emit('server-send-userlist', { "danhsach": arrayUser });
    });

    socket.on('client-send-message', function (data) {
        ////gui danh sach user ve tat car cac may
        io.sockets.emit('server-send-message', {
            "user": socket.un,
            "message": data
        });
    });

    socket.on('client-exits', function (data) {
        const index = array.indexOf(data);
        if (index > -1) {
            array.splice(index, 1);
        }
    });

});