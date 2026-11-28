import axios from "axios";
import { titleFilter } from "./filters/bank-filters";
import type { Article } from "./interface/Article";
import type { Site } from "./interface/Site";
import { dataParser } from "./parsers/data-parser";

export async function collectArticles(sites: Site[]) {
    const articles: Article[] = []
    const uniqueArticles: Article[] = []
    for (const site of sites) {
        for (const source of site.sources) {
            try {
                const { data } = await axios.get(source, {
                    timeout: 10_000,
                    responseType: 'text',
                    headers: {
                        'User-Agent': 'Mozilla/5.0'
                    }
                },)
                const results = dataParser(data, source, site.selectors)

                const validArticle = titleFilter(results)

                articles.push(...validArticle)

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
