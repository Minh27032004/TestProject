import assert from 'node:assert/strict';
import { once } from 'node:events';
import type { Server } from 'node:http';
import type { AddressInfo } from 'node:net';
import { after, before, test } from 'node:test';
import { app } from '../src/app.js';

let server: Server;
let baseUrl: string;

before(async () => {
  server = app.listen(0, '127.0.0.1');
  await once(server, 'listening');
  baseUrl = `http://127.0.0.1:${(server.address() as AddressInfo).port}`;
});

after(async () => {
  await new Promise<void>((resolve, reject) => {
    server.close((error) => (error ? reject(error) : resolve()));
  });
});

for (const suffix of ['', '?studentId=S02', '?studentId=S02&studentId=S01']) {
  test(`HTTP identity stays S01 for /api/me/assignments${suffix}`, async () => {
    const response = await fetch(`${baseUrl}/api/me/assignments${suffix}`, {
      headers: { 'x-student-id': 'S02', authorization: 'Bearer S02' },
    });
    assert.equal(response.status, 200);
    assert.equal(response.headers.get('cache-control'), 'private, no-store');
    assert.match(response.headers.get('content-type') ?? '', /application\/json/);
    const body = await response.json();
    assert.deepEqual(body.student, { id: 'S01', name: 'Học viên S01' });
    assert.equal(body.referenceTime, '2026-11-11T09:00:00+07:00');
    assert.deepEqual(
      body.items.map((item: { id: string }) => item.id),
      ['A01', 'A02', 'A03', 'A04'],
    );
    assert.ok(!JSON.stringify(body).includes('B01'));
    assert.ok(!JSON.stringify(body).includes('S02'));
  });
}

test('other student URL is not exposed', async () => {
  const response = await fetch(`${baseUrl}/api/students/S02/assignments`);
  assert.equal(response.status, 404);
  assert.deepEqual(await response.json(), { message: 'Không tìm thấy endpoint.' });
});

test('posting a different identity does not expose an assignment endpoint', async () => {
  const response = await fetch(`${baseUrl}/api/me/assignments`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ studentId: 'S02' }),
  });
  assert.equal(response.status, 404);
});
