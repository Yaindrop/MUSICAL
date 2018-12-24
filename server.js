var express = require('express');
var app = express();
var server = app.listen(3000);
var io = require('socket.io').listen(server);
var fs = require("fs");

console.log("Started");
/*
app.get("/", function(req, res){
    res.sendFile(__dirname + '/index.html');
});
*/
app.use(express.static(__dirname + "/"));

io.on('connection', function(socket){
    socket.emit("connected");

    socket.musicalid = null;
    socket.universe = null;
    socket.wormhole = null;

    var uniProperties;

    console.log("New client connected: " + socket.id);
    console.log("Current connections: ");

    socket.on('msg', function (msgObj) {
        console.log("Message received: " + JSON.stringify(msgObj));
        handle(msgObj);
    });

    function handle (msgObj) {
        switch (msgObj.type) {
            case "checkid":
                fs.exists("musicalid/" + msgObj.id + ".id", function (exist) {
                    if (exist) {
                        reply({
                            type: "reply",
                            reply: "checkid",
                            exists: true
                        });
                    } else {
                        reply({
                            type: "reply",
                            reply: "checkid",
                            exists: false
                        });
                    }
                });
                break;
            case "login":
                if (fs.readFileSync("musicalid/" + msgObj.id + ".id", "utf-8") === msgObj.pass) {
                    reply({
                        type: "reply",
                        reply: "login",
                        accepted: true
                    });
                    socket.musicalid = msgObj.id;
                } else {
                    reply({
                        type: "reply",
                        reply: "login",
                        accepted: false
                    });
                }
                break;
            case "register":
                fs.writeFile("musicalid/" + msgObj.id + ".id", msgObj.pass, function(err) {
                    if (err) {
                        return console.log(err);
                    }
                    console.log("ID registered: " + msgObj.id);
                    reply({
                        type: "reply",
                        reply: "register",
                    });
                    socket.musicalid = msgObj.id;
                });
                break;
            case "logout":
                socket.musicalid = null;
                break;
            case "universe":
                fs.exists("universe/" + msgObj.id + ".txt", function (exist) {
                    if (exist) {
                        uniProperties = fs.readFileSync("universe/" + msgObj.id + ".txt", "utf-8").split("\n");
                        var isResident = false;
                        for (var i = 1; i < uniProperties.length; i ++) {
                            if (uniProperties[i] === socket.musicalid) isResident = true;
                        }
                        if (isResident) {
                            socket.universe = msgObj.id;
                            reply({
                                type: "reply",
                                reply: "universe",
                                exists: true,
                                accepted: true,
                                testcode: uniProperties[0]
                            });
                        } else {
                            uniProperties = null;
                            reply({
                                type: "reply",
                                reply: "universe",
                                exists: true,
                                accepted: false
                            });
                        }
                    } else {
                        reply({
                            type: "reply",
                            reply: "universe",
                            exists: false
                        });
                        console.log(msgObj.id);
                    }
                });
                break;
            case "exituni":
                socket.universe = null;
                uniProperties = null;
                break;
            case "post":
                if (socket.musicalid) {
                    if (socket.universe) {
                        sendAll({
                            type: "post",
                            id: msgObj.id,
                            content: msgObj.content
                        });
                    }
                }
                break;
            case "createwh":

                break;
            case "joinwh":

                break;
            case "exitwh":

                break;
            case "cgavt":

                break;
            case "oldpass":

                break;
            case "newpass":

                break;
            case "checkdelay":
                reply({
                    type: "reply",
                    reply: "checkdelay",
                });
                break;
        }
    }
    function reply (msgObj) {
        socket.emit("msg", msgObj);
    }
    function sendAll (msgObj) {
        io.emit("msg", msgObj);
    }
    function sendTo (id, msgObj) {

    }
    socket.on("disconnect", function () {
        console.log("Client disconnected: " + socket.id);
        console.log("Current connections: ");
    });
});

Array.prototype.remove = function(val) {
    var index = this.indexOf(val);
    if (index > -1) {
        this.splice(index, 1);
    }
};
