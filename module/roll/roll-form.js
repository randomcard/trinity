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

  constructor(actor={}, options={}, object={}) { // since the main form object is created by the form, rearranging args for easier use
    super(object={}, options={});
    console.log("RollForm Constructor");
    if (!object) {
      this.object = JSON.parse(JSON.stringify(rollDataTemplate));
    }
    console.log("RollForm Object: ", this.object);
  }

  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      classes: ["trinity", "form", "roll"],
      popOut: true,
      template: "systems/trinity/templates/roll/roll-form.html",
      id: "roll-form",
      title: "Roll",
      width: 350,
      height: "auto"
    });
  }

  getData() {
    // Send data to the template
    return {
      actor: this.actor,
      rollData: this.object
    };
  }

  activateListeners(html) {
    super.activateListeners(html);
  }

  async _updateObject(event, formData) {
    console.log("_updateObject");
    console.log("_updateObject event: ", event);
    console.log("_updateObject formData: ", formData);
    console.log(formData.exampleInput);
  }

}







export async function rollForm(targetActor, rollData, event, force) {

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
  var attributes = [];
  var skills = [];
  var quantum = [];
  var powers = [];
  var enhancements = [];
  var itemList = [];

  for (let i of targetActor.items) {
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

    // ------- New Method of Collapse/Expand Content
    /*
    async _render(force = false, options = {}) {
      this._saveToggleStates();
      await super._render(force, options);
      this._setToggleStates();
    }

    _saveToggleStates() {
      if (this.form === null)
        return;

      const html = $(this.form).parent();

      this.toggleStates = {
        headers : [],
        content : []
      };

      // Headers
      let headerItems = $(html.find(".collapsible"));
      for (let item of headerItems) {
        this.toggleStates.headers.push($(item).hasClass("collapsible-active"));
      }

      // Content
      let contentItems = $(html.find(".collapsible-content"));
      for (let item of contentItems) {
        this.toggleStates.content.push($(item).hasClass("collapsible-content-active"));
      }

      console.log("_saveToggleStates:",this.toggleStates);

    }

    _setToggleStates() {
      if (this.toggleStates) {
        const html = $(this.form).parent();

        // Headers
        let headerItems = $(html.find(".collapsible"));
        for (let i = 0; i < headerItems.length; i++) {
          if (this.toggleStates.headers[i]) {
            $(headerItems[i]).addClass("collapsible-active");
          } else {
            $(headerItems[i]).removeClass("collapsible-active");
          }
        }

        // Content
        let contentItems = $(html.find(".collapsible-content"));
        for (let i = 0; i < contentItems.length; i++) {
          if (this.toggleStates.content[i]) {
            $(contentItems[i]).addClass("collapsible-content-active");
          } else {
            $(contentItems[i]).removeClass("collapsible-content-active");
          }
        }
      }
    }
*/

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
        console.log("itemList:", itemList);
        this._render(true);
        console.log("rendered");
        document.getElementById("overlay").style.display = "block";
        console.log("overlaid");
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
