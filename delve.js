function delve(model) {

    // Get Entity properties as dictionary props
    function props(element) {
        var props = {};
        element.properties().list().forEach(function (property) {
            props[property.key] = property.value;
        });
        return props;
    }

    // Check if a string is a Entity/relation identifier
    function isIdentifier(name) {
        return /^[_a-zA-Z]\w*$/.test(name);
    }

    // Add Quotes around the identifier
    function validate(name) {
        return isIdentifier(name) ? name : name ;
    }

    // Construct the properties into a string named res
    function render(props) {
        var res = "";
        for (var key in props) {
            if (res.length > 0) res += ",";
            if (props.hasOwnProperty(key)) {
                res += validate(key) + ":";
                var value = props[key];
                res += typeof value == "string" && value[0] != "'" && value[0] != '"' ? "'" + value + "'" : value;
            }
        }
        return res.length == 0 ? "" : "{" + res + "}";
    }

    // All statements in the Delve code
    var statements = [];

    // Create code for entities
    /*
    model.nodeList().forEach(function (node) {
        statements.push("(" + validate(node.id) +" :" + validate(node.caption() || "Node") + " " + render(props(node)) + ") ");
    });
    */

    // For testing: print roleboxes
    model.roleboxList().forEach(function (rolebox) {
        statements.push("(" + validate(rolebox.id) +" :" + validate(rolebox.caption() || "Rolebox") + ") ");
    });

    /*
     * Create code for relationships between entities
     *   relationshipType: relation name
     *   start.id: name of first node
     *   end.id: name of second node
     */
    model.relationshipList().forEach(function (rel) {
        var entity1 = validate(rel.start.caption() || "Entity"+rel.start.id);
        var entity2 = validate(rel.end.caption() || "Entity"+rel.end.id);
        var predicate = "relationship";
        if (rel.relationshipPredicate() == "binary") {
            // Binary predicate
            predicate = validate(rel.relationshipType() || "is_related_to"); // Default relation name is "related_to"
            statements.push("// "+ entity1 + " " + predicate + " " + entity2 + ".\n" +
                "def "+ predicate + "(v" + validate(rel.start.id) + ", v" + validate(rel.end.id) +") =\n" +
                "    " + entity1 + "(v" + validate(rel.start.id) + ")" +
                " and " + entity2 + "(v" + validate(rel.end.id) + ")\n"
            );
        } else if (rel.relationshipPredicate() == "subtype") {
            // Subtype predicate
            predicate = validate(rel.relationshipType() || "is_subtype_of"); // Default relation name is "subtype_of"
            statements.push( "// "+ entity1 + " " + predicate + " " + entity2 + ".\n" +
                "ic "+ predicate + "(v" + validate(rel.start.id) +") =\n" +
                "    " + validate(rel.start.caption() || "Entity"+rel.start.id) + "(v" + validate(rel.start.id) + ")" +
                "\n    implies\n    "
                + validate(rel.end.caption() || "Entity"+rel.end.id) + "(v" + validate(rel.start.id) + ")\n"
            );
        }
        rel.attachedRoleboxes().forEach( function(rbox) {
            // For testing: relationships with associated roleboxes:
            statements.push(predicate + " : (" + validate(rbox.id) +" :" + validate(rbox.caption() || "Rolebox") + ") ");
        });
    });

    // If there are no Delve statements, return an empty string
    if (statements.length==0) return "";
    // Join the Delve statements and return
    return statements.join("\n");
};

if (typeof exports != "undefined") exports.delve=delve
gd.delve=function(model) {return delve(model || this.model());}
