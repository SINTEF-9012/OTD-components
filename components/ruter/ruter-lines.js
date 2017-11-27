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

    function RuterLines(config) {
        RED.nodes.createNode(this, config);
        this.url = config.url;
        this.port = config.port;
        this.line_id = config.line_id;
        this.stop_id = config.stop_id;
        var node = this;


        node.on('input', function (msg) {
            if (msg.topic === 'config') {

            } else {
                //get lines by stop_id
                if (node.stop_id !== undefined && node.stop_id !== "") {
                    sendGet("/Line/GetLinesByStopID/" + node.stop_id, function (res) {
                        node.send(res);
                    });
                }
                if (node.line_id !== undefined && node.line_id !== "") {
                    //get data by line id
                    sendGet("/Line/GetDataByLineID/" + node.line_id, function (res) {
                        node.send(res);
                    });
                }
                if ((node.line_id === undefined || node.line_id === "") && (node.stop_id === undefined || node.stop_id === "")) {
                    //get lines
                    sendGet("/Line/GetLines", function (res) {
                        node.send(res);
                    });
                }

            }
        });

    }

    RED.nodes.registerType("ruter-lines", RuterLines);
}