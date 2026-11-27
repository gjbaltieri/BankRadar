import axios from 'axios'
import { dataParser } from './parsers/data-parser.js';
import type { Article } from './interface/Article.js';

const sites = [
    {
        nome: 'InfoMoney',
        url: 'https://www.infomoney.com.br/ultimas-noticias/',
        dominio: 'https://www.infomoney.com.br'
    },
    {
        nome: 'Valor Econômico',
        url: 'https://valor.globo.com/',
        dominio: 'https://valor.globo.com'
    }
];

async function URLdata(sites: any) {
    const articles: Article[] = []
    for (const site of sites) {
        try {
            const { data } = await axios.get(site.url, {
                headers: {
                    'User-Agent': 'Mozilla/5.0'
                }
            },)
            const result = dataParser(data, site.url)
            articles.push(...result)
        }

        catch (error) {
            console.error(error, 'erro na requisição')
            continue;
        }

    }
    return articles
}

async function main() {
    try {
        const articles = await URLdata(sites);
        console.log(articles);
    } catch (error) {
        console.error("Erro ao processar a requisição:", error);
    }
}
await main();