import { Picker } from "/systems/trinity/module/picker.js";

export class RDialog extends Dialog {

  constructor(data, params, options) {
    super(data, options);
    this.actor = params.targetActor;
    this.pickedElements = params.pickedElements;
    console.log("Constructor, after actor set: ----------------");
    console.log(this);
  }

  activateListeners(html) {
    super.activateListeners(html);

    // Launch Attribute Picker
    html.find('.attr-label').click(async ev => {
        ev.preventDefault();
        // this.render(false);

        // Somewhat working code: doesn't return properly:
        // let placeholder = await Picker.pDialog("attr", this.actor, this.pickedElements);
        // rollParts = await new Promise(resolve => {resolve(TrinityRollPrompt.tRollPrompt(rollParts, targetActor, pickedElements))});
        // let pickedElements = await new Promise(resolve => {resolve(Picker.pDialog("attr", this.actor, this.pickedElements))});
        let pickedElements = await Picker.pDialog("attr", this.actor, this.pickedElements);
        console.log("pickedElements:");
        console.log(pickedElements);
        this.pickedElements = pickedElements;
        console.log("this.pickedElements:");
        console.log(this.pickedElements);
        // this.pickedElements = await Picker.pDialog("attr", this.actor, this.pickedElements);
        html = await renderTemplate("systems/trinity/templates/roll-prompt.html", {actor: this.actor, elements: this.pickedElements});
        this.render(true);


        //openAttrPicker();
        /*
        this.pickedElements = async function() {
          console.log("Inside call to open picker dialog");
          await new Promise(resolve => (resolve(Picker.pDialog("attr", this.actor, this.pickedElements))));

        };
*/
        console.log(this.pickedElements);
        console.log("Post Picker Dialog Call");


        //this.pickedElements = await new Promise(resolve => {resolve(Picker.pDialog("attr", this.actor, this.pickedElements))});

        this.render(true); // Is this needed?
    });
  }

/* Doesn't work?
  async function openAttrPicker() {
    // Open Attr Picker Dialog
    this.pickedElements = await Picker.pDialog("attr", this.actor, this.pickedElements);
    // Re-Render template
    html = await renderTemplate("systems/trinity/templates/roll-prompt.html", {roll: rollParts, actor: targetActor, elements: pickedElements});
    // Refresh Roll Prompt when done
    this.render(true);
  }
*/
}

export class TrinityRollPrompt {

  static async tRollPrompt(rollParts, targetActor, pickedElements) {

// Open Dialog with received options
//  function renderPrompt () {
//    let newRollParts = rollParts;
//    const actor = this.actor;
    let html = await renderTemplate("systems/trinity/templates/roll-prompt.html", {roll: rollParts, actor: targetActor, elements: pickedElements});
    /*Another hook/data test
    html.getElementById('attr-label').addEventListener("click", ()=> {
      console.log(this);
    });
    */
    const rollDialog = await new Promise(resolve => {
        new RDialog({
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
    }, {targetActor, pickedElements}).render(true);

  });


  /* Test Section, Can I add listeners here?
  Hooks.on('renderDialog', (dialog, html, data, input) => {
  rollDialog.activateListeners(html) {
    html.find(".attr").on('click', event => {
      console.log("Test: Attr Roller Hook");
      console.log(html);
      console.log(data);
      console.log(arg3);
      console.log(arg4)
    });
  };
   End Test Section */
//    }
// return the updated rollParts
    console.log("rollParts, just before return statement:");
    console.log(rollParts);
    console.log("pickedElements, just before return statement:");
    console.log(pickedElements);
    console.log("this, just before return statement:");
    console.log(this);
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
