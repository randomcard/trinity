/**
 * Extend the basic ActorSheet with some very simple modifications
 * @extends {ActorSheet}
 */

//trinity roll 1
// import { TrinityRoll } from "/systems/trinity/module/trinity-roll.js";

// trinity roll 2
import { trinityRoll } from "/systems/trinity/module/trinity-roll.js";


export class TrinityActorSheet extends ActorSheet {

  constructor(actor, options) {
    super(actor, options);
    this.options.collapsedSections = [];
    this.options.collapsedHeaders = [];
    this.options.collapsedContent = [];


    /* Example from the CPR system:
    // Moved this to the constructor since this only needs to be set on the Sheet Object
    // The first time it is created.  The contents are then loaded from the User Settings
    // if they exist.
    this.options.collapsedSections = [];
    const collapsedSections = SystemUtils.GetUserSetting("sheetConfig", "sheetCollapsedSections", this.id);
    if (collapsedSections) {
      this.options.collapsedSections = collapsedSections;
    }
    */

    // this.htmlSaved = [];


  }


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
    // Return a single sheet for all item types.
    // return `${path}/item-sheet.html`;

    // Alternatively, you could use the following return statement to do a
    // unique item sheet by type, like `weapon-sheet.html`.

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
//    for (let attr of Object.values(data.data.attributes)) {
//      attr.isCheckbox = attr.dtype === "Boolean";
//    }

    // Prepare items.
    // if (this.actor.data.type == 'TrinityCharacter') {
      this._prepareTrinityCharacterItems(data);
    // }

// Find & expand collapsible sections - this.options.collapsedSections
/*
if (this.options.collapsedSections !== null) {
  console.log("this.options.collapsedSections is not null");
  console.log(document);
  console.log(this);
  console.log(html);
  for (let c of this.options.collapsedSections) {
    // html.find(c).
    var cElement = document.getElementById(c);
    console.log("cElement:");
    cElement.classList.toggle("collapsible-active");
    // var content = cElement.nextElementSibling;
    cElement.nextElementSibling.classList.toggle("collapsible-content-active");
    cElement.nextElementSibling.style.maxHeight = cElement.nextElementSibling.scrollHeight + "px";
  }
}
*/

// ----------------- Reference
/*
collapsibleElement.classList.toggle("collapsible-active");
var content = collapsibleElement.nextElementSibling;
if (content.style.maxHeight){
  content.classList.toggle("collapsible-content-active");
  content.style.maxHeight = null;
} else {
  content.classList.toggle("collapsible-content-active");
  content.style.maxHeight = content.scrollHeight + "px";
}
*/
// ----------------

  /*
  console.log("getData this:", this);
  var coll = document.getElementsByClassName("collapsible");
  console.log("getData coll:", coll);
  var collOld = this.htmlSaved;
  console.log("getData collOld:", collOld);

  for (let i = 0; i < coll.length; i++) {
    coll[i] = collOld[i];
      //
      this.classList.toggle("collapsible-active");
      console.log("Collapsible Listener, uses This:", this);
      var content = this.nextElementSibling;
      if (content.style.maxHeight){
        content.classList.toggle("collapsible-content-active");
        content.style.maxHeight = null;
      } else {
        content.classList.toggle("collapsible-content-active");
        content.style.maxHeight = content.scrollHeight + "px";
      }
      //
      // Copy current HTML, so it can selectively replace the normal template, keeping collapsible css.
      // htmlSaved = JSON.parse(JSON.stringify(html));
    }
 */
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
/* Removed to test new HB iteration
    const healthBoxes = {
      bruised : {
        name : this.actor.data.data.healthboxes.bru.name
      },
      injured : {
        name : this.actor.data.data.healthboxes.inj.name
      },
      maimed : {
        name : this.actor.data.data.healthboxes.mai.name
      },
      takenOut : {
        name : this.actor.data.data.healthboxes.tak.name
      }
    };
*/



/*
    healthBoxes.bruised = [];
    healthBoxes.bruised.name = this.actor.data.data.healthboxes.bru.name;
    healthBoxes.injured = [];
    healthBoxes.injured.name = this.actor.data.data.healthboxes.inj.name;
    healthBoxes.maimed = [];
    healthBoxes.maimed.name = this.actor.data.data.healthboxes.mai.name;
    healthBoxes.takenOut = [];
    healthBoxes.takenOut.name = this.actor.data.data.healthboxes.tak.name;
*/

    // Create healthboxes
    // Get # of injuries - Turn this into a loop to reduce code...

