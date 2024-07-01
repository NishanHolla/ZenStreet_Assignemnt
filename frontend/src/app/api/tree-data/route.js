import fs from 'fs';
import path from 'path';

export async function GET(request) {
  const filePath = path.join(process.cwd(), 'public', 'tree-data.json');
  const jsonData = fs.readFileSync(filePath, 'utf-8');
  return new Response(jsonData, {
    headers: { 'Content-Type': 'application/json' },
  });
}

export async function POST(request) {
  const body = await request.json();
  const filePath = path.join(process.cwd(), 'public', 'tree-data.json');
  fs.writeFileSync(filePath, JSON.stringify(body, null, 2));
  return new Response('Tree saved successfully!', { status: 200 });
}
