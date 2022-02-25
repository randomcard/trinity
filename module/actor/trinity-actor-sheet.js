/**
 * Extend the basic ActorSheet with some very simple modifications
 * @extends {ActorSheet}
 */

//trinity roll 1
// import { TrinityRoll } from "/systems/trinity/module/trinity-roll.js";

// trinity roll 2
// import { trinityRoll } from "/systems/trinity/module/trinity-roll.js";
// import { rollDialog } from "/systems/trinity/module/roll/roll-dialog.js";
import { RollForm } from "/systems/trinity/module/roll/roll-form.js";



export class TrinityActorSheet extends ActorSheet {

  constructor(actor, options) {
    super(actor, options);
    this.options.collapsedSections = [];
    this.options.collapsedHeaders = [];
    this.options.collapsedContent = [];

  }

// ------- New Method of Collapse/Expand Content

  async _render(force = false, options = {}) {
    console.log("_render Called");
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
      content : [],
      chipContent : [],
      hiddenContent : []
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

    // Other uses of the hidden class
    let hiddenContentItems = $(html.find(".can-hide"));
    for (let item of hiddenContentItems) {
      this.toggleStates.hiddenContent.push($(item).hasClass("hidden"));
    }

    // Chip-Content
    /*
    let chipItems = $(html.find(".chip-content"));
    for (let item of chipItems) {
      this.toggleStates.chipContent.push($(item).hasClass("chip-hidden"));
    }
    */


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

      // Other uses of the hidden class
      let hiddenContentItems = $(html.find(".can-hide"));
      for (let i = 0; i < hiddenContentItems.length; i++) {
        if (this.toggleStates.hiddenContent[i]) {
          $(hiddenContentItems[i]).addClass("hidden");
        } else {
          $(hiddenContentItems[i]).removeClass("hidden");
        }
      }


      // Chip-Content
      /*
      let chipItems = $(html.find(".chip-content"));
      for (let i = 0; i < chipItems.length; i++) {
        if (this.toggleStates.content[i]) {
          $(chipItems[i]).addClass("chip-hidden");
        } else {
          $(chipItems[i]).removeClass("chip-hidden");
        }
      }
      */

    }

    console.log("_setToggleStates:",this.toggleStates);
  }

