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


    function RuterTravel(config) {
        RED.nodes.createNode(this, config);
        this.url = config.url;
        this.port = config.port;
        this.from = config.from;
        this.to = config.to;
        this.time = config.datetime;
        this.isAfter = config.isafter;
        this.proposals = config.proposals;
        this.linenames = config.linenames;
        this.ttype = config.ttype;

        var node = this;

        node.on('input', function (msg) {
            if (msg.topic === 'config') {
                //TBD
            } else {
                if (node.from !== undefined && node.from !== "" && node.to !== undefined && node.to !== "") {
                    let path = "?";
                    path += "fromplace=" + node.from + "&toplace=" + node.to;

                    if (node.datetime !== undefined && node.datetime !== "") {
                        path += "&time=" + node.datetime;
                    }

                    if (node.isAfter !== undefined && node.isAfter !== "") {
                        path += "&isafter=" + node.isAfter;
                    } else {
                        path += "&isafter=false";
                    }

                    if (node.proposals !== undefined && node.proposals !== "") {
                        path += "&proposals=" + node.proposals;
                    }

                    if (node.linenames !== undefined && node.linenames !== "") {
                        path += "&linenames=" + node.linenames;
                    }

                    if (node.ttype !== undefined && node.ttype !== "") {
                        path += "&transporttypes=" + node.ttype;
                    }

                    sendGet("/Travel/GetTravels" + path, function (res) {
                        node.send(res);
                    });
                }
            }
        });
    }



    RED.nodes.registerType("ruter-travel", RuterTravel);
}