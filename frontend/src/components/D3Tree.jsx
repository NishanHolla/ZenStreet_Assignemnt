import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const D3Tree = ({ initialData }) => {
  const svgRef = useRef();
  const [data, setData] = useState(initialData);
  const [selectedNode, setSelectedNode] = useState(null);

  const width = 1000;
  const height = 800;

  const margin = { top: 20, right: 20, bottom: 20, left: 20 };

  useEffect(() => {
    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const root = d3.hierarchy(data);
    const maxDepth = root.height + 1;
    const treeHeight = maxDepth * 100;
    const treeWidth = 800;

    const treeLayout = d3.tree().size([treeHeight, treeWidth]);
    treeLayout(root);

    const linkData = root.links();
    const nodeData = root.descendants();

    const zoom = d3.zoom()
      .scaleExtent([0.1, 4])
      .on('zoom', (event) => {
        svgGroup.attr('transform', event.transform);
      });

    svg.call(zoom);

    const svgGroup = svg.append('g');

    const simulation = d3.forceSimulation(nodeData)
      .force('link', d3.forceLink(linkData).distance(100))
      .force('charge', d3.forceManyBody().strength(-300))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .on('tick', ticked);

    const links = svgGroup.append('g')
      .attr('class', 'links')
      .selectAll('line')
      .data(linkData)
      .enter().append('line')
      .attr('stroke', '#555')
      .attr('stroke-width', 2);

    const nodes = svgGroup.append('g')
      .attr('class', 'nodes')
      .selectAll('g')
      .data(nodeData)
      .enter().append('g')
      .attr('class', 'node')
      .on('mouseover', handleMouseOver)
      .on('mouseout', handleMouseOut)
      .on('click', handleNodeClick);

    nodes.append('circle')
      .attr('r', 30)
      .style('fill', 'lightblue')
      .style('stroke', 'blue')
      .style('stroke-width', 2);

    nodes.append('text')
      .attr('dy', '.31em')
      .attr('x', 0)
      .attr('text-anchor', 'middle')
      .text(d => d.data.name)
      .style('fill', 'black')
      .style('pointer-events', 'none');

    function ticked() {
      links
        .attr('x1', d => d.source.x)
        .attr('y1', d => d.source.y)
        .attr('x2', d => d.target.x)
        .attr('y2', d => d.target.y);

      nodes
        .attr('transform', d => `translate(${d.x},${d.y})`);
    }

    function handleMouseOver(event, d) {
      d3.select(this).select('circle')
        .transition()
        .duration(300)
        .attr('r', 35);
    }

    function handleMouseOut(event, d) {
      d3.select(this).select('circle')
        .transition()
        .duration(300)
        .attr('r', 30);
    }

    function handleNodeClick(event, d) {
      setSelectedNode({
        data: d.data,
        x: event.pageY - margin.top,
        y: event.pageX - margin.left,
      });
    }
  }, [data]);

  const addNode = () => {
    if (!selectedNode) return;

    const newNode = { name: `Node_${Date.now()}`, value: 1, children: [] };
    const updatedData = { ...data };
    const parentNode = findNodeByName(updatedData, selectedNode.data.name);

    if (parentNode) {
      parentNode.children.push(newNode);
      setData(updatedData);
      toast.success(`Added Node: ${newNode.name}`);
    }
  };

  const deleteNode = () => {
    if (!selectedNode) return;

    const updatedData = { ...data };
    const parentNode = findParentNodeByName(updatedData, selectedNode.data.name);

    if (parentNode) {
      const index = parentNode.children.findIndex(child => child.name === selectedNode.data.name);
      if (index !== -1) {
        const deletedNode = parentNode.children[index];
        parentNode.children.splice(index, 1);
        setData(updatedData);
        setSelectedNode(null);
        toast.warn(`Deleted Node: ${deletedNode.name}`);
      }
    }
  };

  const findNodeByName = (node, name) => {
    if (node.name === name) {
      return node;
    } else if (node.children) {
      let result = null;
      for (let child of node.children) {
        result = findNodeByName(child, name);
        if (result) break;
      }
      return result;
    }
    return null;
  };

  const findParentNodeByName = (node, childName) => {
    if (node.children) {
      for (let child of node.children) {
        if (child.name === childName) {
          return node;
        } else {
          const parent = findParentNodeByName(child, childName);
          if (parent) return parent;
        }
      }
    }
    return null;
  };

  const saveTree = async () => {
    try {
      const response = await fetch('/api/save-tree', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (response.ok) {
        toast.success('Tree saved successfully!');
      } else {
        toast.error('Failed to save tree.');
      }
    } catch (error) {
      toast.error('Error saving tree.');
    }
  };

  const handleSaveChanges = () => {
    saveTree();
  };

  return (
    <div style={{ margin: '20px', display: 'flex', alignItems: 'flex-start' }}>
      <div style={{ flex: '1 1 0', position: 'relative' }}>
        <svg
          ref={svgRef}
          width={width + margin.left + margin.right}
          height={height + margin.top + margin.bottom}
          style={{ border: '1px solid black' }}
        >
          <g transform={`translate(${margin.left},${margin.top})`}></g>
        </svg>
        {selectedNode && (
          <div className="context-menu" style={{ position: 'absolute', top: `${selectedNode.x}px`, left: `${selectedNode.y}px`, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', backgroundColor: 'white', color: 'black', padding: '10px', borderRadius: '5px', boxShadow: '0 2px 5px rgba(0,0,0,0.2)' }}>
            <h3>Selected Node Details:</h3>
            <p><strong>Name:</strong> {selectedNode.data.name}</p>
            <p><strong>Value:</strong> {selectedNode.data.value}</p>
            <button style={{ backgroundColor: 'green', color: 'white', fontWeight: 'bold', marginTop: '10px' }} onClick={addNode}>Add Node</button>
            <button style={{ backgroundColor: 'red', color: 'white', fontWeight: 'bold', marginTop: '5px' }} onClick={deleteNode}>Delete Node</button>
          </div>
        )}
      </div>
      <div style={{ flex: '0 0 auto', marginLeft: '20px' }}>
        <button style={{ backgroundColor: '#007bff', color: 'white', fontWeight: 'bold', padding: '10px 20px', borderRadius: '5px', border: 'none', cursor: 'pointer' }} onClick={handleSaveChanges}>Save Changes</button>
      </div>
      <ToastContainer />
    </div>
  );
};

export default D3Tree;
