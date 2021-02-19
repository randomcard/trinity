export class TrinityRollPrompt {

  static async tRollPrompt(rollParts) {

// Open Dialog with received options
//  function renderPrompt () {
//    let newRollParts = rollParts;
    const actor = this.actor;
    const html = await renderTemplate("systems/trinity/templates/roll-prompt.html");
    const d = Dialog.prompt({
        title: "Roll Options",
        content: html,
        label: 'testButton',
        callback: html => {
            console.log(html, actor);
/*
            let passionName = html[0].querySelector('.newPassion').value
            let passionValue = html[0].querySelector('.newPassionValue').value

            actor.update({
                "data.passions": [...actor.data.passions, [passionName, passionValue]]
*/      }
    });
//    }
// return the updated rollParts
    return rollParts;


  }


}
