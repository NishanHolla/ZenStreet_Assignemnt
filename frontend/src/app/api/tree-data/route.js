import fs from 'fs';
import path from 'path';

const DATA_FILE_PATH = path.join(process.cwd(), 'public', 'tree-data.json'); // Path to the tree-data.json file in the public directory

export async function GET(request) {
  try {
    const jsonData = fs.readFileSync(DATA_FILE_PATH, 'utf-8');
    return new Response(jsonData, {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(`Failed to read tree data: ${error.message}`, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    fs.writeFileSync(DATA_FILE_PATH, JSON.stringify(body, null, 2), 'utf-8');
    return new Response('Tree saved successfully!', { status: 200 });
  } catch (error) {
    return new Response(`Failed to save tree data: ${error.message}`, { status: 500 });
  }
}
