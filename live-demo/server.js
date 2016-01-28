var fs = require('fs');
var path = require('path');
var express = require('express');
var Tail = require('tail').Tail;
var requestProxy = require('express-request-proxy');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var pos = require('pos');
var chunker = require('pos-chunker');

var TEXT_FILE = path.join(__dirname, "sample-out.txt");

var port = 3000;
server.listen(port, function () {
    console.log('app listening on port ' + port);
});

app.get('/stream', requestProxy({
    url: "http://172.16.1.241:8080/video"
}));

app.get('/etsy', function (req, res) {
    res.sendFile(path.join(__dirname, 'etsy.html'));
});
app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, 'live-demo.html'));
});

var tail = new Tail(TEXT_FILE);

tail.on("line", function(data) {
    var words = new pos.Lexer().lex(data.split(",")[1]);
    var tags = new pos.Tagger().tag(words) || [];
    var nouns = tags.reduce(function(arr, tag) {

        if (/NN|NNP|NNPS|NNS/.test(tag[1])) {
            arr.push(tag[0]);
        }
        return arr;
    }, []);

    io.sockets.emit('caption', {caption: data, tags: tags, nouns: nouns});
});

tail.on("error", function(error) {
    io.sockets.emit('captionError', error);
});

io.on('connection', function (socket) {
    console.log("socket", socket.client.id, "connected");

    socket.on('disconnect', function () {
        console.log("socket", socket.client.id, "disconnected");
    })
});

if (process.env.NODE_ENV == "test") {
    setInterval(function() {
        fs.appendFile(TEXT_FILE, "\n" + (+new Date) + ",a fake test", function() {});
    }, 1000);

}
