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

  // Elements table, or picked elements, will include the details of the selected roll components. (Replacing rollParts)
  // Build defaults if empty
  pickedElements = pickedElements || Object.create(pickedElementsProto);
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
    targetSkill = Object.values(targetActor.data.items).find(skill => skill._id === dataset.skillid);
    console.log("Found Skill Info:");
    console.log(targetSkill);
  }

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

// DIALOG Section
  class RDialog extends Dialog {

    constructor(data, params, options) {
      super(data, options);
      targetActor = params.targetActor;
      pickedElements = params.pickedElements;
    }

    activateListeners(html) {
      super.activateListeners(html);
      html.find('.attr-label').click((event) => {
        console.log("activateListeners called");
        console.log(this);
        // Call Option picker
        pickedElements = Picker.pDialog("attr", targetActor, pickedElements);
        rollDialog.close();
      });
    }

  }

  let html = await renderTemplate("systems/trinity/templates/roll-prompt.html", {roll: rollParts, actor: targetActor, elements: pickedElements});

  console.log("Post html render, pre dialog call, this:");
  console.log(this);

  let rollDialog = new RDialog({
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
          _roll(pickedElements);
          return;
        }
      },
      cancel: {
        icon: "<i class='fas fa-times'></i>",
        label: "Cancel",
        callback: () => {
          return;
        }
      },
      refresh: {
        icon: "<i class='fas fa-times'></i>",
        label: "Refresh",
        callback: () => {
          console.log("Refresh Render This:")
          console.log(this);
          // render(true);
          return trinityRoll(event, targetActor);
        }
      },
    },
    default:"roll",
    callback: html => {
      return;
    }
  }, {targetActor, pickedElements});

  rollDialog.render(true);

// END DIALOG Section

  function _roll(p) {
        let rollFormula = `(((${p.attr.value}+${p.skil.value})d10x${p.expl.value}cs>=${p.succ.value})+(${p.enha.value}+${p.dsca.value}))*${p.nsca.value}`;
        console.log(rollFormula);

        let roll = new Roll(rollFormula);
        let label = dataset.attrname ? `Rolling ${dataset.attrname}` : '';
        roll.roll().toMessage({
          speaker: ChatMessage.getSpeaker({ actor: this.actor }),
          flavor: label
        });
  }



return;

}
