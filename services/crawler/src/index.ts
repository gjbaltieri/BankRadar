import axios from 'axios'
import { dataParser } from './parsers/data-parser';
import type { Article } from './interface/Article';

import { sites } from './config/sites.js'
import type { Site } from './interface/Site.js';

async function URLdata(sites: Site[]) {
    const articles: Article[] = []

    for (const site of sites) {
        for (const source of site.sources) {
            console.log(source);
            try {
                const { data } = await axios.get(source, {
                    headers: {
                        'User-Agent': 'Mozilla/5.0'
                    }
                },)
                const result = dataParser(data, source)
                articles.push(...result)
            }

            catch (error) {
                console.error(error, 'erro na requisição')
                continue;
            }
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