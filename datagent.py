import json
import random

def generate_graph_data(num_nodes, num_links, filename):
    # Generate nodes
    nodes = [{"id": f"Node {i}"} for i in range(num_nodes)]
    
    # Generate links
    links = []
    for _ in range(num_links):
        source = random.choice(nodes)["id"]
        target = random.choice(nodes)["id"]
        if source != target:  # Avoid links from a node to itself
            links.append({"source": source, "target": target})
    
    # Combine nodes and links into one dataset
    data = {"nodes": nodes, "links": links}
    
    # Save the data to a JSON file
    with open(filename, "w") as f:
        json.dump(data, f)

# Use the function to generate a dataset
generate_graph_data(10, 20, "graph_data.json")
