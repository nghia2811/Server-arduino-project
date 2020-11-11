var express = require("express");
var app = express();
//#Khởi tạo một chương trình mạng (app)
//#include thư viện http - Tìm thêm về từ khóa http nodejs trên google nếu bạn muốn tìm hiểu thêm. 
//Nhưng theo kinh nghiệm của mình, Javascript trong môi trường NodeJS cực kỳ rộng lớn, khi bạn bí thì nên tìm hiểu không nên ngồi đọc và cố gắng học thuộc hết cái reference (Tài liêu tham khảo) của nodejs làm gì. Vỡ não đó!
var server = require('http').createServer(app);
var io = require("socket.io").listen(server); //#Phải khởi tạo io sau khi tạo app!
var ip = require('ip');

server.listen(process.env.PORT || 3000); // Cho socket server (chương trình mạng) lắng nghe ở port 3000

console.log("Server nodejs doi ket noi tu client " + ip.address());

app.get("/", function(req, res) {
    res.sendFile(__dirname + "/index.html");
});


// //Gửi dữ liệu thông qua 
// function sendTime() {

// 	//Đây là một chuỗi JSON
// 	var json = {
// 		name : "nguyen trung nghia", 	      //kiểu chuỗi
//      ​ESP8266: 12,						   //số nguyên
// 		soPi: 3.14,							  //số thực
// 		time: new Date()					  //Đối tượng Thời gian
//     ​}
//     ​io.sockets.emit('atime', json)
// }

//Khi có mệt kết nối được tạo giữa Socket Client và Socket Server
io.on('connection', function(socket) { //'connection' (1) này khác gì với 'connection' (2)
    //hàm console.log giống như hàm Serial.println trên Arduino
    console.log("Có thiết bị vừa được kết nối! " + socket.id);

    //Khi lắng nghe được lệnh "connection" với một tham số, và chúng ta đặt tên tham số là message. Mình thích gì thì mình đặt thôi.
    socket.on('connection', function(message) {
        console.log(message);
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
        console.log(obj.huongdi);
        console.log(obj.khoangcach);
        io.sockets.emit('commands-from-user', obj);
    });

    //khi lắng nghe được lệnh "atime" với một tham số, và chúng ta đặt tên tham số đó là data. Mình thích thì mình đặt thôi
    // ​socket.on('atime', function(data) {
    //     ​sendTime()
    //     ​console.log(data)
    // ​})

    // socket.on('arduino', function (data) {
    //   io.sockets.emit('arduino', { message: 'R0' });
    //   ​console.log(data)
    // ​})
});