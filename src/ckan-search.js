module.exports = function (RED) {
    var http = require('http');
    var ckan = require('ckan');

    function sendPost(endpoint, port, data, callback) {
        var options = {
            host: endpoint,
            path: '/api/3/search/dataset',
            port: 5000,
            method: port,
            headers: {
                'Content-Type': 'application/json'
            }
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

        //This is the data we are posting, it needs to be a string or a buffer
        req.write(JSON.stringify(data));
        req.end();
    }


    function CkanSearchNode(config) {
        RED.nodes.createNode(this, config);
        this.url = config.url;
        this.port = config.port;
        this.q = config.q;
        this.resource_id = config.resource_id;
        var node = this;

        var client = new ckan.Client(this.url);


        node.on('input', function (msg) {
            if (msg.topic === 'reset') {
                node.resource_id = '';
                node.q = '';
            } else if (msg.topic === "config") {
                node.resource_id = msg.payload.resource_id;
                node.q = msg.payload.q;
            } else {
                var data = {};
                if (node.q === "") {
                    data = {
                        "q": msg.payload.q
                    };
                } else {
                    data = {
                        "q": node.q
                    };

                }
                sendPost(node.url, node.port, data, function (res) {
                    node.send(res);
                });
            }


        });
    }
    RED.nodes.registerType("ckan-search", CkanSearchNode);
}