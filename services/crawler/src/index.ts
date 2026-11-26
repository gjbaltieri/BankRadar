import axios from 'axios'
import { dataParser } from './parsers/site-parser.js';

async function URLdata(url: string) {
    try {
        const { data } = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0'
            }
        },)

        console.log(dataParser(data, url))
    } catch (error) {

    }
}

URLdata('https://www.infomoney.com.br/')