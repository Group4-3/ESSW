window.onload = function() {
    var form = document.getElementById("getSecret");
    form.onsubmit = submit.bind(form);
}

function submit(event) {
    event.preventDefault();

    var idValue = event.target.elements.idField.value
    var passphraseValue = event.target.elements.passphraseField.value


    var xhr = new XMLHttpRequest()
    xhr.open("POST", "http://localhost:3001/api/v1/secret/" + idValue)
    xhr.setRequestHeader("Accept", "application/json")
    xhr.setRequestHeader("Content-Type", "application/json")

    var data = {
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
              window.alert(response.body)
        }
        console.log(xhr.status);
        console.log(xhr.responseText);
      }
    }
}