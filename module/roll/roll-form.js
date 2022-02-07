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
      this.object = _rollDataTemplate();
    } else {
      this.object = object;
    }
    this.actor = actor;
    this.itemList = [];
    console.log("RollForm Object Post-Check this: ", this);
  }

  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      classes: ["trinity", "form", "roll"],
      popOut: true,
      template: "systems/trinity/templates/roll/roll-form.html",
      id: "roll-form",
      title: "Roll",
      width: 350,
      height: "100%"
    });
  }

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
      /*
      const position = this.position;
      position.height = "100%";
      this.setPosition(position);
      */
    });

    html.find('.back').click((event) => {
      document.getElementById("overlay").style.display = "none";
      // reset height
      this._resetHeight();
      /*
      const position = this.position;
      position.height = "100%";
      this.setPosition(position);
      */
    });

    html.find('.showOptions').click((event) => {
      if (document.getElementById("options").style.display === "grid") {
        document.getElementById("options").style.display = "none";
      } else {
        document.getElementById("options").style.display = "grid";
      }
      // reset height
      this._resetHeight();
      /*
      const position = this.position;
      position.height = "100%";
      this.setPosition(position);
      */
    });

    html.find('.select-item').click(async (event) => {
      document.getElementById("overlay").style.display = "none"; // Remove overlay
      const item = this.actor.items.get(event.currentTarget.id);
      var rollData = this.object;
      var note = "";
      if (item.type === "attribute" && item.data.data.flags.isMain === true) {
        note = item.data.data.arena + "/" + item.data.data.approach;
      } else {
        note = item.data.data.enhancement.relevance;
      }
      rollData.items[item.id] = {
        value : item.data.data.value,
        name : item.name,
        SourceType : item.type,
        note : note,
        isDice : !item.data.data.flags.isEnhancement
      }
      await this._render(true);
      this._resetHeight();
      console.log("rollData after Selection: ", rollData);
    });

  }

  async _updateObject(event, formData) {
    console.log("_updateObject");
    console.log("_updateObject event: ", event);
    console.log("_updateObject formData: ", formData);
    console.log(formData.exampleInput);
  }

  // reset height
  _resetHeight() {
    const position = this.position;
    position.height = "100%";
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

  _rollDataTemplate() {
    return {
      name : "Trinity Roll",
      // id : "",
      get flavor() {
        let text = "";
        for (let d of Object.keys(this.dice)) {
          text += this.dice[d].value + "●" + this.dice[d].name + " "; // Expand this for better Flavortext
        }
        for (let e of Object.keys(this.enha)) {
          text += "+" + this.enha[e].value + "e " + this.enha[e].name + " "; // Expand this for better Flavortext
        }
        return text;
      },
      desc : "",
      formula : "", // use Getter to compute this automatically
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
        for (let i of Object.keys(this.dice)) {
          if (i.isDice) { total = total + this.items[i].value; }
        }
        return total;
      },
      get enhaTotal() {
        let total = 0;
        for (let i of Object.keys(this.dice)) {
          if (i.!isDice) { total = total + this.items[i].value; }
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

}
