import React, {useState} from 'react';

function App(){

    const [Home, setHome] = useState("");
    const ValidateText = /^[a-zA-Z0-9_]*$/;

    var password = document.getElementById("passphraseField");

    function genPassword(){
        console.log("youclickedpassbutton");
            var passChars = "0123456789abcdeghijklmnopqrstuvwxyz!@#$%^&*()_+:<>?/ABCDEFGHIJKLMNOPQRSTUVWXYZ";
            var passLength = 10;
            var password ="";

                for (var i = 0; i <= passLength; i++){
                    var randomNumber = Math.floor(Math.random() * passChars.length);
                    password+= passChars.substring(randomNumber, randomNumber +1);
                }
            document.getElementById("passphraseField").value = password;
    }

    function GetInput(){
        console.log("youclickme");
            if (Home===""){
                alert('You must type something');
                }
            else if (!ValidateText.test(Home)){
                alert('Message must not contain special characters');
                }
    }

        return (
            <div className="SecretContent">
                <h4>Enter secret message here</h4>

                <input type="text" id="secretField" class="btn-block" name="secret" autocomplete="off" placeholder='Type your secret here...' onChange={e =>setHome(e.target.value)}/>

             <legend className="title">Privacy Options</legend>

                <div className="controls">
                    <label className="control-label lighter">Password: </label>
                    <input className="phrase" type="text" name="passphrase" id="passphraseField" placeholder="A word or phrase that&#39;s difficult to guess" autocomplete="off" size="20" />
                    <button onClick={genPassword} type="submit" class="" value="save">Generate</button>
                </div>

                <div class="button2">
                    <button onClick={GetInput} class="btn btn-primary" type="submit" value="save" >Submit Secret</button>
                </div>

            </div>

        );

 }

    export default App;
