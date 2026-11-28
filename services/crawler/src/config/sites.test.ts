import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { sites } from './sites';

describe('config/sites', () => {
    it('deve conter sites válidos com título, domínio HTTP(S), fontes e seletores não vazios', () => {
        // Arrange / Act / Assert
        assert.ok(sites.length > 0, 'Deve haver ao menos um site configurado');

        for (const site of sites) {
            assert.ok(site.title.trim().length > 0, 'title não pode ser vazio');
            assert.doesNotThrow(() => new URL(site.domain), `domain inválido: ${site.domain}`);
            assert.ok(site.sources.length > 0, `${site.title} deve ter ao menos uma source`);
            assert.ok(site.selectors.length > 0, `${site.title} deve ter ao menos um selector`);

            for (const source of site.sources) {
                const parsed = new URL(source);
                assert.ok(
                    parsed.protocol === 'http:' || parsed.protocol === 'https:',
                    `source deve usar HTTP(S): ${source}`
                );
            }
        }
    });
});
