import axios from 'axios'
import * as cheerio from 'cheerio'
import type { Article } from './interface/Article.js';

async function URLdata(url: string) {
    try {
        const { data } = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0'
            }
        },)
        const $ = cheerio.load(data)

        const articles: Article[] = []

        $('h2 a, h3 a').each((index, element) => {
            const titulo = $(element).text().trim()
            const href = $(element).attr('href')
            if (titulo && href) {
                articles.push({
                    title: titulo,
                    url: href,
                    source: url
                })
            }
        })
        console.log(articles)
    } catch (error) {

    }
}

URLdata('https://www.infomoney.com.br/')