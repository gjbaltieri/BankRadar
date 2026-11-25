import axios from 'axios'
import * as cheerio from 'cheerio'

async function URLdata(url: string) {
    try {
        const { data } = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0'
            }
        },)
        const $ = cheerio.load(data)

        const h1: String[] = []

        $('h2 a, h3 a').each((index, element) => {
            const titulo = $(element).text().trim();
            if (titulo) {
                h1.push(titulo)
            }
        })
        console.log(h1)
    } catch (error) {

    }
}

URLdata('https://www.infomoney.com.br/')