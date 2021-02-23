export class TrinityRollPrompt extends Dialog {

  /** @override */
  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      classes: ["trinity", "sheet", "dialog"],
      template: "systems/trinity/templates/roll-prompt.html",
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
      },
      default:"roll",
      callback: html => {
        resolve();
      }
    });
  }

  /** @override */
  getData() {
    const data = super.getData();
    data.dtypes = ["String", "Number", "Boolean"];
    return data;
}

  /** @override */
  activateListeners(html) {
    super.activateListeners(html);
    html.find('.clickable').click(this._onRoll.bind(this));
  }

  _onRoll(event) {
    event.preventDefault();
  //  const element = event.currentTarget;
  //  const dataset = element.dataset;
    console.log("new onRoll function from rollprompt2");
    console.log(event);
  //  console.log(element);
  //  console.log(dataset);
  //  ex: TrinityRoll.tRoll(event, this.actor);
  }

} // End of Extend
