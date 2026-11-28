import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { titleFilter } from './bank-filters';
import type { Article } from '../interface/Article';

describe('titleFilter', () => {
    const makeArticle = (title: string, url = 'https://exemplo.com/noticia'): Article => ({
        title,
        url,
        source: 'https://exemplo.com/',
    });

    it('deve manter artigos que contenham palavras-chave de bancos, reguladores ou indicadores', () => {
        // Arrange
        const articles: Article[] = [
            makeArticle('Itaú anuncia novo programa de crédito rural', 'https://exemplo.com/1'),
            makeArticle('Bacen mantém taxa Selic em reunião', 'https://exemplo.com/2'),
            makeArticle('Receita de bolo de cenoura simples', 'https://exemplo.com/3'),
            makeArticle('Inadimplência recua no trimestre', 'https://exemplo.com/4'),
        ];

        // Act
        const result = titleFilter(articles);

        // Assert
        assert.equal(result.length, 3);
        assert.deepEqual(
            result.map((a) => a.url),
            ['https://exemplo.com/1', 'https://exemplo.com/2', 'https://exemplo.com/4']
        );
    });

    it('deve fazer correspondência case-insensitive', () => {
        // Arrange
        const articles: Article[] = [
            makeArticle('NUBANK ATINGE MARCA HISTÓRICA'),
            makeArticle('novas regras do pix entram em vigor'),
        ];

        // Act
        const result = titleFilter(articles);

        // Assert
        assert.equal(result.length, 2);
    });

    it('deve retornar lista vazia quando nenhum artigo corresponde ou entrada é vazia', () => {
        // Arrange
        const unrelated: Article[] = [
            makeArticle('Previsão do tempo para o fim de semana'),
            makeArticle(''),
        ];

        // Act
        const resultUnrelated = titleFilter(unrelated);
        const resultEmpty = titleFilter([]);

        // Assert
        assert.deepEqual(resultUnrelated, []);
        assert.deepEqual(resultEmpty, []);
    });

    it('não deve gerar falso positivo por substring parcial (ex.: "megapixels" contendo "pix")', () => {
        // Arrange
        const articles: Article[] = [
            makeArticle('Novo smartphone traz câmera de 200 megapixels'),
        ];

        // Act
        const result = titleFilter(articles);

        // Assert
        assert.deepEqual(result, []);
    });
});
