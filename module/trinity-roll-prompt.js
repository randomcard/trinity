export class TrinityRollPrompt {

  static async tRollPrompt(rollParts, targetActor) {

// Open Dialog with received options
//  function renderPrompt () {
//    let newRollParts = rollParts;
    const actor = this.actor;
    const html = await renderTemplate("systems/trinity/templates/roll-prompt.html");
    const d = new Dialog({
        title: "Roll Options",
        content: html,
        // label: 'testButton',
        buttons: {
          roll: {
            icon: "<i class='fas fa-redo'></i>",
    			  label: "Roll",
    			  callback: () => {
              rollParts = getSettings(html, rollParts);
    			//	  actionType = "remove";
            }
          },
          cancel: {
            icon: "<i class='fas fa-times'></i>",
            label: "Cancel",
            callback: () => {
          //    resolve();
          //	  actionType = "remove";
            }
          },
        },
        default:"roll",
        callback: html => {
//            console.log(html, actor);
/*
            let passionName = html[0].querySelector('.newPassion').value
            let passionValue = html[0].querySelector('.newPassionValue').value

            actor.update({
                "data.passions": [...actor.data.passions, [passionName, passionValue]]
*/      }
    }).render(true);
//    }
// return the updated rollParts
    return rollParts;


  }

  static async getSettings(html, rollParts){
    for (let part of rollParts) {
      rollParts[part] = document.getElementByName("attr").value) || rollParts[part];
//      if (html.find('#'+i._id)[0].checked) {
//        iSelect = html.find('#'+i._id)[0].value;
    }
    return rollParts;
  }


}
