
document.getElementById('name-input').addEventListener('keydown', function(e) {
    if (e.keyCode === 13 || e.key === 'Enter'){
        var name = document.getElementById('name-input').value;
        document.getElementById('name-input').disabled = true;
        let message = document.createElement('h3'); message.innerHTML = "What's up " + name + "! Ask me anything...";
        document.getElementById('main-section').appendChild(message);

        let textarea = document.createElement('textarea'); textarea.classList.add('text-field'); textarea.id = 'question-0';
        textarea.setAttribute('rows', 1); textarea.setAttribute('cols', 50); textarea.setAttribute('placeholder', "When you are done typing, click enter... ")
        document.getElementById('main-section').appendChild(textarea);
        
        textarea.addEventListener('keydown', (e)=> {
            if (e.keyCode === 13 || e.key === 'Enter'){
                processQuestion('question-0');
            }
        })
    }
})

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
            console.log(data)
            var new_id = Number(id[id.length - 1]) + 1
            presentAnswer(data, new_id)
        })
        .catch(error => {
            console.error('Fetch error:', error);
        });
    }

}

const textarea_ids = []

const presentAnswer = (answer, id) => {
    let answer_text = document.createElement('h3'); answer_text.innerHTML = answer; answer_text.classList.add('typed')
    document.getElementById('main-section').appendChild(answer_text);



    let textarea = document.createElement('textarea'); textarea.classList.add('text-field'); textarea.id = 'question-' + id;
    textarea.setAttribute('rows', 1); textarea.setAttribute('cols', 50); textarea.setAttribute('placeholder', "If you wish to continue, type your question, if you wish to stop, type 'n'. When you are done typing, click enter. ")
    document.getElementById('main-section').appendChild(textarea);

    textarea.addEventListener('keydown', (e)=> {
        if (e.keyCode === 13 || e.key === 'Enter'){
            if (document.getElementById('question-' + id).value == 'n'){

                document.getElementById('question-' + id).disabled = true;

                let message = document.createElement('h3'); message.innerHTML = "It was nice talking to you! Bye :)";
                document.getElementById('main-section').appendChild(message);

            }else{
                processQuestion('question-' + id);
            }
        }
    })
}