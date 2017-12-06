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



    function RuterStops(config) {
        RED.nodes.createNode(this, config);
        this.url = config.url;
        this.port = config.port;
        this.line_id = config.line_id;
        this.stop_id = config.stop_id;
        this.datetime = config.datetime;
        this.ttype = config.ttype;
        this.linenames = config.linenames;
        var node = this;


        node.on('input', function (msg) {
            if (msg.topic === 'config') {
                //TBD
            } else {
                if (node.line_id !== undefined && node.line_id !== "") {
                    sendGet("/Line/GetStopsByLineId/" + node.line_id, function (res) {
                        node.send(res);
                    });
                }


                if (node.stop_id !== undefined && node.stop_id !== "") {
                    var path = "?";
                    if (node.datetime !== undefined && node.datetime !== "") {
                        if (path.length > 1) {
                            path += "&";
                        }
                        path += "datetime=" + node.datetime;
                    }
                    if (node.ttype !== undefined && node.ttype !== "") {
                        if (path.length > 1) {
                            path += "&";
                        }
                        path += "transporttypes=" + node.ttype;
                    }
                    if (node.linenames !== undefined && node.linenames !== "") {
                        if (path.length > 1) {
                            path += "&";
                        }
                        path += "linenames=" + node.linenames;
                    }

                    sendGet("/StopVisit/GetDepartures/" + node.stop_id + path, function (res) {
                        node.send(res);
                    });
                }
            }
        });

    }

    RED.nodes.registerType("ruter-stops", RuterStops);
}