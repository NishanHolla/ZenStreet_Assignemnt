import json
import random

def generate_tree(max_depth):
    def generate_node(node_id):
        return {"name": f"Node_{node_id}", "value": 1, "children": []}

    # Initialize root node
    root = generate_node(1)
    nodes = [(root, 1)]  # Tuple of (node, current_depth)
    node_id = 2  # Start from node ID 2 for children nodes

    while nodes:
        parent, depth = nodes.pop(0)
        if depth >= max_depth:
            continue
        
        # Randomly decide the number of children (0, 1, or 2)
        num_children = random.randint(0, 2)
        for _ in range(num_children):
            if node_id > max_depth:  # Stop if max_depth nodes have been created
                break
            new_node = generate_node(node_id)
            parent["children"].append(new_node)
            nodes.append((new_node, depth + 1))
            node_id += 1

    return root

max_depth = 10000
tree_data = generate_tree(max_depth)

with open('tree-data.json', 'w') as outfile:
    json.dump(tree_data, outfile, indent=2)

print(f'tree-data.json created successfully with a depth of {max_depth} nodes!')