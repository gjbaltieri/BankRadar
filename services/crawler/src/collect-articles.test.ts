import { describe, it, mock, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import axios from 'axios';
import { collectArticles } from './collect-articles';
import type { Site } from './interface/Site';

describe('collectArticles', () => {
    afterEach(() => {
        mock.restoreAll();
    });

    it('deve coletar, parsear e filtrar artigos bancários de múltiplos sites e fontes', async () => {
        // Arrange
        const sites: Site[] = [
            {
                title: 'Portal A',
                domain: 'https://portala.com.br',
                sources: ['https://portala.com.br/mercados/', 'https://portala.com.br/economia/'],
                selectors: ['h2 a'],
            },
            {
                title: 'Portal B',
                domain: 'https://portalb.com.br',
                sources: ['https://portalb.com.br/financas/'],
                selectors: ['h3 a'],
            },
        ];

        const responses: Record<string, string> = {
            'https://portala.com.br/mercados/': `
                <h2><a href="/noticia/1">Bradesco divulga balanço trimestral</a></h2>
                <h2><a href="/noticia/2">Campeonato de futebol começa hoje</a></h2>
            `,
            'https://portala.com.br/economia/': `
                <h2><a href="/noticia/3">IPCA desacelera em outubro</a></h2>
            `,
            'https://portalb.com.br/financas/': `
                <h3><a href="/materia/4">Banco Central atualiza regras do Open Finance</a></h3>
            `,
        };

        const getMock = mock.method(axios, 'get', async (url: string) => ({
            data: responses[url] ?? '',
        }));

        // Act
        const result = await collectArticles(sites);

        // Assert
        assert.equal(getMock.mock.callCount(), 3);
        const firstCallArgs = getMock.mock.calls[0]?.arguments;
        assert.equal(firstCallArgs?.[0], 'https://portala.com.br/mercados/');
        assert.equal((firstCallArgs?.[1] as { timeout?: number })?.timeout, 10_000);
        assert.equal((firstCallArgs?.[1] as { responseType?: string })?.responseType, 'text');

        assert.deepEqual(result, [
            {
                title: 'Bradesco divulga balanço trimestral',
                url: 'https://portala.com.br/noticia/1',
                source: 'https://portala.com.br/mercados/',
            },
            {
                title: 'IPCA desacelera em outubro',
                url: 'https://portala.com.br/noticia/3',
                source: 'https://portala.com.br/economia/',
            },
            {
                title: 'Banco Central atualiza regras do Open Finance',
                url: 'https://portalb.com.br/materia/4',
                source: 'https://portalb.com.br/financas/',
            },
        ]);
    });

    it('deve remover artigos duplicados com a mesma URL entre fontes diferentes', async () => {
        // Arrange
        const sites: Site[] = [
            {
                title: 'Portal A',
                domain: 'https://portala.com.br',
                sources: ['https://portala.com.br/mercados/', 'https://portala.com.br/ultimas/'],
                selectors: ['h2 a'],
            },
        ];

        mock.method(axios, 'get', async () => ({
            data: '<h2><a href="/materia-repetida">Itaú amplia linha de crédito</a></h2>',
        }));

        // Act
        const result = await collectArticles(sites);

        // Assert
        assert.equal(result.length, 1);
        assert.equal(result[0]?.url, 'https://portala.com.br/materia-repetida');
    });

    it('deve continuar coletando das demais fontes quando uma requisição falhar', async () => {
        // Arrange
        const sites: Site[] = [
            {
                title: 'Portal Instável',
                domain: 'https://instavel.com.br',
                sources: ['https://instavel.com.br/erro/', 'https://instavel.com.br/ok/'],
                selectors: ['h2 a'],
            },
        ];

        const errorLogMock = mock.method(console, 'error', () => {});
        mock.method(axios, 'get', async (url: string) => {
            if (url.endsWith('/erro/')) {
                throw new Error('ECONNRESET');
            }
            return {
                data: '<h2><a href="/santander">Santander reduz juros</a></h2>',
            };
        });

        // Act
        const result = await collectArticles(sites);

        // Assert
        assert.equal(errorLogMock.mock.callCount(), 1);
        assert.equal(result.length, 1);
        assert.equal(result[0]?.title, 'Santander reduz juros');
    });

    it('deve retornar lista vazia quando não houver sites ou fontes configuradas', async () => {
        // Arrange
        const getMock = mock.method(axios, 'get', async () => ({ data: '' }));

        // Act
        const fromEmptySites = await collectArticles([]);
        const fromEmptySources = await collectArticles([
            { title: 'Vazio', domain: 'https://vazio.com', sources: [], selectors: ['h2 a'] },
        ]);

        // Assert
        assert.deepEqual(fromEmptySites, []);
        assert.deepEqual(fromEmptySources, []);
        assert.equal(getMock.mock.callCount(), 0);
    });
});
