import { describe, test, expect, vi } from 'vitest';

vi.mock('node:fs', () => ({
	readFileSync: vi.fn()
}));

import { readFileSync } from 'node:fs';

const mockedreadFileSync = vi.mocked(readFileSync);



class MaClasse {
	baz() { return readFileSync('test.txt'); }
};


describe('Test de MaClasse', () => {
	const c = new MaClasse();

	test('Test de baz()', () => {
		mockedreadFileSync.mockReturnValue('contenu fictif du texte');
		expect(c.baz()).toBe('contenu fictif du texte');

	});
});