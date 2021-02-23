export class Picker {

  static async pDialog(pickType, targetActor, pickedElements) {
    const html = await renderTemplate("systems/trinity/templates/pickers/roll-prompt.html", {picked: pickedElements, actor: targetActor});
    const pickDialog = await new Promise(resolve => {
        new Dialog({
        title: "Pick Element",
        id: "picker",
        content: html,
        buttons: {
          update: {
            icon: "<i class='fas fa-redo'></i>",
            label: "Update",
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
}

}
