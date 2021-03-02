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

  async _render(force = false, options = {}) {
    // Stuff Before rendering
    await super._render(force, options);
    // Stuff After rendering
  }

  activateListeners(html) {
    super.activateListeners(html);

    // Attribute Picker v2
    // based on html.find('.rollable').click(this._onRoll.bind(this));
    // maybe we need the bind to hold the this properly
    //html.find('.attr-label').click(this._onElementClick.bind(this));
    html.find('.attr-label').click(this._onElementClick.bind(this));

  }

  async _onElementClick(event) {
    event.preventDefault();
    console.log("Listener, this");
    console.log(this);
    await this.render(false);
    this.pickedElements = await Picker.pDialog("attr", this.actor, this.pickedElements);
    console.log("this.pickedElements:");
    console.log(this.pickedElements);
    this.content = await renderTemplate("systems/trinity/templates/roll-prompt.html", {actor: this.actor, elements: this.pickedElements});
    this.render(true);
  }

}


async function rollDialog(rollParts, targetActor, pickedElements) {
  let html = await renderTemplate("systems/trinity/templates/roll-prompt.html", {roll: rollParts, actor: targetActor, elements: pickedElements});
  return new Promise((resolve, reject) => {
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
            return rollParts;
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
            this.render(true);
          }
        },
      },
      default:"roll",
      callback: html => {
        return;
      }
    }, {targetActor, pickedElements}).render(true);
  });
}

//* Export Functions *//
export {RDialog, rollDialog};
