// Load the graph data from the JSON file.
d3.json("graph_data.json").then(data => {
    // Create the SVG container for the graph and set its dimensions.
    var svg = d3.select("body").append("svg")
        .attr("width", window.innerWidth)
        .attr("height", window.innerHeight);

    // Create the graph layout.
    var simulation = d3.forceSimulation(data.nodes)
        .force("link", d3.forceLink(data.links).id(d => d.id))
        .force("charge", d3.forceManyBody())
        .force("center", d3.forceCenter(window.innerWidth / 2, window.innerHeight / 2));

    // Create the graph links.
    var link = svg.append("g")
        .attr("class", "links")
        .selectAll("line")
        .data(data.links)
        .join("line")
        .attr("class", "link");

    // Create the graph nodes.
    var node = svg.append("g")
        .attr("class", "nodes")
        .selectAll("circle")
        .data(data.nodes)
        .join("circle")
        .attr("class", "node")
        .attr("r", 5)
        .call(drag(simulation))
        .on("click", handleNodeClick)
        .on("mouseout", handleNodeMouseout);

    // Update the graph elements' positions after each tick of the simulation.
    simulation.on("tick", () => {
        link
            .attr("x1", d => d.source.x)
            .attr("y1", d => d.source.y)
            .attr("x2", d => d.target.x)
            .attr("y2", d => d.target.y);

        node
            .attr("cx", d => d.x)
            .attr("cy", d => d.y);
    });

    // Enable dragging of nodes.
    function drag(simulation) {
        function dragstarted(event) {
            if (!event.active) simulation.alphaTarget(0.3).restart();
            event.subject.fx = event.subject.x;
            event.subject.fy = event.subject.y;
        }

        function dragged(event) {
            event.subject.fx = event.x;
            event.subject.fy = event.y;
        }

        function dragended(event) {
            if (!event.active) simulation.alphaTarget(0);
            event.subject.fx = null;
            event.subject.fy = null;
        }

        return d3.drag()
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended);
    }

    // Function to handle node click event
    function handleNodeClick(event, d) {
        // Create a subset of the node data containing only the desired properties
        var tooltipData = {
            id: d.id,
            index: d.index
        };

        // Show the tooltip and set its text to the selected properties
        d3.select("#tooltip")
            .style("left", event.pageX + "px")
            .style("top", event.pageY + "px")
            .style("visibility", "visible")
            .text(JSON.stringify(tooltipData));
    }

    // Function to handle node mouseout event
    function handleNodeMouseout() {
        // Hide the tooltip.
        d3.select("#tooltip")
            .style("visibility", "hidden");
    }
});
