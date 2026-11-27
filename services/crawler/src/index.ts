import axios from 'axios'
import { dataParser } from './parsers/site-parser.js';
import type { Article } from './interface/Article.js';

async function URLdata(url: string): Promise<Article[]> {
    try {
        const { data } = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0'
            }
        },)
        return dataParser(data, url)
    } catch (error) {
        console.error("erro ao processar a requisição", error)
        throw error;
    }
}

URLdata('https://www.infomoney.com.br/')