import type { Article } from "../interface/Article";

const keywords: string[] = [
    //Nomes de bancos
    'Banco do Brasil',
    'Bradesco',
    'Itaú',
    'Santander',
    'Caixa Econômica Federal',
    'BTG Pactual',
    'Nubank',
    'Banco Inter',
    'C6 Bank',
    'Banco Safra',
    'Banco Pan',
    'Banco BMG',
    'Sicredi',
    'Sicoob',

    // Órgãos reguladores
    'Banco Central',
    'Bacen',
    'CMN',
    'CVM',
    'Conselho Monetário Nacional',

    // Crédito e financiamento
    'crédito',
    'empréstimo',
    'financiamento',
    'consignado',
    'cartão de crédito',
    'limite de crédito',
    'crédito imobiliário',
    'crédito rural',

    // Indicadores financeiros
    'juros',
    'taxa Selic',
    'inadimplência',
    'spread bancário',
    'IPCA',
    'inflação',
    'taxa de juros',
    'endividamento',

    // Mercado financeiro
    'instituições financeiras',
    'mercado financeiro',
    'sistema financeiro',
    'fintechs',
    'PIX',
    'open finance',
    'regulação bancária',
    'liquidez bancária',
    'falência bancária',
    'recuperação judicial',

    // Riscos e problemas bancários
    'risco de crédito',
    'provisão para devedores',
    'fraude bancária',
    'intervenção bancária',
    'liquidação extrajudicial',
    'reestruturação financeira']

export function titleFilter(articles: Article[]) {
    const validArticles = articles.filter(articles =>
        keywords.some(keyword =>
            articles.title.toLowerCase().includes(keyword.toLowerCase())

        )

    );
    return validArticles
}