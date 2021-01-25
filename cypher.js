function cypher(model) {

    // Get node properties as dictionary props
    function props(element) {
        var props = {};
        element.properties().list().forEach(function (property) {
            props[property.key] = property.value;
        });
        return props;
    }

    // Check if a string is a node/relation identifier
    function isIdentifier(name) {
        return /^[_a-zA-Z]\w*$/.test(name);
    }

    // Add Quotes around the identifier
    function quote(name) {
        return isIdentifier(name) ? name : "`" + name + "`";
    }

    // Construct the properties into a string named res
    function render(props) {
        var res = "";
        for (var key in props) {
            if (res.length > 0) res += ",";
            if (props.hasOwnProperty(key)) {
                res += quote(key) + ":";
                var value = props[key];
                res += typeof value == "string" && value[0] != "'" && value[0] != '"' ? "'" + value + "'" : value;
            }
        }
        return res.length == 0 ? "" : "{" + res + "}";
    }

    // All statements in the Cypher code
    var statements = [];

    // Create nodes
    model.nodeList().forEach(function (node) {
        statements.push("(" + quote(node.id) +" :" + quote(node.caption() || "Node") + " " + render(props(node)) + ") ");
    });

    /*
     * Create relationships between nodes
     *   relationshipType: relation name
     *   start.id: name of first node
     *   end.id: name of second node
     */
    model.relationshipList().forEach(function (rel) {
        statements.push("(" + quote(rel.start.id) +
            ")-[:`" + quote(rel.relationshipType()||"RELATED_TO") + // Default relation name is "RELATED_TO"
            "` " + render(props(rel)) +
            "]->("+ quote(rel.end.id) +")"
        );
    });

    // If there are no Cypher statements, return an empty string
    if (statements.length==0) return "";
    // Join the Cypher statements and return
    return "CREATE \n  " + statements.join(",\n  ");
};

if (typeof exports != "undefined") exports.cypher=cypher
gd.cypher=function(model) {return cypher(model || this.model());}
