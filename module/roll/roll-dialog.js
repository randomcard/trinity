//* Import Functions *//
import { rollDataTemplate } from "/systems/trinity/module/protos.js";


export async function rollDialog(targetActor, rollData, event, force) {

/*
  event = event || {};
  const element = event.currentTarget || {};
  const dataset = element.dataset || {};
  var targetAttr = [];
  var targetSkill = [];
*/

  let html = await renderTemplate("systems/trinity/templates/roll/roll-dialog.html");

  class TRDialog extends Dialog {

    constructor(data, params, options) {
      super(data, options);
      // targetActor = params.targetActor;
      // pickedElements = params.pickedElements;
    }

    activateListeners(html) {
      super.activateListeners(html);

      html.find('.selector').click((event) => {
        console.log("Roller This:", this);
        document.getElementById("overlay").style.display = "block";
      });

      html.find('.back').click((event) => {
        document.getElementById("overlay").style.display = "none";
      });

      html.find('.showOptions').click((event) => {
        if (document.getElementById("options").style.display === "block") {
          document.getElementById("options").style.display = "none";
        } else {
          document.getElementById("options").style.display = "block";
        }
        this.setPosition();
      });

    }
  }

  new TRDialog({
    title: 'Roll',
    buttons: {},
    content: html
  }, {width: 350, height: "auto"}).render(true);

}


/*
async _testButton(event) {
  let html = await renderTemplate("systems/trinity/templates/roll/roll-dialog.html");
  new Dialog({
    title: 'Test Window',
    buttons: {},
    content: html
  }, {width: 350, height: "auto"}).render(true);
}
*/
