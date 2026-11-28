
import type { Site } from "../interface/Site.js";

export const sites: Site[] = [{
    title: 'InfoMoney',
    domain: 'https://www.infomoney.com.br',
    sources: [
        "https://www.infomoney.com.br/mercados/",
        "https://www.infomoney.com.br/economia/",
        "https://www.infomoney.com.br/ultimas-noticias/",
    ],
    selectors: ['h2 a', 'h3 a']
},

{
    title: 'Valor Econômico',
    domain: 'https://valor.globo.com/',
    sources: ['https://valor.globo.com/financas/', 'https://valor.globo.com/empresas/', 'https://valor.globo.com/ultimas-noticias/'],
    selectors: ['"h2.highlight__title > a.bstn-dedupe-url"']
}]