// ------ Method section End

  /** @override */
  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      classes: ["trinity", "sheet", "actor"],
      template: "systems/trinity/templates/actor/trinity-actor-sheet.html",
      width: 600,
      height: 600,
      tabs: [{ navSelector: ".sheet-tabs", contentSelector: ".sheet-body", initial: "description" }]
    });
  }

  /* -------------------------------------------- */

  /** @override */
  get template() {
    const path = "systems/trinity/templates/actor";

    if (this.actor.data.type == 'TrinityCharacter') {
      return `${path}/trinity-actor-sheet.html`;
    }
    if (this.actor.data.type == 'TrinityNPC') {
      return `${path}/trinity-actor-sheet-npc.html`;
    }
  }

  /** @override */
  getData() {
    const data = super.getData();
    data.dtypes = ["String", "Number", "Boolean"];
    this._prepareTrinityCharacterItems(data);
    console.log("getData -----", data);
    return data;
  }


  /**
   * Organize and classify Items for TrinityCharacter sheets.
   *
   * @param {Object} actorData The actor to prepare.
   *
   * @return {undefined}
   */
  _prepareTrinityCharacterItems(sheetData) {
    const actorData = sheetData.actor;

    // Initialize containers.
    const gear = [];
    const weapons = [];
    const armors = [];
    const vehicles = [];
    const edges = [];
    const skills = [];
    const specialties = [];
    const paths = [];
    const complications = [];
    const conditions = [];
    const stunts = [];
    const gifts = [];
    const tricks = [];
    const contacts = [];
    const bonds = [];
    const enhancements = [];
    const allItems = [];
    const healthBoxes = {};
    const initRolls = [];
    const unflaggedEquipment = [];
    const modes = [];
    const quantumPowers = [];
    const attributes = [];
    const facets = [];
    const psi = [];
    const quantum = [];
    const miscAttributes = [];


    for (let hb of Object.keys(this.actor.data.data.healthboxes)) {
      // console.log("Heathbox Logging - hb:", hb);
      let injuries = Object.keys(this.actor.data.items.filter(h => h.data.data.flags.isInjury && (h.data.data.injury.value === this.actor.data.data.healthboxes[hb].conditionLevel))).length;
      //console.log("Heathbox Logging - injuries:", injuries);
      // add if - add the property if not already in healthboxes
      if (typeof healthBoxes[hb] === 'undefined' || healthBoxes[hb] === null) {
        // console.log("Heathbox Logging - check to add");
        healthBoxes[hb] = {};
        // console.log("Heathbox Logging - Added to healthBoxes:", healthBoxes);
        healthBoxes[hb].name = this.actor.data.data.healthboxes[hb].name;
        // healthBoxes[hb].push(this.actor.data.data.healthboxes[hb].name);
      }
      if ((this.actor.data.data.healthboxes[hb].value > 0) || (injuries > 0)) {
        // console.log("Heathbox Logging - add injuries");
        if (injuries <= this.actor.data.data.healthboxes[hb].value) {
          healthBoxes[hb].filled = injuries;
          healthBoxes[hb].empty = this.actor.data.data.healthboxes[hb].value - healthBoxes[hb].filled;
          healthBoxes[hb].extra = 0;
        } else {
          healthBoxes[hb].extra = injuries - this.actor.data.data.healthboxes[hb].value;
          healthBoxes[hb].filled = injuries - healthBoxes[hb].extra;
          healthBoxes[hb].empty = 0;
        }
      } else {
        // add if - remove value if there are no injuries or healthboxes
        if (typeof healthBoxes[hb] !== 'undefined' && healthBoxes[hb] !== null) {
          // console.log("Heathbox Logging - remove category if no injuries or healthboxes");
          delete healthBoxes[hb];
        }
      }
    }

    // Identify Saved Rolls w/ Initiative Flagged
    for (let sRoll of Object.keys(this.actor.data.data.savedRolls)) {
      // IF check for compatibility w/ new savedRolls styles
      if (typeof this.actor.data.data.savedRolls[sRoll].elements !== 'undefined') {
        if (typeof this.actor.data.data.savedRolls[sRoll].elements.init !== 'undefined' && this.actor.data.data.savedRolls[sRoll].elements.init !== null) {
          if (this.actor.data.data.savedRolls[sRoll].elements.init.value) {
            initRolls.push(sRoll);
          }
        }
      }
    }

    // Check that Default Initiative Roll is still valid
    if (this.actor.data.data.initiativeRollID !== "") {
      if(typeof this.actor.data.data.savedRolls[this.actor.data.data.initiativeRollID] === 'undefined') {
        this.actor.data.data.initiativeRollID = "";
      }
    }

    // Iterate through items, allocating to containers
    for (let i of sheetData.items) {
      let item = i.data;
      i.img = i.img || DEFAULT_TOKEN;

      // "item" sub-types - Gear / Weapon / Armor / Vehicle
      if ((i.type === 'item' || i.type === 'equipment') && i.data.flags.isGear === true) { gear.push(i); }
      if ((i.type === 'item' || i.type === 'equipment') && i.data.flags.isWeapon === true) { weapons.push(i); }
      if ((i.type === 'item' || i.type === 'equipment') && i.data.flags.isArmor === true) { armors.push(i); }
      if ((i.type === 'item' || i.type === 'equipment') && i.data.flags.isVehicle === true) { vehicles.push(i); }
      unflaggedEquipment
      if ((i.type === 'item' || i.type === 'equipment')
        && i.data.flags.isGear !== true
        && i.data.flags.isWeapon !== true
        && i.data.flags.isArmor !== true
        && i.data.flags.isVehicle !== true) { unflaggedEquipment.push(i); }

      // Other item types
      if (i.type === 'edge') { edges.push(i); }
      if (i.type === 'skill') { skills.push(i); }
      skills.sort((a, b) => a.name.localeCompare(b.name));
      if (i.type === 'specialty') { specialties.push(i); }
      if (i.type === 'path') { paths.push(i); }
      if (i.data.flags.isComplication === true) { complications.push(i); }
      if (i.data.flags.isEnhancement === true) { enhancements.push(i); }
      if (i.type === 'stunt') { stunts.push(i); }
      if (i.type === 'gift') { gifts.push(i); }
      if (i.type === 'trick') { tricks.push(i); }
      if (i.type === 'condition') { conditions.push(i); }
      if (i.type === 'contact') { contacts.push(i); }
      if (i.type === 'bond') { bonds.push(i); }
      if (i.type === 'mode') { modes.push(i); }
      if (i.type === 'quantumPower') { quantumPowers.push(i); }
      if (i.type === 'attribute') {
        if (i.data.flags.isMain) {
          if (typeof i.data.sortNum === 'undefined' || i.data.sortNum === null) { i.data.sortNum = 0; }
          attributes.push(i);
          attributes.sort(function(a, b) {
            return a.data.sortNum - b.data.sortNum;
          });
        } else if (i.data.flags.isFacet) {
          if (typeof i.data.sortNum === 'undefined' || i.data.sortNum === null) { i.data.sortNum = 0; }
          facets.push(i);
          facets.sort(function(a, b) {
            return a.data.sortNum - b.data.sortNum;
          });
        } else if (i.data.flags.isPsi) {
          if (typeof i.data.sortNum === 'undefined' || i.data.sortNum === null) { i.data.sortNum = 0; }
          psi.push(i);
          psi.sort(function(a, b) {
            return a.data.sortNum - b.data.sortNum;
          });
        } else if (i.data.data.isQuantum) {
          if (typeof i.data.sortNum === 'undefined' || i.data.sortNum === null) { i.data.sortNum = 0; }
          quantum.push(i);
          quantum.sort(function(a, b) {
            return a.data.sortNum - b.data.sortNum;
          });
        } else {
          if (typeof i.data.sortNum === 'undefined' || i.data.sortNum === null) { i.data.sortNum = 0; }
          miscAttributes.push(i);
          miscAttributes.sort(function(a, b) {
            return a.data.sortNum - b.data.sortNum;
          });
        }
      }
      allItems.push(i);

    }

    // Assign and return
    actorData.gear = gear;
    actorData.weapons = weapons;
    actorData.armors = armors;
    actorData.vehicles = vehicles;
    actorData.edges = edges;
    actorData.skills = skills;
    actorData.specialties = specialties;
    actorData.paths = paths;
    actorData.complications = complications;
    actorData.enhancements = enhancements;
    actorData.conditions = conditions;
    actorData.stunts = stunts;
    actorData.gifts = gifts;
    actorData.tricks = tricks;
    actorData.contacts = contacts;
    actorData.bonds = bonds;
    actorData.healthBoxes = healthBoxes;
    actorData.allItems = allItems;
    actorData.initRolls = initRolls;
    actorData.unflaggedEquipment = unflaggedEquipment;
    actorData.modes = modes;
    actorData.quantumPowers = quantumPowers;
    actorData.attributes = attributes;
    actorData.facets = facets;
    actorData.psi = psi;
    actorData.quantum = quantum;
    actorData.miscAttributes = actorData;


    if (typeof actorData.allItemsFilter === 'undefined') {
      actorData.allItemsFilter = "";
      console.log("Set/Reset allItemsFilter to empty.")
    }


  }

  /* -------------------------------------------- */

  /** @override */
  activateListeners(html) {
    super.activateListeners(html);

    // Everything below here is only needed if the sheet is editable
    if (!this.options.editable) return;

    html.find('.edit-button').click(ev => {
      html.find('.edit-button').each((i, editButton) => {
        editButton.classList.toggle("hidden");
      });
      html.find('.edit-area').each((i, editArea) => {
        editArea.classList.toggle("hidden");
        editArea.previousElementSibling.classList.toggle("hidden");
      });
      this._saveToggleStates();
    });

    html.find('.collapsible').click(event => {
      const collapsibleElement = event.currentTarget;
      /*
      console.log("Collapsible Listener, HTML.find style. event:", event);
      console.log("Collapsible Listener, HTML.find style. this:", this);
      console.log("Collapsible Listener, HTML.find style. collapsibleElement:", collapsibleElement);
      */
      collapsibleElement.classList.toggle("collapsible-active");
      collapsibleElement.nextElementSibling.classList.toggle("collapsible-content-active");
      this._saveToggleStates();
    });

    html.find('.chip-control').click(event => {
      // const collapsibleElement = event.currentTarget;
      event.currentTarget.previousElementSibling.classList.toggle("chip-hidden");
      event.currentTarget.previousElementSibling.previousElementSibling.classList.toggle("chip-hidden");
      /*
      console.log("Collapsible Listener, HTML.find style. event:", event);
      console.log("Collapsible Listener, HTML.find style. this:", this);
      console.log("Collapsible Listener, HTML.find style. collapsibleElement:", collapsibleElement);
      */
      //collapsibleElement.classList.toggle("collapsible-active");
      //collapsibleElement.nextElementSibling.classList.toggle("collapsible-content-active");
      // this._saveToggleStates();
    });

    // Return a value by putting together two pieces of a variable name.
    // ex:
    // obj = this.actor.data
    // desc = data.tolerance.value
    // returns = this.actor.data.data.tolerance.value
    function getDescendantProp(obj, desc) {
      var arr = desc.split('.');
      while (arr.length) {
        obj = obj[arr.shift()];
      }
      return obj;
    }

    // Remove value
    html.find('.sub-value').click(ev => {
      let target = event.currentTarget.dataset.target;
      // console.log("event.currentTarget.dataset", event.currentTarget.dataset, event.currentTarget.dataset.itemid);
      if (typeof event.currentTarget.dataset.itemid !== "undefined") {
        let itemid = event.currentTarget.dataset.itemid;
        let item = this.actor.items.get(itemid);
        let current = getDescendantProp(item.data, target);
        if (current === null) {
          item.update({ [target]: 2 });
          // this._setToggleStates();
        }
        if (current > 0) {
          item.update({ [target]: --current });
          // this._render(true);
          // this._setToggleStates();
        }
      } else {
        let current = getDescendantProp(this.actor.data, target);
        if (current === null) {
          this.actor.update({ [target]: 2 });
          // this._setToggleStates();
        }
        if (current > 0) {
          this.actor.update({ [target]: --current });
          // this._render(true);
          // this._setToggleStates();
        }
      }
    });

  // Add Value
    html.find('.add-value').click(ev => {
      let target = event.currentTarget.dataset.target;
      if (typeof event.currentTarget.dataset.itemid !== "undefined") {
        let itemid = event.currentTarget.dataset.itemid;
        let item = this.actor.items.get(itemid);
        let current = getDescendantProp(item.data, target);
        if (current === null || current < 0) {
          item.update({ [target]: 0 });
        }
        item.update({ [target]: ++current });
        // this._render(true);
      } else {
        let current = getDescendantProp(this.actor.data, target);
        console.log("Add Value:", ev);
        if (current === null || current < 0) {
          this.actor.update({ [target]: 0 });
        }
        this.actor.update({ [target]: ++current });
        // this._render(true);
      }
    });

    // Add Inventory Item
    html.find('.item-create').click(this._onItemCreate.bind(this));

    // Update Inventory Item
    html.find('.item-edit').click(ev => {
      const li = $(ev.currentTarget).parents(".item");
      const item = this.actor.items.get(li.data("itemId"));
      item.sheet.render(true);
    });

    // Output Item Description to Chat
    html.find('.item-chat').click(ev => {
      const li = $(ev.currentTarget).parents(".item");
      const item = this.actor.items.get(li.data("itemId"));
      console.log("chat item:", item);
      let chatData = {
        user: game.user.id,
        speaker: ChatMessage.getSpeaker(),
        flavor: (item.data.data.typeName + " Description"),
        content: ("<h2>"+item.data.name+"</h2>"+item.data.data.description)
      };
      console.log("chatData:", chatData);
      ChatMessage.create(chatData);
      // item.sheet.render(true);
    });

    // Delete Inventory Item
    html.find('.item-delete').click(ev => {
      const li = $(ev.currentTarget).parents(".item");

      let deleteConfirm = new Dialog({
        title: "Delete Confirmation",
        content: "Delete Item?",
        buttons: {
          Yes: {
            icon: '<i class="fa fa-check"></i>',
            label: "Yes",
            callback: dlg => {
              // this.actor.deleteOwnedItem(li.data("itemId"));
              this.actor.deleteEmbeddedDocuments('Item',[li.data("itemId")]);
              li.slideUp(200, () => this.render(false));
            }
          },
          cancel: {
            icon: '<i class="fas fa-times"></i>',
            label: "Cancel"
          },
        },
        default: 'Yes'
      });
      deleteConfirm.render(true);
    });

    // Delete Saved Roll
    html.find('.roll-delete').click(ev => {
      const roll = event.currentTarget.dataset.rollid;
      const rollDeleteString = "data.savedRolls.-=" + roll;
      let aID = this.actor.id;

      let deleteConfirm = new Dialog({
        title: "Delete Confirmation",
        content: "Delete Item?",
        buttons: {
          Yes: {
            icon: '<i class="fa fa-check"></i>',
            label: "Yes",
            callback: dlg => {
              // this.actor.update({[rollDeleteString]: null});
              game.actors.get(aID).update({[rollDeleteString]: null});

            }
          },
          cancel: {
            icon: '<i class="fas fa-times"></i>',
            label: "Cancel"
          },
        },
        default: 'Yes'
      });
      deleteConfirm.render(true);
    });

    // Rollable abilities.
    /* Original roll code, before checking for saved roll info */
    html.find('.rollable').click(this._onRoll.bind(this));

    // New Test, for FormApplication
    html.find('.testButton').click(ev => {

      new RollForm(this.actor, {event:ev}).render(true);
    });

    // Set InitRoll
    /*
    html.find('.selectDIRoll').change(ev => {
      console.log("Init Roll Changed:", ev);
      let rValue = ev.currentTarget.value;
      let aID = this.actor.id;
      this.actor.data.data.initiativeRollID = rValue;
      game.actors.get(aID).update({"data.initiativeRollID": rValue});
    });
    */

    // Drag events for macros.
    // if (this.actor.owner) {
    if (this.actor.isOwner) {
      let handler = ev => this._onDragStart(ev);
      html.find('li.item').each((i, li) => {
        if (li.classList.contains("inventory-header")) return;
        li.setAttribute("draggable", true);
        li.addEventListener("dragstart", handler, false);
      });
    }
  }

  /**
   * Handle creating a new Owned Item for the actor using initial data defined in the HTML dataset
   * @param {Event} event   The originating click event
   * @private
   */
  async _onItemCreate(event) {
    event.preventDefault();

    console.log("_onItemCreate(event)");
    console.log(event); // <--- Need to figure out how to handle subtypes

    const header = event.currentTarget;
    // Get the type of item to create.
    const type = header.dataset.type;

    // Grab any data associated with this control.
    const data = duplicate(header.dataset);
    // Initialize a default name.
    const name = `New ${type.capitalize()}`;
    // Prepare the item object.
    const itemData = {
      name: name,
      type: type,
      data: data
    };

    // Subtype / Flag handling
    if (typeof header.dataset.flag !== 'undefined' && header.dataset.flag !== null) {
      console.log("Create Item Flag Handling");
      itemData.data.flags = {};
      itemData.data.flags[header.dataset.flag] = true;
    }

    // Injury Handling
    if (typeof header.dataset.hbname !== 'undefined' && header.dataset.hbname !== null) {
      console.log("Create Item - Injury");
      let value = 0;
      console.log(header.dataset.hbname);
      switch(header.dataset.hbname) {
        case "Bruised":
          value = 1; break;
        case "Injured":
          value = 2; break;
        case "Maimed":
          value = 4; break;
        case "Taken Out":
          value = 5; break;
      }
      itemData.data.injury = {};
      itemData.data.injury.value = value;
      itemData.data.flags = {};
      itemData.data.flags.isInjury = true;
      itemData.data.flags.isComplication = true;
      itemData.data.complication = {};
      itemData.data.complication.value = value;

      // pop-out new condition, bypass normal process
      delete itemData.data["type"];


      this.actor.createEmbeddedDocuments('Item', [itemData], { renderSheet: true });

      return;
    }

    console.log(itemData);

    // Remove the type from the dataset since it's in the itemData.type prop.
    delete itemData.data["type"];

    // Finally, create the item!
    return this.actor.createEmbeddedDocuments('Item',[itemData]);
  }

  _onRoll(event) {
    console.log("_onRoll: Launch trinityRoll event");
    console.log(event);
    event.preventDefault();
    if (event.currentTarget.classList.contains("saved-roll")) {
      let rollData = this.actor.data.data.savedRolls[event.currentTarget.dataset.rollid];
      console.log("rollData found: ", rollData);
      // trinityRoll(this.actor, passElements, event);
      new RollForm(this.actor, {event:event}, rollData).render(true);
    } else {
      // trinityRoll(this.actor, null, event);
      new RollForm(this.actor, {event:event}, null, event.currentTarget.id).render(true);

    }
  }

}
