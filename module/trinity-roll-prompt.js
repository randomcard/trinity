export class TrinityRollPrompt {

  static async tRollPrompt(rollParts, targetActor, pickedElements) {

// Open Dialog with received options
//  function renderPrompt () {
//    let newRollParts = rollParts;
//    const actor = this.actor;
    const html = await renderTemplate("systems/trinity/templates/roll-prompt.html", {roll: rollParts, actor: targetActor, elements: pickedElements});
    const rollDialog = await new Promise(resolve => {
        new Dialog({
        title: "Roll Options",
        id: "rdialog",
        content: html,
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
    /* Test Section, Can I add listeners here? */
    rollDialog.activateListeners(html) {
      html.find(".attr").on('click', event => {
        console.log("Test: Attr Roller Hook");
        console.log(html);
        console.log(data);
        console.log(arg3);
        console.log(arg4)
      });
    };
    /* End Test Section */
  });
//    }
// return the updated rollParts
    console.log("rollParts, just before return statement:");
    console.log(rollParts);
//  Original:
  return rollParts;
//  Test hook:
/*
    Hooks.on('renderDialog', (dialog, html, data, input) => {
      if (dialog.data.id === "rdialog") {
        html.find(".attr").on('click', event => {
          console.log("Test: Attr Roller Hook");
          console.log(dialog);
          console.log(html);
          console.log(data);
          console.log(rollParts);
        });
      }
    });
    rollDialog.render(true);
*/
  }

}
