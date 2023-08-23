window.onload = (e) => {
    fetch('http://localhost:3000/data')
    .then(response => response.json())
    .then(data => buildPageBlocks(data)) 
}

let library_section = document.getElementById('library-section');

const buildPageBlocks = (data) => {
    data.forEach(n => {
            
            let container = document.createElement('div'); container.classList.add('composer-container'); container.id = 'container-'.concat(n[0]); container.style.backgroundImage = 'url(' + n[2] + ')';
                let name = document.createElement('h2'); name.innerHTML = n[0];
                container.appendChild(name);
            library_section.appendChild(container);

            container.addEventListener('click', () => {
                retrieveInfo(n[0])
            })

    })
}

const retrieveInfo = (name) => {
    var data = {
        name: name
    }

    fetch("/data", {
        method: "POST",
        headers: {
            "Content-Type":"application/json"
        },
        body: JSON.stringify(data)
    })

    fetch('http://localhost:3000/retrieve')
        .then(response => response.json())
        .then(data => console.log(data))
}
