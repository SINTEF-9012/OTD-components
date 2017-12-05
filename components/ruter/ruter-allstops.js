module.exports = function (RED) {
    var http = require('http');


    function sendGet(path, callback) {
        var options = {
            host: "reisapi.ruter.no",
            path: path,
            method: "GET"
        };

        var req = http.request(options, function (response) {
            var str = ''
            response.on('data', function (chunk) {
                str += chunk;
            });

            response.on('end', function () {
                callback(str);
            });

        });

        req.on('error', function (err) {
            console.log("Connection not open " + err);

        });

        req.end();
    }


    function RuterAllStops(config) {
        RED.nodes.createNode(this, config);

        var node = this;

        node.on('input', function (msg) {

            sendGet("/Place/GetStopsRuter", function (res) {
                var msg = {};
                msg.payload = res;
                node.send(msg);
            });

        });
    }



    RED.nodes.registerType("ruter-allstops", RuterAllStops);
}