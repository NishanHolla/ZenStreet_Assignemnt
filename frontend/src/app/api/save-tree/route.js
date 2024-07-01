import fs from 'fs';
import path from 'path';

export async function POST(request) {
  const body = await request.json();
  const filePath = path.join(process.cwd(), 'public', 'tree-data.json');
  fs.writeFileSync(filePath, JSON.stringify(body, null, 2));
  return new Response('Tree saved successfully!', { status: 200 });
}