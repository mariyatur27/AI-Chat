const PORT = 3000;
const express = require('express')
const cors = require('cors')
const app = express()
const cohere = require('cohere-ai');
app.use(cors())
app.use('/static', express.static('src')); 
app.use(express.json());

require('dotenv').config();
cohere.init(process.env.API_KEY);

app.get('/', (req, res) => {
    res.sendFile('index.html', {root: __dirname});
})

app.get('/warning', (req, res) => {
    res.sendFile('crash.html', {root: __dirname});
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

            try{
                const answer = response.body.generations[0].text
            
                res.json(answer)
            }catch(err){
                console.log(err)
                res.json("0")
            }
            

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

            try {
                const question = response.body.generations[0].text
            
                res.json(question)
            }catch(err){
                console.log(err)
                res.json("0")
            }
            

          })();
        

    }catch(err){
        console.log(err)
    }
})


app.listen(PORT, () => console.log(`server running on PORT ${PORT}`))