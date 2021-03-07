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

//  async _render(force = false, options = {}) {
  async _render(force, options = {}) {
    console.log("RDialog Starts Rendering -- This:");
    console.log(this);
    await super._render(force, options);
//    console.log("RDialog Stops Rendering");
  }

  activateListeners(html) {
    super.activateListeners(html);

    // Attribute Picker v2
    // based on html.find('.rollable').click(this._onRoll.bind(this));
    // maybe we need the bind to hold the this properly
    //html.find('.attr-label').click(this._onElementClick.bind(this));
    //html.find('.attr-label').click(this._onElementClick.bind(this));
    html.find('.attr-label').click((event) => {
      // this.pickedElements = await Picker.pDialog("attr", this.actor, this.pickedElements);
      this.pickedElements.attr.name = "testattr";
      renderTemplate("systems/trinity/templates/roll-prompt.html", {actor: this.actor, elements: this.pickedElements});
      this.render(false);
    });

  }

  async _onElementClick(event) {
    event.preventDefault();
    console.log("Listener, this");
    console.log(this);
    this.render(false);
    this.pickedElements = await Picker.pDialog("attr", this.actor, this.pickedElements);
    console.log("this.pickedElements:");
    console.log(this.pickedElements);
//  this.content = await renderTemplate("systems/trinity/templates/roll-prompt.html", {actor: this.actor, elements: this.pickedElements});
    renderTemplate("systems/trinity/templates/roll-prompt.html", {actor: this.actor, elements: this.pickedElements});
    // test w/ false (should be true though)
    console.log("Render Attempt, w/ log:");
    this._render(false, {log : true, renderContext : "ElementClick Refresh"});
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
            console.log("Refresh Render This:")
            console.log(this);
            this.render(true);
          }
        },
      },
      default:"roll",
      callback: html => {
        resolve();
      }
    }, {targetActor, pickedElements}).render(true, {log : true, renderContext : "RDialog Render (render option)"});
  });
}

//* Export Functions *//
export {RDialog, rollDialog};
