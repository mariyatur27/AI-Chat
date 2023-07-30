const PORT = 3000;
const express = require('express')
const cors = require('cors')
const path = require('path')
const axios = require('axios')
const cheerio = require('cheerio')
const app = express()
app.use(cors())

app.use('/static', express.static('src')); 

const cohere = require('cohere-ai');
cohere.init('cV7F8e195ZOqebLM1PiTDiOvUxKyoJtsrCzhbC1e')


// Using the Cohere API
// const text = "The Romanian family was identified as Florin Iordache, 28; his wife, Cristina (Monalisa) Zenaida Iordache, 28; their two-year-old daughter, Evelin; and one-year-old son, Elyen. Both children were Canadian citizens.Oakes was never charged in connection with the ill-fated crossing attempt, but Akwesasne police said in April that investigators believed he was 'connected to the eight deceased victims.'";

// (async () => {
//   const response = await cohere.summarize({
//     text: text,
//   });
//   console.log(response.body.summary);
// })();
// Using the Cohere API

const url = 'https://www.theguardian.com/uk'

axios(url)
    .then(response => {
        const html = response.data
        const $ = cheerio.load(html)
        const articles = []

        $('.dcr-172xcrs', html).each(function() {
            const title = $(this).find('span').text();
            const url = $(this).find('a').attr('href')
            articles.push({
                title,
                url
            })
        })
        console.log(articles)
    }).catch(err => console.log(err))


app.get('/', (req, res) => {
    res.sendFile('index.html', {root: __dirname});
})


app.listen(PORT, () => console.log(`server running on PORT ${PORT}`))