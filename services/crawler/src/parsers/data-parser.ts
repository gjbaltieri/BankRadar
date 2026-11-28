import * as cheerio from 'cheerio'
import type { Article } from '../interface/Article'

export function dataParser(data: string, baseUrl: string, selectors: string[]): Article[] {
    const $ = cheerio.load(data)
    const articles: Article[] = []

    for (const selector of selectors) {
        $(selector).each((index, element) => {
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