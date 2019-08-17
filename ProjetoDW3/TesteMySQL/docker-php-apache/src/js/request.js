const name = document.querySelector('input[type=text]');
const submit = document.querySelector('input[type=submit]');
const helloMessage = document.querySelector('#hello-message');

submit.addEventListener('click', function(event){
    event.preventDefault();

    const url = `../form.php`
    const config = {
        method: "POST",
        headers:{
                "Content-Type": "application/x-www-form-urlencoded",
        },
        body: `name=${name.value}`
    }
    fetch(url, config)
        .then(res => res.json())
        .then(json => loadHello(json))
})

function loadHello(message) {
    helloMessage.innerHTML = message.body
}