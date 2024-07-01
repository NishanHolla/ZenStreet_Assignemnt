// app/page.jsx
'use client'

import React, { useEffect, useState } from 'react';
import D3Tree from '../components/D3Tree';

const Page = () => {
  const [treeData, setTreeData] = useState(null);

  useEffect(() => {
    async function fetchData() {
      const response = await fetch('/api/tree-data');
      const data = await response.json();
      setTreeData(data);
    }

    fetchData();
  }, []);

  if (!treeData) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Tree Visualization</h1>
      <D3Tree initialData={treeData} />
    </div>
  );
};

export default Page;