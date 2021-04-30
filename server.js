var express = require("express");
var app = express();

app.get("/", function(req, res) {
    res.sendFile(__dirname + "/server.html");
});

//#Khởi tạo một chương trình mạng (app)
//#include thư viện http - Tìm thêm về từ khóa http nodejs trên google nếu bạn muốn tìm hiểu thêm. 
//Nhưng theo kinh nghiệm của mình, Javascript trong môi trường NodeJS cực kỳ rộng lớn, khi bạn bí thì nên tìm hiểu không nên ngồi đọc và cố gắng học thuộc hết cái reference (Tài liêu tham khảo) của nodejs làm gì. Vỡ não đó!
var server = require('http').createServer(app);
var io = require("socket.io").listen(server); //#Phải khởi tạo io sau khi tạo app!
var ip = require('ip');
const firebase = require('firebase');

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
var firebaseConfig = {
    apiKey: "AIzaSyB39_0hs_QW88Gf--hkqE-vPYvMNqenrWY",
    authDomain: "project-3-1ca3b.firebaseapp.com",
    databaseURL: "https://project-3-1ca3b.firebaseio.com",
    projectId: "project-3-1ca3b",
    storageBucket: "project-3-1ca3b.appspot.com",
    messagingSenderId: "877207954481",
    appId: "1:877207954481:web:b7b70a4bd8adb85b682110",
    measurementId: "G-V0TNP0QX8H"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Refernece commandList collections
let commandList = firebase.database().ref("commands");

server.listen(process.env.PORT || 3000); // Cho socket server (chương trình mạng) lắng nghe ở port 3000

console.log("Server nodejs doi ket noi tu client " + ip.address());

//Khi có mệt kết nối được tạo giữa Socket Client và Socket Server
io.on('connection', function(socket) { //'connection' (1) này khác gì với 'connection' (2)
    //hàm console.log giống như hàm Serial.println trên Arduino
    console.log("Có thiết bị vừa được kết nối! " + socket.id);

    //Khi lắng nghe được lệnh "connection" từ xe.
    //Lấy dữ liệu từ firebase để chạy
    socket.on('connection', function(message) {
        console.log(message);
        //Retrieve commands
        let ref = firebase.database().ref("commands");
        // ref.on("value", getData);
        ref.on("value", (snapshot) => {
            const info = snapshot.val();
            let keys = Object.keys(info);

            for (let i = 0; i < keys.length; i++) {
                let infoData = keys[i];
                let direction = info[infoData].direction;
                let distance = info[infoData].distance;
                let createdBy = info[infoData].createdBy;
                switch (direction) {
                    case 1:
                        io.sockets.emit('go-ahead', { "message": "goahead" });
                        setTimeout(function() {
                            io.sockets.emit('stop', { "message": "stop" });
                        }, parseInt(distance));
                        break;
                    case 2:
                        io.sockets.emit('go-back', { "message": "goback" });
                        setTimeout(function() {
                            io.sockets.emit('stop', { "message": "stop" });
                        }, parseInt(distance));
                        break;
                    case 3:
                        io.sockets.emit('right', { "message": "right" });
                        setTimeout(function() {
                            io.sockets.emit('stop', { "message": "stop" });
                        }, parseInt(distance));
                        break;
                    case 4:
                        io.sockets.emit('left', { "message": "left" });
                        setTimeout(function() {
                            io.sockets.emit('stop', { "message": "stop" });
                        }, parseInt(distance));
                        break;
                }
                console.log(direction, distance, createdBy);
            }
        });
    });

    socket.on('go-ahead', function(message) {
        console.log("go ahead");
        io.sockets.emit('go-ahead', { "message": "goahead" });
    });

    socket.on('go-back', function(message) {
        console.log("go back");
        io.sockets.emit('go-back', { "message": "goback" });
    });

    socket.on('left', function(message) {
        console.log("left");
        io.sockets.emit('left', { "message": "left" });
    });

    socket.on('right', function(message) {
        console.log("right");
        io.sockets.emit('right', { "message": "right" });
    });

    socket.on('stop', function(message) {
        console.log("stop");
        io.sockets.emit('stop', { "message": "stop" });
    });

    socket.on('commands', function(message) {
        var obj = JSON.parse(message);

        //   Get input Values
        let direction = obj.DirectionCode;
        let distance = obj.Distance;
        let createdBy = obj.CreatedBy;

        console.log(direction, distance, createdBy);
        saveCommand(direction, distance, createdBy);
    });
});

// Save commands to Firebase
function saveCommand(direction, distance, createdBy) {
    let newCommandList = commandList.push();

    newCommandList.set({
        direction: direction,
        distance: distance,
        createdBy: createdBy
    });
}

function getData(data) {
    let info = data.val();
    let keys = Object.keys(info);

    for (let i = 0; i < keys.length; i++) {
        let infoData = keys[i];
        let direction = info[infoData].direction;
        let distance = info[infoData].distance;
        let createdBy = info[infoData].createdBy;
        console.log(direction, distance, createdBy);
    }
}