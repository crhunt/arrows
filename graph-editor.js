window.onload = function()
{
    var graphModel;

    graphModel = gd.model();
    graphModel.createNode().x( 0 ).y( 0 );
    save( formatMarkup() );

    /*if ( !localStorage.getItem( "graph-diagram-markup" ) )
    {
        graphModel = gd.model();
        graphModel.createNode().x( 0 ).y( 0 );
        save( formatMarkup() );
    }*/
    
    if ( localStorage.getItem( "graph-diagram-style" ) )
    {
        d3.select( "link.graph-style" )
            .attr( "href", localStorage.getItem( "graph-diagram-style" ) );
    }
    
    graphModel = parseMarkup( localStorage.getItem( "graph-diagram-markup" ) );

    var svg = d3.select("#canvas")
        .append("svg:svg")
        .attr("class", "graphdiagram");

    var diagram = gd.diagram()
        .scaling(gd.scaling.centerOrScaleDiagramToFitSvg)
        .overlay(function(layoutModel, view) {

            // Entities

            var nodeOverlays = view.selectAll("circle.node.overlay")
                .data(layoutModel.nodes);

            nodeOverlays.exit().remove();

            nodeOverlays.enter().append("circle")
                .attr("class", "node overlay")
                .call( d3.behavior.drag().on( "drag", drag ).on( "dragend", dragEnd ) )
                .on('contextmenu', d3.contextMenu(nodeOptions))
                .on( "dblclick", editNode );

            nodeOverlays
                .attr("r", function(node) {
                    return node.radius.outside();
                })
                .attr("stroke", "none")
                .attr("fill", "rgba(255, 255, 255, 0)")
                .attr("cx", function(node) {
                    return node.x;
                })
                .attr("cy", function(node) {
                    return node.y;
                });

            var nodeRings = view.selectAll("circle.node.ring")
                .data(layoutModel.nodes);

            nodeRings.exit().remove();

            nodeRings.enter().append("circle")
                .attr("class", "node ring")
                .call( d3.behavior.drag().on( "drag", dragNodeRing ).on( "dragend", dragEnd ) );

            nodeRings
                .attr("r", function(node) {
                    return node.radius.outside() + 5;
                })
                .attr("fill", "none")
                .attr("stroke", "rgba(255, 255, 255, 0)")
                .attr("stroke-width", "10px")
                .attr("cx", function(node) {
                    return node.x;
                })
                .attr("cy", function(node) {
                    return node.y;
                });
            
            // Relationships

            var relationshipsOverlays = view.selectAll("path.relationship.overlay")
                .data(layoutModel.relationships);

            relationshipsOverlays.exit().remove();

            var container = d3.select( "body" ).append( "div" );

            relationshipsOverlays.enter().append("path")
                .attr("class", "relationship overlay")
                .attr("fill", "rgba(255, 255, 255, 0)")
                .attr("stroke", "rgba(255, 255, 255, 0)")
                .attr("stroke-width", "10px")
                //.append("g")
                .on('contextmenu', d3.contextMenu(relOptions))
                .on( "dblclick", editRelationship );

            relationshipsOverlays
                .attr("transform", function(r) {
                    var angle = r.start.model.angleTo(r.end.model);
                    return "translate(" + r.start.model.ex() + "," + r.start.model.ey() + ") rotate(" + angle + ")";
                } )
                .attr("d", function(d) { return d.arrow.outline; } );
            
            // Roleboxes
            
            var roleboxOverlays = view.selectAll("rect.rolebox.overlay")
                .data(layoutModel.roleboxes);

            roleboxOverlays.exit().remove();

            roleboxOverlays.enter().append("rect")
                .attr("class", "rolebox overlay")
                .call( d3.behavior.drag().on( "drag", drag ).on( "dragend", dragEnd ) );
                //.on('contextmenu', d3.contextMenu(nodeOptions))
                //.on( "dblclick", editNode );

            roleboxOverlays
                .attr("height", function(rolebox) {
                    return 0.5 * rolebox.radius.outside();
                })
                .attr("width", function(rolebox) {
                    return 2 * rolebox.radius.outside();
                })
                .attr("stroke", "none")
                .attr("fill", "rgba(255, 255, 255, 0)")
                .attr("x", function(rolebox) {
                    return rolebox.x;
                })
                .attr("y", function(rolebox) {
                    return rolebox.y;
                });

            var roleboxRingsLeft = view.selectAll("rect.rolebox.ring.left")
                .data(layoutModel.roleboxes);

            roleboxRingsLeft.exit().remove();

            roleboxRingsLeft.enter().append("rect")
                .attr("class", "rolebox ring left")
                .call( d3.behavior.drag().on( "drag", dragRoleboxRing ).on( "dragend", dragEnd ) );

            roleboxRingsLeft
                .attr("height", function(rolebox) {
                    return 0.5 * rolebox.radius.mid();
                })
                .attr("width", function(rolebox) {
                    return 0.5 * rolebox.radius.mid();
                })
                .attr("fill", "rgba(255, 255, 255, 0)")
                .attr("stroke", "none")
                //.attr("stroke-width", "10px")
                .attr("x", function(rolebox) {
                    return rolebox.x - 0.5 * rolebox.radius.mid();
                })
                .attr("y", function(rolebox) {
                    return rolebox.y;
                });
            
            var roleboxRingsRight = view.selectAll("rect.rolebox.ring.right")
                .data(layoutModel.roleboxes);

            roleboxRingsRight.exit().remove();

            roleboxRingsRight.enter().append("rect")
                .attr("class", "rolebox ring right")
                .call( d3.behavior.drag().on( "drag", dragRoleboxRing ).on( "dragend", dragEnd ) );

            roleboxRingsRight
                .attr("height", function(rolebox) {
                    return 0.5 * rolebox.radius.mid();
                })
                .attr("width", function(rolebox) {
                    return 0.5 * rolebox.radius.mid();
                })
                .attr("fill", "rgba(255, 255, 255, 0)")
                .attr("stroke", "none")
                //.attr("stroke-width", "10px")
                .attr("x", function(rolebox) {
                    return rolebox.x + 2 * rolebox.radius.mid();
                })
                .attr("y", function(rolebox) {
                    return rolebox.y;
                });
            
        });

    var relOptions =
    [
        {
          title: 'Reverse',
          action: function(elm, d, i) { reverseRelationshipDirect.call(elm); }
        },
        {
          title: 'Delete',
          action: function(elm, d, i) { deleteRelationshipDirect.call(elm); }
        },
        {
          title: 'ORM',
          action: function(elm, d, i) { editRelationship.call(elm); }
        }
    ];

    var nodeOptions =
    [
        {
          title: 'Delete',
          action: function(elm, d, i) { deleteNodeDirect.call(elm); }
        },
        {
          title: 'Properties',
          action: function(elm, d, i) { editNode.call(elm); }
        }
    ];

    function draw()
    {
        svg
            .data([graphModel])
            .call(diagram);
        updateSvgDownloadLink();
    }

    function save( markup )
    {
        localStorage.setItem( "graph-diagram-markup", markup );
        localStorage.setItem( "graph-diagram-style", d3.select( "link.graph-style" ).attr( "href" ) );
    }

    var newNode = null;
    var newRolebox = null;
    var newRelationship = null;

    function findClosestOverlappingNode( node )
    {
        var closestNode = null;
        var closestDistance = Number.MAX_VALUE;

        var allNodes = graphModel.nodeList();

        for ( var i = 0; i < allNodes.length; i++ )
        {
            var candidateNode = allNodes[i];
            if ( candidateNode !== node )
            {
                var candidateDistance = node.distanceTo( candidateNode ) * graphModel.internalScale();
                if ( candidateDistance < 50 && candidateDistance < closestDistance )
                {
                    closestNode = candidateNode;
                    closestDistance = candidateDistance;
                }
            }
        }
        return closestNode;
    }

    function findClosestOverlappingRolebox( rolebox )
    {
        var closestRolebox = null;
        var closestDistance = Number.MAX_VALUE;

        var allRoleboxes = graphModel.roleboxList();

        for ( var i = 0; i < allRoleboxes.length; i++ )
        {
            var candidateRolebox = allRoleboxes[i];
            if ( candidateRolebox !== rolebox )
            {
                var candidateDistance = rolebox.distanceTo( candidateRolebox ) * graphModel.internalScale();
                if ( candidateDistance < 50 && candidateDistance < closestDistance )
                {
                    closestRolebox = candidateRolebox;
                    closestDistance = candidateDistance;
                }
            }
        }
        return closestRolebox;
    }

    function drag()
    {
        var node = this.__data__.model;
        node.drag(d3.event.dx, d3.event.dy);
        diagram.scaling(gd.scaling.growButDoNotShrink);
        draw();
    }

    function dragRing()
    {
        var node = this.__data__.model;
        if ( !newNode )
        {
            newNode = graphModel.createNode().x( d3.event.x ).y( d3.event.y );
            newRelationship = graphModel.createRelationship( node, newNode, "N2N" );
        }
        var connectionNode = findClosestOverlappingNode( newNode );
        if ( connectionNode )
        {
            newRelationship.end = connectionNode
        } else
        {
            newRelationship.end = newNode;
        }
        node = newNode;
        node.drag(d3.event.dx, d3.event.dy);
        diagram.scaling(gd.scaling.growButDoNotShrink);
        draw();
    }

    function dragNodeRing()
    {
        var node = this.__data__.model;
        if ( !newRolebox )
        {
            newRolebox = graphModel.createRolebox().x( d3.event.x ).y( d3.event.y );
            newRelationship = graphModel.createRelationship( node, newRolebox, "N2RB" );
        }
        var connectionRolebox = findClosestOverlappingRolebox( newRolebox );
        if ( connectionRolebox )
        {
            newRelationship.end = connectionRolebox;
        } else
        {
            newRelationship.end = newRolebox;
        }
        node.dragEnd();
        rolebox = newRolebox;
        rolebox.drag(d3.event.dx, d3.event.dy);
        diagram.scaling(gd.scaling.growButDoNotShrink);
        draw();
    }

    function dragRoleboxRing()
    {
        var rolebox = this.__data__.model;
        if ( !newNode )
        {
            newNode = graphModel.createNode().x( d3.event.x ).y( d3.event.y );
            newRelationship = graphModel.createRelationship( rolebox, newNode, "RB2N" );
        }
        var connectionNode = findClosestOverlappingNode( newNode );
        if ( connectionNode )
        {
            newRelationship.end = connectionNode;
        } else
        {
            newRelationship.end = newNode;
        }
        rolebox.dragEnd();
        node = newNode;
        node.drag(d3.event.dx, d3.event.dy);
        diagram.scaling(gd.scaling.growButDoNotShrink);
        draw();
    }

    function dragEnd()
    {
        if ( newNode )
        {
            newNode.dragEnd();
            if ( newRelationship && newRelationship.end !== newNode )
            {
                graphModel.deleteNode( newNode );
            }
        }
        newNode = null;
        if ( newRolebox )
        {
            newRolebox.dragEnd();
            if ( newRelationship && newRelationship.end !== newRolebox )
            {
                graphModel.deleteRolebox( newRolebox );
            }
        }
        newRolebox = null;
        save( formatMarkup() );
        diagram.scaling(gd.scaling.centerOrScaleDiagramToFitSvgSmooth);
        draw();
    }

    d3.select( "#refresh" ).on( "click", function ()
    {
        graphModel = gd.model();
        graphModel.createNode().x( 0 ).y( 0 );
        save( formatMarkup() );
        graphModel = parseMarkup( localStorage.getItem( "graph-diagram-markup" ) );
        draw();
    } );

    d3.select( "#add_node_button" ).on( "click", function ()
    {
        graphModel.createNode().x( 0 ).y( 0 );
        save( formatMarkup() );
        draw();
    } );

    d3.select( "#add_rolebox_button" ).on( "click", function ()
    {
        graphModel.createRolebox().x( 0 ).y( 0 );
        save( formatMarkup() );
        draw();
    } );

    function onControlEnter(saveChange)
    {
        return function()
        {
            if ( d3.event.ctrlKey && d3.event.keyCode === 13 )
            {
                saveChange();
            }
        }
    }

    function deleteNodeDirect()
    {
        var node = this.__data__.model;
        graphModel.deleteNode(node);
        save( formatMarkup() );
        draw();
    }

    function editNode()
    {
        var editor = d3.select(".pop-up-editor.node");
        appendModalBackdrop();
        editor.classed( "hide", false );

        var node = this.__data__.model;

        var captionField = editor.select("#node_caption");
        captionField.node().value = node.caption() || "";
        captionField.node().select();

        var propertiesField = editor.select("#node_properties");
        propertiesField.node().value = node.properties().list().reduce(function(previous, property) {
            return previous + property.key + ": " + property.value + "\n";
        }, "");

        function saveChange()
        {
            node.caption( captionField.node().value );
            node.properties().clearAll();
            propertiesField.node().value.split("\n").forEach(function(line) {
                var index = line.indexOf(":");
                if (index !== -1) {
                    var key = line.substring(0, index).trim();
                    var value = line.substring(index + 1).trim();
                    if (key.length > 0 && value.length > 0) {
                        node.properties().set(key, value);
                    }
                }
            });
            save( formatMarkup() );
            draw();
            cancelModal();
        }

        function deleteNode()
        {
            graphModel.deleteNode(node);
            save( formatMarkup() );
            draw();
            cancelModal();
        }

        captionField.on("keypress", onControlEnter(saveChange) );
        propertiesField.on("keypress", onControlEnter(saveChange) );

        editor.select("#edit_node_save").on("click", saveChange);
        editor.select("#edit_node_delete").on("click", deleteNode);
    }

	function reverseRelationshipDirect()
	{
		var relationship = this.__data__.model;
        relationship.reverse();
        save( formatMarkup() );
        draw();
    }
    function deleteRelationshipDirect()
    {
        var relationship = this.__data__.model;
        graphModel.deleteRelationship(relationship);
        save( formatMarkup() );
        draw();
	}

    function editRelationship()
    {
        var editor = d3.select(".pop-up-editor.relationship");
        appendModalBackdrop();
        editor.classed( "hide", false );

        var relationship = this.__data__.model;

        var relationshipTypeField = editor.select("#relationship_type");
        relationshipTypeField.node().value = relationship.relationshipType() || "";
        relationshipTypeField.node().select();

        // Highlight current predicate
        editor.select( "#pred_" + relationship.relationshipPredicate() ).property("checked", true);

        // Create sentence
        var entity1 = ( relationship.start.caption() + " " || "[Entity"+relationship.start.id+"] " );
        var entity2 = ( " " + relationship.end.caption() || " [Entity"+relationship.end.id+"]" );
        editor.select("#relation_statement").node().innerHTML = entity1 + (relationship.relationshipType() || "[Role Name]") + entity2 + ".";

        var propertiesField = editor.select("#relationship_properties");
        propertiesField.node().value = relationship.properties().list().reduce(function(previous, property) {
            return previous + property.key + ": " + property.value + "\n";
        }, "");

        function saveChange()
        {
            var predicateField = editor.select('input[name="relationship_predicate"]:checked');
            relationship.relationshipPredicate( predicateField.node().value );
            relationship.relationshipType( relationshipTypeField.node().value );
            relationship.properties().clearAll();
            propertiesField.node().value.split("\n").forEach(function(line) {
                var tokens = line.split(/: */);
                if (tokens.length === 2) {
                    var key = tokens[0].trim();
                    var value = tokens[1].trim();
                    if (key.length > 0 && value.length > 0) {
                        relationship.properties().set(key, value);
                    }
                }
            });
            save( formatMarkup() );
            draw();
            cancelModal();
        }

        function reverseRelationship()
        {
            relationship.reverse();
            save( formatMarkup() );
            draw();
            cancelModal();
        }

        function deleteRelationship()
        {
            graphModel.deleteRelationship(relationship);
            save( formatMarkup() );
            draw();
            cancelModal();
        }

        relationshipTypeField.on("keypress", onControlEnter(saveChange) );
        propertiesField.on("keypress", onControlEnter(saveChange) );

        editor.select("#edit_relationship_save").on("click", saveChange);
        editor.select("#edit_relationship_reverse").on("click", reverseRelationship);
        editor.select("#edit_relationship_delete").on("click", deleteRelationship);
    }

    function formatMarkup()
    {
        var container = d3.select( ".bgmain" ).append( "div" );
        gd.markup.format( graphModel, container );
        var markup = container.node().innerHTML;
        markup = markup
            .replace( /<li/g, "\n  <li" )
            .replace( /<span/g, "\n    <span" )
            .replace( /<\/span><\/li/g, "</span>\n  </li" )
            .replace( /<\/ul/, "\n</ul" );
        container.remove();
        return markup;
    }

    function cancelModal()
    {
        d3.selectAll( ".modal" ).classed( "hide", true );
        d3.selectAll( ".modal-backdrop" ).remove();
    }

    d3.selectAll( ".btn.cancel" ).on( "click", cancelModal );
    d3.selectAll( ".modal" ).on( "keyup", function() { if ( d3.event.keyCode === 27 ) cancelModal(); } );

    function appendModalBackdrop()
    {
        d3.select( ".bgmain" ).append( "div" )
            .attr( "class", "modal-backdrop" )
            .on( "click", cancelModal );
    }

    var exportMarkup = function ()
    {
        appendModalBackdrop();
        d3.select( ".modal.export-markup" ).classed( "hide", false );

        var markup = formatMarkup();
        d3.select( "textarea.code" )
            .attr( "rows", markup.split( "\n" ).length * 2 )
            .node().value = markup;
    };

    function parseMarkup( markup )
    {
        var container = d3.select( "body" ).append( "div" );
        container.node().innerHTML = markup;
        var model = gd.markup.parse( container.select("ul.graph-diagram-markup") );
        container.remove();
        return model;
    }

    var useMarkupFromMarkupEditor = function ()
    {
        var markup = d3.select( "textarea.code" ).node().value;
        graphModel = parseMarkup( markup );
        save( markup );
        draw();
        cancelModal();
    };

    d3.select( "#save_markup" ).on( "click", useMarkupFromMarkupEditor );

    function updateSvgDownloadLink() {
      var rawSvg = new XMLSerializer().serializeToString(d3.select("#canvas svg" ).node());
      d3.select("#downloadSvgButton").attr('href', "data:image/svg+xml;base64," + btoa( rawSvg ));
    }

    var openConsoleWithCypher = function (evt)
    {
        var cypher = d3.select(".export-cypher .modal-body textarea.code").node().value;
        cypher = cypher.replace(/\n  /g," ");
        var url="http://console.neo4j.org"+
            "?init=" + encodeURIComponent(cypher)+
            "&query=" + encodeURIComponent("start n=node(*) return n");
        d3.select( "#open_console" )
                    .attr( "href", url );
        return true;
    };

    d3.select( "#open_console" ).on( "click", openConsoleWithCypher );

    var exportCypher = function ()
    {
        appendModalBackdrop();
        d3.select( ".modal.export-cypher" ).classed( "hide", false );

        var statement = gd.cypher(graphModel);
        d3.select( ".export-cypher .modal-body textarea.code" )
            .attr( "rows", statement.split( "\n" ).length )
            .node().value = statement;
    };

    var exportDelve = function ()
    {
        appendModalBackdrop();
        d3.select( ".modal.export-delve" ).classed( "hide", false );

        var statement = gd.delve(graphModel);
        d3.select( ".export-delve .modal-body textarea.code" )
            .attr( "rows", statement.split( "\n" ).length )
            .node().value = statement;
    };

    var exportDelveSidebar = function ()
    {
        var statement = gd.delve(graphModel);
        d3.select( ".sidenav textarea.code" )
            .attr( "rows", statement.split( "\n" ).length )
            .node().value = statement;
    };


    var chooseStyle = function()
    {
        appendModalBackdrop();
        d3.select( ".modal.choose-style" ).classed( "hide", false );
    };

    d3.selectAll("input[name=styleChoice]" ).on("click", function() {
        //var selectedStyle = d3.selectAll("input[name=styleChoice]" )[0]
        //    .filter(function(input) { return input.checked; })[0].value;
        var selectedStyle = d3.select('input[name="styleChoice"]:checked').node().value ;

        d3.select("link.graph-style")
            .attr("href", "style/" + selectedStyle);
        graphModel = parseMarkup( localStorage.getItem( "graph-diagram-markup" ) );

        save(formatMarkup());
        draw();
        //let wait = async function() { save(formatMarkup()) };
        //wait().then(draw());

    });

    function changeInternalScale() {
        graphModel.internalScale(d3.select("#internalScale").node().value);
        draw();
    }
    d3.select("#internalScale").node().value = graphModel.internalScale();

    d3.select(window).on("resize", draw);
    d3.select("#internalScale" ).on("change", changeInternalScale);
    d3.select( "#exportMarkupButton" ).on( "click", exportMarkup );
	d3.select( "#exportCypherButton" ).on( "click", exportCypher );
    d3.select( "#exportDelveButton" ).on( "click", exportDelve );
    d3.select( "#openSideNav" ).on( "click", exportDelveSidebar );
    d3.select( "#chooseStyleButton" ).on( "click", chooseStyle );
    d3.selectAll( ".modal-dialog" ).on( "click", function ()
    {
        d3.event.stopPropagation();
    } );

    draw();
};