    for (let hb of Object.keys(this.actor.data.data.healthboxes)) {
      console.log("Heathbox Logging - hb:", hb);
      let injuries = Object.keys(this.actor.data.items.filter(h => h.data.flags.isInjury && (h.data.injury.value === this.actor.data.data.healthboxes[hb].conditionLevel))).length;
      console.log("Heathbox Logging - injuries:", injuries);
      // add if - add the property if not already in healthboxes
      if (typeof healthBoxes[hb] === 'undefined' || healthBoxes[hb] === null) {
        console.log("Heathbox Logging - check to add");
        healthBoxes[hb] = {};
        console.log("Heathbox Logging - Added to healthBoxes:", healthBoxes);
        healthBoxes[hb].name = this.actor.data.data.healthboxes[hb].name;
        // healthBoxes[hb].push(this.actor.data.data.healthboxes[hb].name);
      }
      if ((this.actor.data.data.healthboxes[hb].value > 0) || (injuries > 0)) {
        console.log("Heathbox Logging - add injuries");
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
          console.log("Heathbox Logging - remove category if no injuries or healthboxes");
          delete healthBoxes[hb];
        }
      }
    }




    /* -------------------------Removed to test new HB iteration-----------------
    // Bruised (1)
    let bruisedNum = Object.keys(this.actor.data.items.filter(h => h.data.flags.isInjury && (h.data.injury.value === 1))).length;
    if (bruisedNum <= this.actor.data.data.healthboxes.bru.value) {
      healthBoxes.bruised.filled = bruisedNum;
      healthBoxes.bruised.empty = this.actor.data.data.healthboxes.bru.value - healthBoxes.bruised.filled;
      healthBoxes.bruised.extra = 0;
    } else {
      healthBoxes.bruised.extra = bruisedNum - this.actor.data.data.healthboxes.bru.value;
      healthBoxes.bruised.filled = bruisedNum - healthBoxes.bruised.extra;
      healthBoxes.bruised.empty = 0;
    }

    // Injured (2)
    let injuredNum = Object.keys(this.actor.data.items.filter(h => h.data.flags.isInjury && (h.data.injury.value === 2))).length;
    if (injuredNum <= this.actor.data.data.healthboxes.inj.value) {
      healthBoxes.injured.filled = injuredNum;
      healthBoxes.injured.empty = this.actor.data.data.healthboxes.inj.value - healthBoxes.injured.filled;
    } else {
      healthBoxes.injured.extra = injuredNum - this.actor.data.data.healthboxes.inj.value;
      healthBoxes.injured.filled = injuredNum - healthBoxes.injured.extra;
      healthBoxes.injured.empty = 0;
    }

    // Maimed (Value 3, Condition level 4)
    let maimedNum = Object.keys(this.actor.data.items.filter(h => h.data.flags.isInjury && (h.data.injury.value === 3 ))).length;
    if (maimedNum <= this.actor.data.data.healthboxes.mai.value) {
      healthBoxes.maimed.filled = maimedNum;
      healthBoxes.maimed.empty = this.actor.data.data.healthboxes.mai.value - healthBoxes.maimed.filled;
    } else {
      healthBoxes.maimed.extra = maimedNum - this.actor.data.data.healthboxes.mai.value;
      healthBoxes.maimed.filled = maimedNum - healthBoxes.maimed.extra;
      healthBoxes.maimed.empty = 0;
    }

    // Taken Out (Value 4, Condition Level "Taken Out")
    let takenOutNum = Object.keys(this.actor.data.items.filter(h => h.data.flags.isInjury && (h.data.injury.value === 4 ))).length;
    if (takenOutNum <= this.actor.data.data.healthboxes.tak.value) {
      healthBoxes.takenOut.filled = takenOutNum;
      healthBoxes.takenOut.empty = this.actor.data.data.healthboxes.tak.value - healthBoxes.takenOut.filled;
    } else {
      healthBoxes.takenOut.extra = takenOutNum - this.actor.data.data.healthboxes.tak.value;
      healthBoxes.takenOut.filled = takenOutNum - healthBoxes.takenOut.extra;
      healthBoxes.takenOut.empty = 0;
    }
*/

    console.log("healthboxes:");
    console.log(healthBoxes);




    // Iterate through items, allocating to containers
    for (let i of sheetData.items) {
      let item = i.data;
      i.img = i.img || DEFAULT_TOKEN;

      // "item" sub-types - Gear / Weapon / Armor / Vehicle
      if (i.type === 'item' && i.data.flags.isGear === true) { gear.push(i); }
      if (i.type === 'item' && i.data.flags.isWeapon === true) { weapons.push(i); }
      if (i.type === 'item' && i.data.flags.isArmor === true) { armors.push(i); }
      if (i.type === 'item' && i.data.flags.isVehicle === true) { vehicles.push(i); }

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
    actorData.conditions = conditions;
    actorData.stunts = stunts;
    actorData.gifts = gifts;
    actorData.tricks = tricks;
    actorData.contacts = contacts;
    actorData.bonds = bonds;
    actorData.healthBoxes = healthBoxes;
    actorData.allItems = allItems;

  }

  /* -------------------------------------------- */

  /** @override */
  activateListeners(html) {
    super.activateListeners(html);

    // Everything below here is only needed if the sheet is editable
    if (!this.options.editable) return;

    if (this.options.collapsedHeaders !== null) {
      for (let c of this.options.collapsedHeaders) {
        var cElement = html.find("#"+c);
        cElement.addClass("collapsible-active");
      }
    }

    if (this.options.collapsedContent !== null) {
      for (let c of this.options.collapsedContent) {
        var cElement = html.find("#"+c);
        cElement.addClass("collapsible-content-active");
        console.log("cElement");
        console.log(cElement);
        cElement[0].style.maxHeight = cElement[0].scrollHeight + "px";
      }
    }

    html.find('.collapsible').click(event => {
      const collapsibleElement = event.currentTarget;
      console.log("Collapsible Listener, HTML.find style. event:", event);
      console.log("Collapsible Listener, HTML.find style. this:", this);
      console.log("Collapsible Listener, HTML.find style. collapsibleElement:", collapsibleElement);
      collapsibleElement.classList.toggle("collapsible-active");
      var content = collapsibleElement.nextElementSibling;
      if (content.style.maxHeight){
        content.classList.toggle("collapsible-content-active");
        content.style.maxHeight = null;
      } else {
        content.classList.toggle("collapsible-content-active");
        content.style.maxHeight = content.scrollHeight + "px";
      }

      if (this.options.collapsedHeaders.includes(event.currentTarget.id)) {
		  // if IF is true, remove header & content from options
        this.options.collapsedHeaders = this.options.collapsedHeaders.filter((sectionName) => sectionName !== event.currentTarget.id);
        this.options.collapsedContent = this.options.collapsedContent.filter((sectionName) => sectionName !== event.currentTarget.id);
      } else {
		  // otherwise, add it
        this.options.collapsedHeaders.push(event.currentTarget.id);
        this.options.collapsedContent.push(content.id);
      }

      console.log("collapsedHeaders", this.options.collapsedHeaders);
      console.log("collapsedContent", this.options.collapsedContent);

    });

    // Remove Inspiration
    html.find('.remove-inspiration').click(ev => {
      if (this.actor.data.data.inspiration.value > 0) {
        // --this.actor.data.data.inspiration.value;
        this.actor.update({ 'data.inspiration.value': --this.actor.data.data.inspiration.value });

        this.render(true);
      }
    });

    // Add Inspiration
    html.find('.add-inspiration').click(ev => {
      // ++this.actor.data.data.inspiration.value;
      this.actor.update({ 'data.inspiration.value': ++this.actor.data.data.inspiration.value });
      this.render(true);
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
              this.actor.deleteOwnedItem(li.data("itemId"));
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

      // this.actor.deleteOwnedItem(li.data("itemId"));
      // li.slideUp(200, () => this.render(false));
    });

    // Rollable abilities.
    html.find('.rollable').click(this._onRoll.bind(this));

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
      switch(header.dataset.hbname) {
        case "Bruised":
          value = 1; break;
        case "Injured":
          value = 2; break;
        case "Maimed":
          value = 3; break;
        case "Taken Out":
          value = 4; break;
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
      // let newItem = await this.actor.createOwnedItem(itemData);
      console.log(this.actor);
      console.log(itemData);
      // let newItem = await this.actor.createEmbeddedDocuments('Item', [itemData.toObject()]);
      let newItem = await this.actor.createEmbeddedDocuments('Item', [itemData]);

      let createdItem = this.actor.items.get(newItem.id);
      createdItem.sheet.render(true);
      return;
    }

    console.log(itemData);

    // Remove the type from the dataset since it's in the itemData.type prop.
    delete itemData.data["type"];

    // Finally, create the item!
    return this.actor.createOwnedItem(itemData);
  }

  _onRoll(event) {
    event.preventDefault();
    console.log("Launch trinityRoll event");
    console.log(this.actor);
    trinityRoll(this.actor, null, event);
  }



}
