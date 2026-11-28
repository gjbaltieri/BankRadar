import { sites } from './config/sites'
import { collectArticles } from './collect-articles';


async function main() {
    try {
        const articles = await collectArticles(sites);
        console.log(articles);
    } catch (error) {
        console.error("Erro ao processar a requisição:", error);
    }
}
await main();