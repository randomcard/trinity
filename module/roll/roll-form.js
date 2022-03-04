//* Import Functions *//
// import { rollDataTemplate } from "/systems/trinity/module/protos.js";

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
  constructor(actor, options, object, elementID) {
    super(object, options);
    console.log("RollForm Constructor this: ", this);
    console.log("RollForm Constructor Actor: ", actor);
    console.log("RollForm Object Pre-Check: ", object);
    this.actor = actor;
    // this.rollname = "";
    this.oItemList = [];
    this.saved = false;
    if (typeof object === 'undefined' || object === null) {
      // this.object = JSON.parse(JSON.stringify(rollDataTemplate));
      this.object = this._rollDataTemplate();
      if (typeof elementID !== 'undefined' && elementID !== null) {
        // this._addItem.bind(this, elementID);
        this._addItem(elementID);
      }
    } else {
      // this.object = object;
      this.object = this._rollDataTemplate();
      this.oItemList = Object.assign({}, object.items);
      if (object.id) {this.saved = true;}
      /*
      this.object.name = object.name;
      this.object.desc = object.desc;
      this.object.items = object.items;
      this.object.settings = object.settings;
      this.object.favorite = object.favorite;
      */
      // this.object.name = Object.assign({}, object.name);
      this.object.name = (' ' + object.name).slice(1);
      // this.object.desc = Object.assign({}, object.desc);
      this.object.name = (' ' + object.desc).slice(1);
      this.object.items = Object.assign({}, object.items);
      this.object.settings = Object.assign({}, object.settings);
      this.object.favorite = object.favorite;
      // this.rollname = Object.assign({}, object.name);
    }
    console.log("RollForm Object Post-Check this: ", this);
  }

  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      classes: ["trinity", "roll-form"],
      popOut: true,
      template: "systems/trinity/templates/roll/roll-form.html",
      id: "roll-form",
      title: `Roll`,
      width: 350
    });
  }
  // height : "100%"

  getData() {
    // Send data to the template
    console.log("RollForm getData called");
    // this.rollname = Object.assign({}, this.object.name);
    return {
      actor: this.actor,
      rollData: this.object,
      itemList: this.itemList,
      saved: this.saved
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
      this.close();
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
      // this._addItem.bind(this, event.currentTarget.id);
      this._addItem(event.currentTarget.id);
      await this._render(true);
      this._resetHeight();
    });

    html.find('.remove').click(async (event) => {
      const itemID = event.currentTarget.id;
      this._removeItem(itemID);
      await this._render(true);
      this._resetHeight();
    });

    html.find('.save-as').click(async (event) => {
      this._saveAs(this.object, this.actor);
    });

    html.find('.save').click(async (event) => {
      this._save(this.object, this.actor);
    });

    html.find('.add-custom').click(async (event) => {
      console.log("add-custom Listener, this: ", this);
      console.log("add-custom Listener, this: ", event);
      // this._addItem.bind(this, null, true);
      this._addItem(null, true);
      await this._render(true);
      this._resetHeight();
    });

    html.find('.setting').change(async (event) => {
      this.submit({preventClose: true});
    });

  }

  // Example - not yet used...
  async _updateObject(event, formData) {
    console.log("_updateObject");
    console.log("_updateObject event: ", event);
    console.log("_updateObject formData: ", formData);
    mergeObject(this, formData);
    console.log("_updateObject rollData after merge: ", this);
  }

  // reset height
  _resetHeight() {
    const position = this.position;
    // position.height = "100%";
    // position.height = this.form.clientHeight + 30;
    position.height = "auto";
    this.setPosition(position);
  }

  _getItems(type) {
    this.itemListType = type;
    this.itemList = [];
    for (let i of this.actor.items) {
      if (type === "enhancement" && i.data.data.flags.isEnhancement === true) { this.itemList.push(i); continue; }
      if (type === "attribute" && i.type === "attribute" && i.data.data.flags.isMain === true) { this.itemList.push(i); continue; }
      if (i.name === type) { this.itemList.push(i); continue; }
      if (type !== "attribute" && i.type === type && i.data.data.flags.isEnhancement === false) { this.itemList.push(i); }
    }
  }

  _addItem(id, custom) {
    console.log("_addItem this/args", this, id, custom);
     // var rollData = this.object;
    let itemValue = 0;
    let itemName = "";
    let isDice = true;
    let note = "";
    let rollItemID ="";
    let sourceType = "";
    let isCustom = false;
    let mult = 1;

    if (typeof custom !== "undefined") {
      itemValue = document.getElementById("customValue").value || 0;
      itemName = document.getElementById("customName").value || "Custom Value";
      rollItemID = randomID(16);
      note = "Manually Entered";
      isDice = (this.itemListType === "enhancement") ? false : true;
      sourceType = this.itemListType;
      isCustom = true;
    } else {
      const item = this.actor.items.get(id);
      rollItemID = item.id;
      itemValue = item.data.data.flags.isEnhancement ? item.data.data.enhancement.value : item.data.data.value;
      itemName = item.name;
      isDice = !item.data.data.flags.isEnhancement;
      sourceType = item.type;
      // Note:
      if (item.type === "attribute" && item.data.data.flags.isMain === true) {
        note = item.data.data.arena + "/" + item.data.data.approach;
      } else {
        note = item.data.data.enhancement.relevance;
      }
      // Multiplier:
      if (item.id in this.object.items) {
        mult = this.object.items[rollItemID].multiplier + 1;
      }
    }

    this.object.items[rollItemID] = {
      value : itemValue,
      name : itemName,
      SourceType : sourceType,
      note : note,
      isDice : isDice,
      multiplier : mult,
      id : rollItemID,
      isCustom : isCustom
    }
  }

  _removeItem(id) {
    // var rollData = this.object;
    delete this.object.items[id];
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
      name : "New Roll",
      id : "",
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
        let fail = '';
        if (typeof this.settings.fail !== "undefined" && this.settings.fail > 0) {fail = `df<=${this.settings.fail}`;}
        let rollFormula = `(${this.diceTotal}d10x>=${this.settings.expl}cs>=${this.settings.succ}${fail}ae${enhaScale})*${this.settings.nsca}`;
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
        expl : this.actor.data.data.rollSettings.expl.value,
        succ : this.actor.data.data.rollSettings.succ.value,
        nsca : this.actor.data.data.rollSettings.nsca.value, // Narrative Scale (Absolute)
        dsca : this.actor.data.data.rollSettings.dsca.value, // Dramatic Scale (Difference)
        fail : this.actor.data.data.rollSettings.fail.value, // Fail value, for old-school homebrew
        init : false // For Compatibility
      },
      favorite : false
    };
  }

  async _saveAs(rollData, targetActor) {
    console.log("_saveAs started");
    let html = await renderTemplate("systems/trinity/templates/save-as-prompt.html");
    new Dialog({
      title: "Save Roll As",
      content: html,
      default: 'save',
      buttons: {
        save: {
          icon: '<i class="fas fa-check"></i>',
          label: 'Save As',
          default: true,
          callback: html => {
            let results = document.getElementById('saveName').value;
            let uniqueRollNumber = randomID(16);
            rollData.name = results;
            rollData.id = uniqueRollNumber;

            let updates = {
              "data.savedRolls": {
                [uniqueRollNumber]: rollData
              }
            };
            game.actors.get(targetActor.id).update(updates);
            this.saved = true;

            ui.notifications.notify(`Saved Roll to ${targetActor.name} as "${results}".`);
            return;
          },
        }
      }
    }).render(true);
  }

  async _save(rollData, targetActor) {
    console.log("_save started");
    // let html = await renderTemplate("systems/trinity/templates/save-prompt.html");
    new Dialog({
      title: "Save Roll",
      content: `Over-write existing saved roll <b>${rollData.name}</b>?`,
      default: 'save',
      buttons: {
        save: {
          icon: '<i class="fas fa-check"></i>',
          label: 'Save',
          default: true,
          callback: html => {
            // let results = document.getElementById('saveName').value;
            // let uniqueRollNumber = randomID(16);
            // rollData.name = results;
            // rollData.id = uniqueRollNumber;

            let updates = {
              "data.savedRolls": {
                [rollData.id]: rollData
              }
            };
            game.actors.get(targetActor.id).update(updates);


            ui.notifications.notify(`Saved Roll to ${targetActor.name} as "${rollData.name}".`);
            return;
          },
        },
        cancel: {
          icon: '<i class="fas fa-times"></i>',
          label: 'Cancel',
          default: false,
          callback: html => {
            return;
          }
        }
      }
    }).render(true);
  }

}
