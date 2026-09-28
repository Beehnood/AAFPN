import test from 'node:test';
import assert from 'node:assert/strict';
import type { Response } from 'express';
import type { AuthRequest } from '../src/middlewares/auth.middleware.ts';
import { authorizeRoles } from '../src/middlewares/role.middlewares.ts';

for (const [name, user, expectedStatus, expectedNext] of [
 ['visiteur non connecté', undefined, 401, false],
 ['membre sans droit administrateur', { id: 'member-test', role: 'MEMBER' }, 403, false],
 ['administrateur autorisé', { id: 'admin-test', role: 'ADMIN' }, undefined, true],
] as const) {
 test(`accès administrateur : ${name}`, () => {
  let status: number | undefined;
  let calledNext = false;
  let body: unknown;
  const response = { status(code: number) { status = code; return this; }, json(value: unknown) { body = value; return this; } };
  authorizeRoles('ADMIN')({ user } as AuthRequest, response as Response, () => { calledNext = true; });
  assert.equal(status, expectedStatus);
  assert.equal(calledNext, expectedNext);
  if (!expectedNext) assert.equal((body as { success: boolean }).success, false);
 });
}
