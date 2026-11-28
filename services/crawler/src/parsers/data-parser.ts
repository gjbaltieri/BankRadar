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
                try {
                    const url = new URL(href, baseUrl)
                    if (url.protocol === 'http:' || url.protocol === 'https:') {
                        articles.push({
                            title: titulo,
                            url: new URL(href, baseUrl).toString(),
                            source: baseUrl
                        })
                    }
                } catch (error) {
                    console.error('URL inválida:', href)
                }
            }
        })
    }


    return articles
}