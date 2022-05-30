window.onload = function() {
    var form = document.getElementById("createSecret");
    form.onsubmit = submit.bind(form);
}

function submit(event) {
    event.preventDefault();
    var xhr = new XMLHttpRequest()
    xhr.open("POST", "http://localhost:3001/api/v1/secret/submit")
    xhr.setRequestHeader("Accept", "application/json")
    xhr.setRequestHeader("Content-Type", "application/json")

    var secretValue = event.target.elements.secretField.value
    var passphraseValue = event.target.elements.passphraseField.value

    var data = {
      "body": secretValue,
      "passphrase": passphraseValue
    }

    xhr.send(JSON.stringify(data))

    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) {
        if(xhr.status == 400){
            var error = JSON.parse(xhr.responseText)
              window.alert(error.error)
        }
        if(xhr.status == 200){
            var response = JSON.parse(xhr.responseText)
              window.alert(response.id)
        }
        console.log(xhr.status);
        console.log(xhr.responseText);
      }
    }
}