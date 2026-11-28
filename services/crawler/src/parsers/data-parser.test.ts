import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { dataParser } from './data-parser';

describe('dataParser', () => {
    const baseUrl = 'https://www.infomoney.com.br/mercados/';

    it('deve extrair artigos usando múltiplos seletores e resolver URLs relativas e absolutas', () => {
        // Arrange
        const html = `
            <html>
                <body>
                    <h2><a href="/mercados/itau-lucro-recorde">  Itaú registra lucro recorde  </a></h2>
                    <h3><a href="https://externo.com/bradesco-credito">Bradesco amplia crédito</a></h3>
                </body>
            </html>
        `;

        // Act
        const result = dataParser(html, baseUrl, ['h2 a', 'h3 a']);

        // Assert
        assert.deepEqual(result, [
            {
                title: 'Itaú registra lucro recorde',
                url: 'https://www.infomoney.com.br/mercados/itau-lucro-recorde',
                source: baseUrl,
            },
            {
                title: 'Bradesco amplia crédito',
                url: 'https://externo.com/bradesco-credito',
                source: baseUrl,
            },
        ]);
    });

    it('deve ignorar links sem href ou com título vazio/apenas espaços', () => {
        // Arrange
        const html = `
            <h2><a>Sem href</a></h2>
            <h2><a href="/sem-titulo">   </a></h2>
            <h2><a href="/valido">Nubank lança recurso</a></h2>
        `;

        // Act
        const result = dataParser(html, baseUrl, ['h2 a']);

        // Assert
        assert.equal(result.length, 1);
        assert.equal(result[0]?.title, 'Nubank lança recurso');
    });

    it('deve retornar lista vazia para HTML vazio ou lista de seletores vazia', () => {
        // Arrange
        const html = '<h2><a href="/noticia">Notícia</a></h2>';

        // Act
        const fromEmptyHtml = dataParser('', baseUrl, ['h2 a']);
        const fromEmptySelectors = dataParser(html, baseUrl, []);

        // Assert
        assert.deepEqual(fromEmptyHtml, []);
        assert.deepEqual(fromEmptySelectors, []);
    });

    it('deve ignorar href malformado sem abortar a extração dos demais artigos', () => {
        // Arrange
        const html = `
            <h2><a href="http://[url-invalida">Link quebrado</a></h2>
            <h2><a href="/mercados/selic">Taxa Selic mantida</a></h2>
        `;

        // Act
        const result = dataParser(html, baseUrl, ['h2 a']);

        // Assert
        assert.deepEqual(result, [
            {
                title: 'Taxa Selic mantida',
                url: 'https://www.infomoney.com.br/mercados/selic',
                source: baseUrl,
            },
        ]);
    });

    it('deve ignorar links com esquemas não-HTTP (javascript: e mailto:)', () => {
        // Arrange
        const html = `
            <h2><a href="javascript:void(0)">Ação JS</a></h2>
            <h2><a href="mailto:contato@banco.com">Contato</a></h2>
            <h2><a href="/mercados/bacen">Decisão do Bacen</a></h2>
        `;

        // Act
        const result = dataParser(html, baseUrl, ['h2 a']);

        // Assert
        assert.deepEqual(result, [
            {
                title: 'Decisão do Bacen',
                url: 'https://www.infomoney.com.br/mercados/bacen',
                source: baseUrl,
            },
        ]);
    });
});
