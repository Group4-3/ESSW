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

    xhr.send(data)

    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) {
        console.log(xhr.status);
        console.log(xhr.responseText);
      }
    }
}