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

app.get('/library', (req, res) => {
    res.sendFile('library.html', {root: __dirname});
})

app.get('/data', (req, res) => {
    fs.readFile("data.json", "utf8", (err, jsonString) => {
        if (err){
            console.log("File read failed:", err);
            return;
        }

        try{

            const data = JSON.parse(jsonString);
            res.json(Object.values(data))

        }
        catch(err){
            console.log(err)
        }
    })
})

app.post("/data", (req, res) => {

    fs.readFile("data.json", "utf8", (err, jsonString) => {
        if (err){
            console.log("File read failed:", err);
            return;
        }

        var name = req.body.name

        try{

            const data = JSON.parse(jsonString);
            // var name = req.body.name
            var website = Object.values(data[req.body.name])[1]

            var prompts = [
                "Write " + name + "\'s date of birth and death.",
                "Write a list of " + name + "\'s most famous works. Format it as a list.",
                "Write a small summary of " + name + "\'s musical style.",
                "Make a list of" + name + "' biggest contributions to music. Format it as a list."
            ]

            // var answer_matrix = {};
            var answer_matrix = [];

            prompts.forEach(n => {
                
                (async () => {
                    const response = await cohere.generate({
                      model: 'command',
                      prompt: n,
                      max_tokens: 300,
                      temperature: 0.9,
                      k: 0,
                      stop_sequences: [],
                      return_likelihoods: 'NONE'
                    });
                    var generated_answer = response.body.generations[0].text
                    // answer_matrix.answer = generated_answer;
                    //console.log(answer_matrix.answer)
                    answer_matrix.push(generated_answer)

                    generated_info[name] = {
                        "data": answer_matrix
                    }

                    var generation = JSON.stringify(generated_info);
                    fs.writeFileSync('generated_data.json', generation)

                })();
            })

            fs.readFile("generated_data.json", "utf8", (err, jsonString) => {
                if (err){
                    console.log("File read failed:", err);
                    return;
                }
        
                try{
                    const data = JSON.parse(jsonString);
                    console.log(data[name]);
        
        
                }catch(err){
                    console.log(err)
                }
        
            })

        }
        catch(err){
            console.log(err)
        }
    })


})


app.listen(PORT, () => console.log(`server running on PORT ${PORT}`))