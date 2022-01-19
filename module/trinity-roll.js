//* Import Functions *//
import { Picker } from "/systems/trinity/module/picker.js";
import { pickedElementsProto } from "/systems/trinity/module/protos.js";

// export async function trinityRoll(event, targetActor, pickedElements) {
export async function trinityRoll(targetActor, pickedElements, event) {

  // Declare variables
  event = event || {};
  const element = event.currentTarget || {};
  const dataset = element.dataset || {};
  var targetAttr = [];
  var targetSkill = [];
//   var allComplications = actor.complications;

  // Elements table, or picked elements, will include the details of the selected roll components. (Replacing rollParts)
  // Build defaults if empty
  if (typeof pickedElements === 'undefined' || pickedElements === null) {
    console.log("Creating default pickedElements");
    pickedElements = {};
    // Object.assign(pickedElements, pickedElementsProto);
    pickedElements = JSON.parse(JSON.stringify(pickedElementsProto));
    console.log(pickedElements);
  }
  // pickedElements = pickedElements || Object.create(pickedElementsProto);
  // Build if Empty


  // Attribute info
  if (typeof dataset.attrname !== 'undefined' && dataset.attrname !== null) {
    targetAttr = Object.values(targetActor.data.data.attributes).find(attribute => attribute.name === dataset.attrname);
    pickedElements.attr = targetAttr;
    console.log("Picked Elements:");
    console.log(pickedElements);
    console.log("Found Attribute Info:");
    console.log(targetAttr);
  }

  // Skill info
  if (typeof dataset.skillid !== 'undefined' && dataset.skillid !== null) {
    console.log(dataset.skillid);
    console.log(targetActor.data.items);
    // targetSkill = Object.values(targetActor.data.items).find(skill => skill._id === dataset.skillid);
    targetSkill = targetActor.data.items.get(dataset.skillid);
    console.log(targetSkill);
    pickedElements.skil.name = targetSkill.name;
    pickedElements.skil.value = targetSkill.data.data.value; // Added .data - Why? Something with v7 to v9 ?
    console.log("Found Skill Info:");
    console.log(targetSkill);
  }

/*
  // Set defaults, and overwriting with data found earlier.   << Move this section to front -- nvrmnd
  let attrPart = targetAttr.value || 0;
  let skilPart = targetSkill.value || 0;
  let dicePart = skilPart+attrPart;
  let explPart = dataset.explode || 10;
  let succPart = dataset.successvalue || 8;
  let enhaPart = dataset.enhancements || 0;
  // narrative scale must be minimum 1
  let nscaPart = dataset.narrascale || 1;
  // measure dramatic scale in difference (i.e. a scale 1 person vs. a scale 1 obstacle is 0)
  let dscaPart = dataset.dramascale || 0;

  var rollParts = {
    attr : attrPart,
    skil : skilPart,
    dice : skilPart+attrPart,
    expl : explPart,
    succ : succPart,
    enha : enhaPart,
    nsca : nscaPart,
    dsca : dscaPart
  };
  */

// DIALOG Section
  class RDialog extends Dialog {

    constructor(data, params, options) {
      super(data, options);
      targetActor = params.targetActor;
      pickedElements = params.pickedElements;
    }

    activateListeners(html) {
      super.activateListeners(html);

      // ATTR Click
      html.find('.attr-label').click((event) => {
        // Call Option picker
        pickedElements = Picker.pDialog("attr", targetActor, pickedElements);
        rollDialog.close();
      });

      // SKIL Click
      html.find('.skil-label').click((event) => {
        // Call Option picker
        pickedElements = Picker.pDialog("skil", targetActor, pickedElements);
        rollDialog.close();
      });

      // ENHA click
      html.find('.enha-label').click((event) => {
        // Call Option picker
        pickedElements = Picker.pDialog("enha", targetActor, pickedElements);
        rollDialog.close();
      });

    }

  }


  // let html = await renderTemplate("systems/trinity/templates/roll-prompt.html", {roll: rollParts, actor: targetActor, elements: pickedElements});
  let html = await renderTemplate("systems/trinity/templates/roll-prompt.html", {actor: targetActor, elements: pickedElements});

  let rollDialog = new RDialog({
    title: "Roll Options",
    id: "rdialog",
    content: html,
    buttons: {
      roll: {
        icon: "<i class='fas fa-redo'></i>",
        label: "Roll",
        callback: () => {
          for (let part of Object.keys(pickedElements)) {
            if (document.getElementById(part)){
              pickedElements[part].value = parseInt(document.getElementById(part).value) || pickedElements[part].value;
              // console.log("Found Part:");
              // console.log(part);
            }
            // console.log("rollParts."+part+":");
            // console.log(rollParts[part]);
          }
          _roll(targetActor, pickedElements);
          pickedElements = {};
          // Object.assign(pickedElements, pickedElementsProto);
          pickedElements = JSON.parse(JSON.stringify(pickedElementsProto));
          return;
        }
      },
      save: {
        icon: "<i class='fas fa-save'></i>",
        label: "Save",
        callback: () => {
          for (let part of Object.keys(pickedElements)) {
            if (document.getElementById(part)){
              pickedElements[part].value = parseInt(document.getElementById(part).value) || pickedElements[part].value;
              // console.log("Found Part:");
              // console.log(part);
            }
            // console.log("rollParts."+part+":");
            // console.log(rollParts[part]);
          }
          // _roll(targetActor, pickedElements);
          pickedElements = {};
          // Object.assign(pickedElements, pickedElementsProto);
          pickedElements = JSON.parse(JSON.stringify(pickedElementsProto));
          let rollName = await Dialog.prompt({
            title: "Enter Saved Roll Name",
            content: "Saved Roll Name"
            });
          targetActor.data.data.savedRolls.push({
            name: rollName,
            elements: pickedElements
            });
          console.log("Saved Roll:", targetActor.data.data.savedRolls);
          return;
        }
      },
      reset: {
        icon: "<i class='fas fa-times'></i>",
        label: "Reset",
        callback: () => {
          console.log("Refresh Roller");
          // render(true);
          console.log("Reset pickedElements, before:", pickedElements);
          pickedElements = {};
          console.log("Reset pickedElements, during:", pickedElements);
          // Object.assign(pickedElements, pickedElementsProto);
          pickedElements = JSON.parse(JSON.stringify(pickedElementsProto));
          console.log("Reset pickedElements, after:", pickedElements);
          event = {};
          return trinityRoll(targetActor, pickedElements, event);
        }
      },
    },
    default:"roll",
    callback: html => {
      pickedElements = {};
      // Object.assign(pickedElements, pickedElementsProto);
      pickedElements = JSON.parse(JSON.stringify(pickedElementsProto));
      return;
    }
  }, {targetActor, pickedElements});

  rollDialog.render(true);

// END DIALOG Section

  function _roll(targetActor, p) {
    // Old Formula, w/ wrong NScale
//    let rollFormula = `(((${p.attr.value}+${p.skil.value})d10x${p.expl.value}cs>=${p.succ.value})+(${p.enha.value}+${p.dsca.value}))*${p.nsca.value}`;

// Complication List
    let compList = "";
    console.log(targetActor);
    for (let comp of targetActor.complications) {
      if (compList.length > 0) {
        compList += "<br/>";
        compList += comp.data.complication.value + " - " + comp.name;
      }
      if (compList.length === 0) {
        compList += `<hr /><div class="small">Character's Complications:</div><div class="small-note">`;
        compList += comp.data.complication.value + " - " + comp.name;
      }
    }
    if (compList.length > 0) {
      compList += "</div>";
    }


    let rollFormula = `((${p.skil.value}+${p.attr.value})d10x>=${p.expl.value}cs>=${p.succ.value})*${p.nsca.value}`;
    let enhaValue = parseInt(p.enha.value) + (parseInt(p.dsca.value) * 2);

    console.log(rollFormula);

    // let roll = new Roll(rollFormula);
    let roll = new game.trinity.TRoll(rollFormula, {}, enhaValue);
    // let label = p.attr.name ? `Rolling ${p.attr.name}` : '';
    let label = [p.skil.name, p.attr.name, p.enha.name].join(' • ')

/** Old Method
    roll.roll().toMessage({
      speaker: ChatMessage.getSpeaker({ actor: targetActor }),
      flavor: label
    });
**/

    async function completeRoll() {
      ChatMessage.create({
        speaker: ChatMessage.getSpeaker({ actor: targetActor }),
        flavor: label,
        content: `${await roll.render()}` + compList
      });
    }

    completeRoll();

  }



return;

}
