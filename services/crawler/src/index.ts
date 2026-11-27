import axios from 'axios'
import { dataParser } from './parsers/site-parser.js';
import type { Article } from './interface/Article.js';

const url = "https://www.infomoney.com.br/"

async function URLdata(url: string): Promise<Article[]> {
    try {
        const { data } = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0'
            }
        },)
        return dataParser(data, url)
    } catch (error) {
        throw error;
    }
}

async function main() {
    try {
        const articles = await URLdata(url);
        console.log(articles);
    } catch (error) {
        console.error("Erro ao processar a requisição:", error);
    }
}
await main();