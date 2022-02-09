//* Import Functions *//
import { rollDataTemplate } from "/systems/trinity/module/protos.js";

/**
 * DOCUMENTATION FOR ORIGINAL FormApplication:
 * An abstract pattern for defining an Application responsible for updating some object using an HTML form
 *
 * A few critical assumptions:
 * 1) This application is used to only edit one object at a time
 * 2) The template used contains one (and only one) HTML form as it's outer-most element
 * 3) This abstract layer has no knowledge of what is being updated, so the implementation must define _updateObject
 *
 * @extends {Application}
 * @abstract
 * @interface
 *
 * @param {Object} object                     Some object which is the target data structure to be be updated by the form.
 * @param {FormApplicationOptions} [options]  Additional options which modify the rendering of the sheet.
 */


export class RollForm extends FormApplication {

  // since the main form object is created by the form, rearranging args for easier use
  // constructor(actor={}, options={}, object={}) {
  constructor(actor, options, object) {
    super(object, options);
    console.log("RollForm Constructor this: ", this);
    console.log("RollForm Constructor Actor: ", actor);
    console.log("RollForm Object Pre-Check: ", object);
    if (typeof object === 'undefined' || object === null) {
      // this.object = JSON.parse(JSON.stringify(rollDataTemplate));
      this.object = this._rollDataTemplate();
    } else {
      this.object = object;
    }
    this.actor = actor;
    this.itemList = [];
    console.log("RollForm Object Post-Check this: ", this);
  }

  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      classes: ["trinity", "roll-form"],
      popOut: true,
      template: "systems/trinity/templates/roll/roll-form.html",
      id: "roll-form",
      title: "Roll",
      width: 350
    });
  }
  // height : "100%"

  getData() {
    // Send data to the template
    return {
      actor: this.actor,
      rollData: this.object,
      itemList: this.itemList
    };
  }

  activateListeners(html) {
    super.activateListeners(html);

    html.find('.selector').click(async (event) => {
      console.log("Roll Dialog This:", this);
      console.log("Selector Event:", event);
      console.log("Selector Event ID:", event.currentTarget.id);
      this._getItems(event.currentTarget.id); // Update ItemList
      console.log("itemList:", this.itemList);
      await this._render(true);
      console.log("rendered");
      document.getElementById("overlay").style.display = "block";
      console.log("overlaid");
      // reset height
      this._resetHeight();
    });

    html.find('.back').click((event) => {
      document.getElementById("overlay").style.display = "none";
      // reset height
      this._resetHeight();
    });

    html.find('.roll-button').click((event) => {
      this._roll();
    });

    html.find('.showOptions').click((event) => {
      if (document.getElementById("options").style.display === "grid") {
        document.getElementById("options").style.display = "none";
      } else {
        document.getElementById("options").style.display = "grid";
      }
      // reset height
      this._resetHeight();
    });

    html.find('.select-item').click(async (event) => {
      document.getElementById("overlay").style.display = "none"; // Remove overlay
      const item = this.actor.items.get(event.currentTarget.id);
      var rollData = this.object;
      var note = "";
      var itemValue = item.data.data.flags.isEnhancement ? item.data.data.enhancement.value : item.data.data.value;
      if (item.type === "attribute" && item.data.data.flags.isMain === true) {
        note = item.data.data.arena + "/" + item.data.data.approach;
      } else {
        note = item.data.data.enhancement.relevance;
      }
      if (item.id in rollData.items) {
        rollData.items[item.id].multiplier += 1;
      } else {
        rollData.items[item.id] = {
          value : itemValue,
          name : item.name,
          SourceType : item.type,
          note : note,
          isDice : !item.data.data.flags.isEnhancement,
          multiplier : 1,
          id : item.id
        }
      }
      await this._render(true);
      this._resetHeight();
      console.log("rollData after Selection: ", rollData);
    });

    html.find('.remove').click(async (event) => {
      const itemID = event.currentTarget.id;
      this._removeItem(itemID);
      await this._render(true);
      this._resetHeight();
    });

    html.find('.save').click(async (event) => {
      this._save(this.object, this.actor);
    });

  }

  // Example - not yet used...
  async _updateObject(event, formData) {
    console.log("_updateObject");
    console.log("_updateObject event: ", event);
    console.log("_updateObject formData: ", formData);
    console.log(formData.exampleInput);
  }

  // reset height
  _resetHeight() {
    console.log("_resetHeight this:", this);
    const position = this.position;
    // position.height = "100%";
    // position.height = this.form.clientHeight + 30;
    position.height = "auto";
    this.setPosition(position);
  }

  _getItems(type) {
    this.itemList = [];
    for (let i of this.actor.items) {
      if (i.name === type) { this.itemList.push(i); continue; }
      if (i.type === "attribute" && i.data.data.flags.isMain === false) { continue; }
      if (i.type === type) { this.itemList.push(i); }
      if (type === "enhancement" && i.data.data.flags.isEnhancement === true) { this.itemList.push(i); }
    }
  }

  _removeItem(id) {
    var rollData = this.object;
    delete rollData.items[id];
  }

  _roll() {
    var rollData = this.object;
    let roll = new Roll(rollData.formula);
    roll.toMessage({
      speaker: ChatMessage.getSpeaker({ actor: this.actor }),
      flavor: rollData.flavor
    });
  }

  _rollDataTemplate() {
    return {
      name : "Trinity Roll",
      // id : "",
      get flavor() {
        let text = '<div class="flex-flavor">';
        for (let i of Object.keys(this.items)) {
          if (this.items[i].isDice) {
            text += '<span class="flex-flavor-trait small-trait">';
            text += this.items[i].value + "● " + this.items[i].name; // Expand this for better Flavortext
            text += '</span>';
          }
        }
        for (let i of Object.keys(this.items)) {
          if (!this.items[i].isDice) {
            text += '<span class="flex-flavor-trait small-trait">';
            text += this.items[i].value + "# " + this.items[i].name; // Expand this for better Flavortext
            text += '</span>';
          }
        }
        text += '</div>'
        return text;
      },
      desc : "",
      // formula : "",
      // use Getter to compute this automatically
      get formula() {
        if (!this.items) { return 0; }
        let enhaScale = this.enhaTotal + (this.settings.dsca * 2);
        let rollFormula = `(${this.diceTotal}d10x>=${this.settings.expl}cs>=${this.settings.succ}ae${enhaScale})*${this.settings.nsca}`;
        return rollFormula;
      },
      items : {
        /*
        value
        name
        SourceType
        note
        isDice
        */
      },
      get diceTotal() {
        let total = 0;
        for (let i of Object.keys(this.items)) {
          if (this.items[i].isDice) { total += this.items[i].value * this.items[i].multiplier; }
        }
        return total;
      },
      get enhaTotal() {
        let total = 0;
        for (let i of Object.keys(this.items)) {
          if (!this.items[i].isDice) { total += this.items[i].value * this.items[i].multiplier; }
        }
        return total;
      },
      settings : {
        expl : 10,
        succ : 8,
        nsca : 1, // Narrative Scale (Absolute)
        dsca : 0, // Dramatic Scale (Difference)
        init : false // For Compatibility
      }
    };
  }

  async _save(rollData, targetActor) {
    console.log("_save started");
    let html = await renderTemplate("systems/trinity/templates/save-prompt.html");
    new Dialog({
      title: "Save Roll As",
      content: html,
      default: 'save',
      buttons: {
        save: {
          icon: '<i class="fas fa-check"></i>',
          label: 'Save',
          default: true,
          callback: html => {
            let results = document.getElementById('saveName').value;
            rollData.name = results;
            let uniqueRollNumber = randomID(16);

            let updates = {
              "data.savedRolls": {
                [uniqueRollNumber]: rollData
              }
            };
            game.actors.get(targetActor.id).update(updates);

            ui.notifications.notify(`Saved Roll to ${targetActor.name} as "${results}".`);
            return;
          },
        }
      }
    }).render(true);
  }

}
