'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const D3Tree = ({ initialData }) => {
  const svgRef = useRef();
  const [data, setData] = useState(initialData);
  const [selectedNode, setSelectedNode] = useState(null); // Track selected node for context menu

  const width = Infinity;
  const height = 2000;

  const margin = { top: 20, right: 20, bottom: 20, left: 20 }; // Margin values

  useEffect(() => {
    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();
  
    const root = d3.hierarchy(data);
    const maxDepth = root.height + 1;
    const treeHeight = maxDepth * 100; // Adjust this value to change vertical spacing
    const treeWidth = 800; // Adjust this value for the initial width
  
    const treeLayout = d3.tree().size([treeHeight, treeWidth]);
  
    treeLayout(root);
  
    const nodes = svg.selectAll('g.node')
      .data(root.descendants(), d => d.data.name) // Use node name for data binding
      .enter().append('g')
      .attr('class', 'node')
      .attr('transform', d => `translate(${d.y},${d.x})`)
      .on('mouseover', handleMouseOver)
      .on('mouseout', handleMouseOut)
      .on('click', handleNodeClick); // Add click handler to nodes
  
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
  
    const links = svg.selectAll('path.link')
      .data(root.links())
      .enter().append('path')
      .attr('class', 'link')
      .attr('d', d3.linkHorizontal()
        .x(d => d.y)
        .y(d => d.x))
      .attr('fill', 'none')
      .attr('stroke', '#555');
  
    function handleMouseOver(event, d) {
      d3.select(this).select('circle')
        .transition()
        .duration(300)
        .attr('r', 35); // Increase circle radius on hover
    }
  
    function handleMouseOut(event, d) {
      d3.select(this).select('circle')
        .transition()
        .duration(300)
        .attr('r', 30); // Restore circle radius on mouseout
    }
  
    function handleNodeClick(event, d) {
      setSelectedNode(d); // Set the selected node
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
        setSelectedNode(null); // Clear selected node after deletion
        toast.warn(`Deleted Node: ${deletedNode.name}`);
      }
    }
  };

  // Helper function to find a node by its name
  const findNodeByName = (node, name) => {
    if (node.data.name === name) {
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

  // Helper function to find parent node by child name
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

  return (
    <div style={{ margin: '20px', display: 'flex', alignItems: 'flex-start' }}>
      <div style={{ flex: '1 1 0', position: 'relative' }}>
        <svg
          ref={svgRef}
          width={width + margin.left + margin.right}
          height={height + margin.top + margin.bottom}
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
      <ToastContainer />
    </div>
  );
};

export default D3Tree;
