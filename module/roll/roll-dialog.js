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

  // Elements table, or picked elements, will include the details of the selected roll components. (Replacing rollParts)
  // Build defaults if empty
  if (typeof rollData === 'undefined' || rollData === null ) {
    console.log("Creating default rollData");
    rollData = {};
    rollData = JSON.parse(JSON.stringify(rollDataTemplate));
    console.log(rollData);
    // -------- Insert Actor's Roll Defaults here -------------
  }

  // Collect Actor Items into Catagories
  var attributes = {};
  var skills = {};
  var quantum = {};
  var powers = {};
  var enhancements = {};
  var itemList = {};

  for (let i of sheetData.items) {
    if (i.type === 'attribute' && i.data.data.flags.isMain) { attributes.push(i); }
    if (i.type === 'skill') { skills.push(i); }
    if (i.type === 'attribute' && i.data.data.flags.isQuantum) { quantum.push(i); }
    if (i.type === 'quantumPower' && i.data.data.flags.isDice) { powers.push(i); }
    if (i.data.data.flags.isEnhancement) { enhancements.push(i); }
  }


  let html = await renderTemplate("systems/trinity/templates/roll/roll-dialog.html", {actor: targetActor, rollData: rollData, itemList: itemList});

  class TRDialog extends Dialog {

    constructor(data, options, params) {
      super(data, options);
      // targetActor = params.targetActor;
      // rollData = params.rollData;
    }

    activateListeners(html) {
      super.activateListeners(html);

      html.find('.selector').click((event) => {
        console.log("Roll Dialog This:", this);
        console.log("Selector Event:", event);
        switch(event.currentTarget.id) {
          case "attributes": itemList = attributes; break;
          case "skills": itemList = skills; break;
          case "quantum": itemList = quantum; break;
          case "powers": itemList = powers; break;
        }
        document.getElementById("overlay").style.display = "block";
      });

      html.find('.back').click((event) => {
        document.getElementById("overlay").style.display = "none";
      });

      html.find('.showOptions').click((event) => {
        if (document.getElementById("options").style.display === "grid") {
          document.getElementById("options").style.display = "none";
        } else {
          document.getElementById("options").style.display = "grid";
        }
        // reset height
        const position = this.position;
        position.height = "auto";
        this.setPosition(position);
      });

    }
  }

// logging
  console.log("Pre-TRDialog: -------------");
  console.log("this", this);
  console.log("targetActor", targetActor);
  console.log("rollData", rollData);

  new TRDialog({
    title: 'Roll',
    buttons: {},
    content: html
  }, {width: 350, height: "auto"}, {targetActor, rollData}).render(true);

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
