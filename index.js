const PORT = 3000;
const express = require('express')
const cors = require('cors')
const path = require('path')
const axios = require('axios')
const cheerio = require('cheerio')
const app = express()
const cohere = require('cohere-ai');
app.use(cors())
app.use('/static', express.static('src')); 
const fs = require('fs');
app.use(express.json());

var data = fs.readFileSync('data.json');
var composers = JSON.parse(data);

var generated_data = fs.readFileSync('generated_data.json');
var generated_info = JSON.parse(generated_data)

cohere.init('cV7F8e195ZOqebLM1PiTDiOvUxKyoJtsrCzhbC1e');

app.get('/', (req, res) => {
    res.sendFile('index.html', {root: __dirname});
})


app.post('/data', (req, res) => {
    try {

        const question = req.body.question;

        (async () => {
            const response = await cohere.generate({
              model: 'command',
              prompt: question,
              max_tokens: 300,
              temperature: 0.9,
              k: 0,
              stop_sequences: [],
              return_likelihoods: 'NONE'
            });

            const answer = response.body.generations[0].text
            
            res.json(answer)
            

          })();

    }catch(err){
        console.log(err)
    }
})

app.post('/generate', (req, res) => {
    try{

        const prompt = req.body.prompt;

        (async () => {
            const response = await cohere.generate({
              model: 'command',
              prompt: prompt,
              max_tokens: 300,
              temperature: 0.9,
              k: 0,
              stop_sequences: [],
              return_likelihoods: 'NONE'
            });

            const question = response.body.generations[0].text
            
            res.json(question)
            

          })();
        

    }catch(err){
        console.log(err)
    }
})


app.listen(PORT, () => console.log(`server running on PORT ${PORT}`))