const Home = () => {
    return (
        <div className="home">
            <h4>Enter secret message here</h4>
            <form>
                <textarea id="secretField" class="btn-block" name="secret" autocomplete="off" placeholder="Secret content goes here..."></textarea>
                <legend class="title">Privacy Options</legend>
                <label class="control-label lighter" for="passphraseField">Password:</label>
                <div class="controls">
                    <input class="phrase" type="text" name="passphrase" id="passphraseField" value="" placeholder="A word or phrase that&#39;s difficult to guess" autocomplete="off" size="20" />
                </div>

                <div class="button2">
                    <button class="btn btn-primary" type="submit" value="save" >Submit Secret</button>
                </div>
            </form>
        </div>
    );
}

export default Home;