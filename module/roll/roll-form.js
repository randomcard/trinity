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

  // constructor(actor={}, options={}, object={}) { // since the main form object is created by the form, rearranging args for easier use
  constructor(actor, options, object) { // since the main form object is created by the form, rearranging args for easier use
    super(object, options);
    console.log("RollForm Constructor");
    console.log("RollForm Constructor Actor: ", this.actor);
    console.log("RollForm Object Pre-Check: ", this.object);
    if (typeof object === 'undefined' || object === null) {
      this.object = JSON.parse(JSON.stringify(rollDataTemplate));
    }
    console.log("RollForm Object Post-Check: ", this.object);
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
