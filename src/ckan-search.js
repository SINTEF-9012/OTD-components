module.exports = function(RED) {
    function CkanSearchNode(config) {
        RED.nodes.createNode(this,config);
        var node = this;
        node.on('input', function(msg) {

        });
    }
    RED.nodes.registerType("ckan-search",CkanSearchNode);
}
