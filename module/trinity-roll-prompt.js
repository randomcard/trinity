export class TrinityRollPrompt {

  static async tRollPrompt(rollParts, targetActor) {

// Open Dialog with received options
//  function renderPrompt () {
//    let newRollParts = rollParts;
    const actor = this.actor;
    const html = await renderTemplate("systems/trinity/templates/roll-prompt.html");
    const d = await new Promise(resolve => {
        new Dialog({
        title: "Roll Options",
        content: html,
        // label: 'testButton',
        buttons: {
          roll: {
            icon: "<i class='fas fa-redo'></i>",
    			  label: "Roll",
    			  callback: () => {
              for (let part of Object.keys(rollParts)) {
                if (document.getElementById(part)){
                  rollParts[part] = parseInt(document.getElementById(part).value) || rollParts[part];
                }
                console.log("rollParts."+part+":");
                console.log(rollParts[part]);
              }
              resolve(rollParts);
    			//	  actionType = "remove";
            }
          },
          cancel: {
            icon: "<i class='fas fa-times'></i>",
            label: "Cancel",
            callback: () => {
              resolve();
          //	  actionType = "remove";
            }
          },
        },
        default:"roll",
        callback: html => {
          resolve();
//            console.log(html, actor);
/*
            let passionName = html[0].querySelector('.newPassion').value
            let passionValue = html[0].querySelector('.newPassionValue').value

            actor.update({
                "data.passions": [...actor.data.passions, [passionName, passionValue]]
*/      }
    }).render(true);
  });
//    }
// return the updated rollParts
    console.log("rollParts, just before return statement:");
    console.log(rollParts);
    return rollParts;
  }

}
