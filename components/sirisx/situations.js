module.exports = function (RED) {
    var http = require('http');
    var request = require('request');


    function RequestSituations(endpoint, node, payload) {
        var stops_route = payload['stops'];
        var lines_route = payload['lines'];

        const options = {
            url: endpoint + 'situations',
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Accept-Charset': 'utf-8',
                'User-Agent': 'sirisx-client'
            }
        };

        request(options, function (err, res, body) {
            var stops = {};
            var lines = {};
            var json = JSON.parse(body);
            var situations = json['situationExchangeDelivery']['situations'];
            for (var i = 0; i < situations.length; i++) {
                var situation = situations[i];
                if ('networks' in situation['affects']) {
                    var networks = situation['affects']['networks'];
                    for (var j = 0; j < networks.length; j++) {
                        var publishedLineName = networks[j]['affectedLine']['publishedLineName'];
                        for (var k = 0; k < lines_route.length; k++) {
                            var line = lines_route[k];
                            if (line == publishedLineName) {
                                var l_json = {};
                                var line_sarray = publishedLineName in lines ? lines['publishedLineName'] : [];
                                l_json['publishedLineName'] = publishedLineName;
                                l_json['summary'] = situation['summary'];
                                l_json['description'] = situation['description'];
                                line_sarray.push(l_json);
                                lines[publishedLineName] = line_sarray;
                            }
                        }
                    }
                }
                if ('stopPlaces' in situation['affects']) {
                    var stop_places = situation['affects']['stopPlaces'];
                    for (var j = 0; j < stop_places.length; j++) {
                        var stop_ref = stop_places[j]['stopPlaceRef'];
                        for (var k = 0; k < stops_route.length; k++) {
                            var stop = stops_route[k];
                            if (stop == stop_ref) {
                                var s_json = {};
                                var stop_sarray = (stop_ref in stops) ? stops[stop_ref] : [];
                                s_json['stopPlaceRef'] = stop_ref;
                                s_json['summary'] = situation['summary'];
                                s_json['description'] = situation['description'];
                                stop_sarray.push(s_json);
                                stops[stop_ref] = stop_sarray;
                            }
                        }
                    }
                }
            }
            var results = {
                "stops": stops,
                "lines": lines
            };
            var situations = {
                "payload": results
            };
            node.send(situations);
        });

    }

    function SituationsNode(config) {
        RED.nodes.createNode(this, config);
        var node = this;
        node.url = config.url

        node.on('input', function (msg) {
            RequestSituations(node.url, node, msg.payload);
        });
    }

    RED.nodes.registerType("situations", SituationsNode);
}