function Viewsecret() {
  const title = 'Ephermeral Secret Sharing Website' 

  return (
    <div className="viewsecret">
      <div className ="things"></div>

      <form>


      <legend class="title">Authentication</legend>
      <label class="control-label lighter" for="passphraseField">Enter ID:</label>
            <div class="controls">
              <input class="phrase" type="text" name="passphrase" id="passphraseField" value="" placeholder="Enter ID here" autocomplete="off" size="20" />
            </div>
      <label class="control-label lighter" for="passphraseField">Password:</label>
            <div class="controls">
              <input class="phrase" type="text" name="passphrase" id="passphraseField" value="" placeholder="Enter password here" autocomplete="off" size="20" />
            </div>

      <div class="button2">
      <button class="btn-block2" type="submit" value="save" >View Secret*</button>
      </div>
      </form>
    </div>
  );
}

export default Viewsecret;