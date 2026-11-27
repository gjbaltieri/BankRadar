import * as cheerio from 'cheerio'
import type { Article } from '../interface/Article.js';

const seletores = [
    'h2 a',
    'h3 a',
    'main a',
    'article a',
    '[class*="headline"] a',
    '[class*="materia"] a'
];

export function dataParser(data: string, baseUrl: string): Article[] {
    const $ = cheerio.load(data)
    const articles: Article[] = []

    for (const seletor of seletores) {
        $(seletor).each((index, element) => {
            const titulo = $(element).text().trim()
            const href = $(element).attr('href')
            if (titulo && href) {
                articles.push({
                    title: titulo,
                    url: new URL(href, baseUrl).toString(),
                    source: baseUrl
                })
            }
        })
    }
    return articles
}