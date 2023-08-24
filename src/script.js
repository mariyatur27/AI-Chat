/**
 * Issues:
 * - Generated questions should not be clicked after the question is answered
 */


document.getElementById('name-input').addEventListener('keydown', function(e) {
    if (e.keyCode === 13 || e.key === 'Enter'){
        var name = document.getElementById('name-input').value;
        document.getElementById('name-input').disabled = true;

        document.getElementById('initial-message').classList.remove('typed')

        let message = document.createElement('h3'); message.innerHTML = "What's up " + name + "! Ask me anything..."; message.classList.add('typed')
        document.getElementById('main-section').appendChild(message); message.id='message-0';

        let textarea = document.createElement('textarea'); textarea.classList.add('text-field'); textarea.id = 'question-0';
        textarea.setAttribute('rows', 1); textarea.setAttribute('cols', 50); textarea.setAttribute('placeholder', "When you are done typing, click enter... ")
        document.getElementById('main-section').appendChild(textarea);

        let generated_question = document.createElement('h5'); generated_question.id = 'generation-0';
        document.getElementById('main-section').appendChild(generated_question);
        generateQuestion('generation-0');
        
        textarea.addEventListener('keydown', (e)=> {
            if (e.keyCode === 13 || e.key === 'Enter'){
                message.classList.remove('typed')
                processQuestion('question-0');
            }
        })
    }
})

const generateQuestion = (id) => {
    var data = {
        prompt: "Type a random question that AI would be able to answer. Just type the question on its own. Do not type the answer"
    }

        fetch("/generate", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(question => {

            if (question == '0'){
                console.log('crash')
                displayWarningMessage();
            }else{
                document.getElementById(id).innerHTML = "Try asking: " + question
                var num_id = Number(id[id.length - 1])

                // Rendering the generated question so that it's functional
                document.getElementById(id).addEventListener('click', () => {
                if (num_id == 0){
                    document.getElementById('message-0').classList.remove('typed')
                }

                useGeneratedQuestion(num_id, question)
            })
            }

        })
        .catch(error => {
            console.error('Fetch error:', error);
        });
}



const useGeneratedQuestion = (id, question) => {
    document.getElementById('question-' + id).value = question;
    processQuestion('question-' + id);

    // document.getElementById('generation-' + id).removeEventListener('click', () => {
    //     useGeneratedQuestion(num_id, question)
    // })
}


const processQuestion = (id) => {

    var question = document.getElementById(id).value;

    //Disable the textarea
    document.getElementById(id).disabled = true;

    var data = {
        question: question
    }

    if (question !== ''){
        fetch("/data", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            if (data == "0"){
                console.log("The site has crashed")
                displayWarningMessage();
            }else{
                var new_id = Number(id[id.length - 1]) + 1
                presentAnswer(data, new_id)
            }
        })
        .catch(error => {
            console.error('Fetch error:', error);
        });
    }

}

const displayWarningMessage = () => {
    location.reload();
    window.location.assign('http://localhost:3000/warning')
}

const presentAnswer = (answer, id) => {
    let answer_text = document.createElement('h3'); answer_text.innerHTML = answer; 
    document.getElementById('main-section').appendChild(answer_text);

    let textarea = document.createElement('textarea'); textarea.classList.add('text-field'); textarea.id = 'question-' + id;
    textarea.setAttribute('rows', 1); textarea.setAttribute('cols', 50); textarea.setAttribute('placeholder', "If you wish to continue, type your question, if you wish to stop, type 'n'. When you are done typing, click enter. ")
    document.getElementById('main-section').appendChild(textarea);

    let generated_question = document.createElement('h5'); generated_question.id = 'generation-' + id;
    document.getElementById('main-section').appendChild(generated_question);
    generateQuestion('generation-' + id);

    textarea.addEventListener('keydown', (e)=> {
        if (e.keyCode === 13 || e.key === 'Enter'){
            if (document.getElementById('question-' + id).value == 'n'){

                document.getElementById('question-' + id).disabled = true;

                let message = document.createElement('h3'); message.innerHTML = "It was nice talking to you! Bye :)"; message.classList.add('typed');
                document.getElementById('main-section').appendChild(message);

                let restart_btn = document.createElement('button'); restart_btn.innerHTML = "Restart"; restart_btn.id = 'restart-btn';
                document.getElementById('main-section').appendChild(restart_btn);

                restart_btn.addEventListener('click', () => {
                    location.reload();
                })

            }else{
                processQuestion('question-' + id);
            }
        }
    })
}

