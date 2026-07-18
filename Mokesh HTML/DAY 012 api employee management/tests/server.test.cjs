const test = require('node:test');
const assert = require('node:assert/strict');
const { spawn } = require('node:child_process');
const http = require('node:http');
const path = require('node:path');

function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function getJson(url) {
  return new Promise((resolve, reject) => {
    const req = http.get(url, res => {
      let data = '';
      res.on('data', chunk => {
        data += chunk;
      });
      res.on('end', () => {
        resolve({
          status: res.statusCode,
          body: JSON.parse(data),
        });
      });
    });
    req.on('error', reject);
  });
}

async function waitForServer(url) {
  for (let attempt = 0; attempt < 20; attempt += 1) {
    try {
      const response = await getJson(url);
      return response;
    } catch (error) {
      await wait(250);
    }
  }
  throw new Error('Server did not become ready in time');
}

test('GET /api/employees returns employee data without MongoDB', async () => {
  const server = spawn(process.execPath, ['server.cjs'], {
    cwd: path.join(__dirname, '..'),
    stdio: ['ignore', 'pipe', 'pipe'],
  });

  let output = '';
  server.stdout.on('data', chunk => {
    output += chunk.toString();
  });
  server.stderr.on('data', chunk => {
    output += chunk.toString();
  });

  try {
    const response = await waitForServer('http://127.0.0.1:5000/api/employees');
    assert.equal(response.status, 200);
    assert.ok(Array.isArray(response.body));
    assert.ok(response.body.some(emp => emp.id === 'EMP-1001'));
  } finally {
    server.kill('SIGTERM');
    await wait(500);
  }
});
