import test from 'node:test';
import assert from 'node:assert/strict';
import { registerSchema, loginSchema, googleLoginSchema } from '../src/validators/auth.validator.ts';
import { createEventSchema, updateEventSchema } from '../src/validators/event.validator.ts';

const member = { firstName: '  Marie ', lastName: ' Dupont ', email: ' MARIE@example.com ', password: 'secret-test-123' };
const event = { title: 'Rencontre culturelle', description: 'Une rencontre ouverte à tous.', startAt: '2026-10-10T16:00:00Z', endAt: '2026-10-10T18:00:00Z' };

test('inscription : normalise les coordonnées et ne permet pas de choisir le rôle admin', () => {
 const result = registerSchema.parse({ ...member, role: 'ADMIN' });
 assert.equal(result.firstName, 'Marie');
 assert.equal(result.lastName, 'Dupont');
 assert.equal(result.email, 'marie@example.com');
 assert.equal('role' in result, false);
});
for (const [name, patch] of Object.entries({ 'email invalide': { email: 'invalide' }, 'mot de passe court': { password: '123' }, 'prénom vide': { firstName: ' ' }, 'nom vide': { lastName: ' ' } })) {
 test(`inscription : refuse ${name}`, () => assert.equal(registerSchema.safeParse({ ...member, ...patch }).success, false));
}
test('connexion : accepte et normalise un email valide', () => assert.equal(loginSchema.parse({ email: ' TEST@example.com ', password: 'secret' }).email, 'test@example.com'));
test('connexion : refuse un mot de passe vide', () => assert.equal(loginSchema.safeParse({ email: 'test@example.com', password: '' }).success, false));
test('connexion Google : exige un jeton', () => {
 assert.equal(googleLoginSchema.safeParse({ credential: '' }).success, false);
 assert.equal(googleLoginSchema.safeParse({}).success, false);
});
test('événement : crée un brouillon et convertit les dates', () => {
 const result = createEventSchema.parse(event);
 assert.equal(result.status, 'DRAFT');
 assert.equal(result.startAt.getTime(), Date.parse(event.startAt));
});
test('événement : accepte une date de fin absente', () => assert.equal(createEventSchema.safeParse({ ...event, endAt: undefined }).success, true));
for (const [name, patch] of Object.entries({ 'titre trop court': { title: 'ab' }, 'description trop courte': { description: 'abc' }, 'date invalide': { startAt: 'invalide' }, 'fin antérieure': { endAt: '2026-10-09T16:00:00Z' }, 'fin égale au début': { endAt: event.startAt }, 'capacité nulle': { capacity: 0 }, 'capacité négative': { capacity: -1 }, 'capacité décimale': { capacity: 1.5 }, 'image invalide': { imageUrl: 'invalide' }, 'statut inconnu': { status: 'UNKNOWN' } })) {
 test(`événement : refuse ${name}`, () => assert.equal(createEventSchema.safeParse({ ...event, ...patch }).success, false));
}
test('modification : accepte une modification partielle sans écraser les autres champs', () => assert.deepEqual(updateEventSchema.parse({ title: ' Nouveau titre ' }), { title: 'Nouveau titre' }));
test('modification : interdit une capacité négative', () => assert.equal(updateEventSchema.safeParse({ capacity: -5 }).success, false));
