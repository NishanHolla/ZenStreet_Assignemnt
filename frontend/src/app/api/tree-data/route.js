import fs from 'fs';
import path from 'path';
import fetch from 'node-fetch';

const NESTJS_BASE_URL = 'http://localhost:3001'; // Replace with your NestJS server URL

export async function GET(request) {
  try {
    const nestResponse = await fetch(`${NESTJS_BASE_URL}/tree-data`);
    if (!nestResponse.ok) {
      throw new Error('Failed to fetch tree data from NestJS');
    }
    const jsonData = await nestResponse.json();
    return new Response(JSON.stringify(jsonData), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(error.message, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const nestResponse = await fetch(`${NESTJS_BASE_URL}/tree-data`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (!nestResponse.ok) {
      throw new Error('Failed to save tree data to NestJS');
    }
    return new Response('Tree saved successfully!', { status: 200 });
  } catch (error) {
    return new Response(error.message, { status: 500 });
  }
}
