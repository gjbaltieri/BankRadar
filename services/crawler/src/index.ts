import axios from 'axios'
import { dataParser } from './parsers/data-parser';
import type { Article } from './interface/Article';
import type { Site } from './interface/Site';
import { sites } from './config/sites'

async function URLdata(sites: Site[]) {
    const articles: Article[] = []
    const uniqueArticles: Article[] = []
    for (const site of sites) {
        for (const source of site.sources) {
            try {
                const { data } = await axios.get(source, {
                    headers: {
                        'User-Agent': 'Mozilla/5.0'
                    }
                },)
                const result = dataParser(data, source, site.selectors)
                articles.push(...result.slice(0, 1)) //slice aplicado para facilitar validação


            }
            catch (error) {
                console.error(error, 'erro na requisição')
                continue;
            }
        }

    }

    for (const article of articles) {
        if (!uniqueArticles.some(item => item.url === article.url)) {
            uniqueArticles.push(article)
        }


    }

    return uniqueArticles
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