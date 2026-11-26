import * as cheerio from 'cheerio'
import type { Article } from '../interface/Article.js';

export function dataParser(data: string, baseUrl: string): Article[] {
    const $ = cheerio.load(data)

    const articles: Article[] = []

    $('h2 a, h3 a').each((index, element) => {
        const titulo = $(element).text().trim()
        const href = $(element).attr('href')
        if (titulo && href) {
            articles.push({
                title: titulo,
                url: href,
                source: baseUrl
            })
        }
    })
    return articles
}