//* Import Functions *//
import { Picker } from "/systems/trinity/module/picker.js";

class RDialog extends Dialog {

  constructor(data, params, options) {
    super(data, options);
    this.actor = params.targetActor;
    this.pickedElements = params.pickedElements;
  }

  getData(options) {
    const data = super.getData(options);
    return data;
  }

  activateListeners(html) {
    super.activateListeners(html);

    // Attribute Picker v2
    // based on html.find('.rollable').click(this._onRoll.bind(this));
    // maybe we need the bind to hold the this properly
    html.find('.attr-label').click(this._onElementClick.bind(this));

  }

  async _onElementClick(event) {
    event.preventDefault();
    this.render(false);
    console.log("Listener, this");
    console.log(this);
    this.pickedElements = await Picker.pDialog("attr", this.actor, this.pickedElements);
    console.log("this.pickedElements:");
    console.log(this.pickedElements);
    this.content = await renderTemplate("systems/trinity/templates/roll-prompt.html", {actor: this.actor, elements: this.pickedElements});
    this.render(true);
  }

}


function rollDialog(rollParts, targetActor, pickedElements) {
  new RDialog({
    title: "Roll Options",
    id: "rdialog",
    content: {renderTemplate("systems/trinity/templates/roll-prompt.html", {roll: rollParts, actor: targetActor, elements: pickedElements});},
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
        }
      },
      cancel: {
        icon: "<i class='fas fa-times'></i>",
        label: "Cancel",
        callback: () => {
          resolve();
        }
      },
      refresh: {
        icon: "<i class='fas fa-times'></i>",
        label: "Refresh",
        callback: () => {
          this.render(true);
        }
      },
    },
    default:"roll",
    callback: html => {
      resolve();
    }
  }, {targetActor, pickedElements}).render(true);
}

//* Export Functions *//
export {RDialog, rollDialog};
