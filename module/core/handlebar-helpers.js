export function handlebarHelpers() {

  // If you need to add Handlebars helpers, here are a few useful examples:
  Handlebars.registerHelper('concat', function() {
    var outStr = '';
    for (var arg in arguments) {
      if (typeof arguments[arg] != 'object') {
        outStr += arguments[arg];
      }
    }
    return outStr;
  });

  Handlebars.registerHelper('toLowerCase', function(str) {
    return str.toLowerCase();
  });

  // Used for the HealthBox edit - in need of FIXME / TODO
  Handlebars.registerHelper('hbPathFixer', function(str, act) {
    return act.data.data.health.details[str].boxes;
  });

  /* Not used now, fixed template
  Handlebars.registerHelper('varToString', function(v) {
    return Object.keys({v})[0];
  });
  */

  // From Party-Overview
  Handlebars.registerHelper("ifEquals", function (arg1, arg2, options) {
    return arg1 == arg2 ? options.fn(this) : options.inverse(this);
  });

  Handlebars.registerHelper("isEqual", function (arg1, arg2, arg3) {
    let isEqual = false;
    if (arg1 === arg2 || arg1 === arg3) { isEqual = true; }
    return isEqual;
  });

/*
  Handlebars.registerHelper('isPopulated', function (arg) {
    return value !== undefined;
  });
*/

  Handlebars.registerHelper('toDots', function(n, m) {
    let dots = '';
    let filled = '<i class="fa fa-circle"></i>';
    let empty = '<i class="far fa-circle"></i>';
    let mega = '<i class="fas fa-exclamation-circle"></i>';
    if (n > 10) {
      dots = n.toString();
      dots += filled;
    } else {
      for (let i = 0; i < Math.max(n, 5); i++) {
        if (i === 5) { dots += ' '; }
        if (i < n) {
          if (i < m) { dots += mega; }
          else { dots += filled; }
        }
        else {dots += empty;}
      }
    }
    return dots;
  });

  Handlebars.registerHelper('to10Dots', function(n) {
    let dots = '';
    let filled = '<i class="fa fa-circle"></i>';
    let empty = '<i class="far fa-circle"></i>';
    if (n > 10) {
      dots = n.toString();
      dots += filled;
    } else {
      for (let i = 0; i < Math.max(n, 10); i++) {
        if (i < n) { dots += filled; }
          else {dots += empty;}
      }
    }
    return dots;
  });

  Handlebars.registerHelper('to10Boxes', function(n) {
    let dots = '';
    let filled = '<i class="fas fa-square"></i>';
    let empty = '<i class="far fa-square"></i>';
    if (n > 10) {
      dots = n.toString();
      dots += filled;
    } else {
      for (let i = 0; i < Math.max(n, 10); i++) {
        if (i < n) { dots += filled; }
          else {dots += empty;}
      }
    }
    return dots;
  });

/* Old Healthbox helper
  Handlebars.registerHelper('toHealthBoxes', function(h) {
    let boxes = '';
    let extraBox = '<i class="fas fa-plus-square"></i>';
    let filledBox = '<i class="fas fa-square"></i>';
    let emptyBox = '<i class="far fa-square"></i>';
    for (let i = 0; i < h.filled; i++) { boxes += filledBox; }
    for (let i = 0; i < h.empty; i++) { boxes += emptyBox; }
    for (let i = 0; i < h.extra; i++) { boxes += extraBox; }
    return boxes;
  });
*/

  Handlebars.registerHelper('toHealthBoxes', function(states) {
    if (typeof states === "undefined") { console.log("MISSING STATES"); return;}

    let boxes = '';
    let extraBox = '<i class="fas fa-plus-square"></i>';
    let filledBox = '<i class="fas fa-square"></i>';
    let emptyBox = '<i class="far fa-square"></i>';
    for (let s of states) {
      if (s === 0) { boxes += emptyBox; }
      if (s === 3) { boxes += filledBox; }
      if (s === 4) { boxes += extraBox; }
    }
    return boxes;
  });

/* No longer used??
  Handlebars.registerHelper('toFilledBoxes', function(n) {
    let boxes = '';
    let filledBox = '<i class="fas fa-square"></i>';
    for (let i = 0; i < n; i++) {
      if (i < n) { boxes += filledBox; }
    }
    return boxes;
  });

  Handlebars.registerHelper('toExtraBoxes', function(n) {
    let boxes = '';
    let filledBox = '<i class="fas fa-plus-square"></i>';
    for (let i = 0; i < n; i++) {
      if (i < n) { boxes += filledBox; }
    }
    return boxes;
  });

  Handlebars.registerHelper('toEmptyBoxes', function(n) {
    let boxes = '';
    let emptyBox = '<i class="far fa-square"></i>';
    for (let i = 0; i < n; i++) {
      if (i < n) { boxes += emptyBox; }
    }
    return boxes;
  });
*/

  /* No longer needed
  Handlebars.registerHelper('lookupSavedRoll', function(rollID, context) {
    let name = context.actor.data.data.savedRolls[rollID].name;
    return name;
  });
  */

  Handlebars.registerHelper('uniqueTypes', function(items) {
    let types = [];
    for (let i of items) {
      if (types.indexOf(i.data.typeName) === -1) {
        types.push(i.data.typeName);
      }
    }
    types.sort(function(a, b) {return (a > b) ? 1 : -1;});
    return types;
  });

  Handlebars.registerHelper('mult', function(n) {
    let end = n.toString() + 'x</div>';
    let hidden = '<div class="flex-valign left small" style="visibility:hidden;">';
    let visible = '<div class="flex-valign left small">';
    if (n === 1) {
      return (hidden+end);
    } else {
      return (visible+end);
    }
  });


// Use on an actor sheet like: {{{createChip "data.defense.value"}}} or simply {{{createChip "defense"}}}
// Use on an actor sheet, within an #each, like: {{{createChip item._id ../actor}}}
// Use on an item sheet like: {{{createChip this.item.id}}}
// This code is inefficient and repetitive - fixing it will be a project for another day
  Handlebars.registerHelper('createChip', function(ref, argActor) {
    //console.log("createChip, ref", ref);
    //console.log("createChip, this", this);
    //console.log("createChip, actor", this.actor);
    //console.log("createChip, argActor", argActor);
    let targetActor = {};
    if (typeof argActor !== "undefined" && typeof argActor.name !== "undefined" && argActor.name === "createChip") {
      argActor = null;
    }
    if (argActor) {
      targetActor = argActor;
    } else {
      targetActor = this.actor || this.item.actor;
    }
    //console.log("createChip, targetActor", targetActor);
    // let targetActor = this.actor || this.item.actor;
    let isItem = false;
    let isLinked = false;
    let rollName = "No Roll Linked";
    let rollData = {};
    let linkedRoll = "";
    let linkKey = "";
    let targetItem = {};
    let html = "";

    if (!argActor && !targetActor) {
      html =
      `<div class="chip">
        <div class="chip-head">
          <i class="fas fa-dice"></i>
        </div>
      </div>`;
      return html;
    }

    // convert the ref to a complete path
    let refPath = targetActor.data.data.linkedRolls;
    let refSplit = ref.split('.');
    for(var i = 0; i < refSplit.length; i++) {
      // if (typeof refPath[refSplit[i]] !== "undefined") {refPath = refPath[refSplit[i]];}
      refPath = refPath[refSplit[i]];
    }

    // check if ref is an actor quality or an item
    if (typeof targetActor.items.get(ref) !== "undefined") {
      isItem = true;
      targetItem = targetActor.items.get(ref);
    }

    // Check for existing linkage
    //console.log("check for linkage, ref", ref);
    //console.log("check for linkage, actor", targetActor);
    //console.log("check for linkage, targetActor.data.data.linkedRolls", targetActor.data.data.linkedRolls);
    //console.log("check for linkage, Item/Actor", isItem, targetActor.data.data.linkedRolls[ref]);
    //console.log("check for linkage, refPath", refPath);
    if (!isItem) {
      if (typeof refPath !== "undefined" && refPath !== "" ) {
        linkedRoll = refPath;
        isLinked = true;
        rollData = targetActor.data.data.savedRolls[refPath];
      }
    } else if (isItem) {
      //console.log("check for linkage, item>", targetActor.items);
      //console.log("check for linkage, item.ref>", targetActor.items[ref]);
      //console.log("check for linkage, targetItem>", targetItem);
      // if (typeof targetItem.data.data.linkedRollID !== "undefined" && targetItem.data.data.linkedRollID !== "") {
      if (typeof targetActor.data.data.linkedRolls[ref] !== "undefined" && targetActor.data.data.linkedRolls[ref] !== "") {
        // linkedRoll = targetItem.data.data.linkedRollID;
        // linkedRoll = targetActor.data.data.savedRolls[ref];
        linkedRoll = targetActor.data.data.linkedRolls[ref];

        isLinked = true;
        // rollData = targetActor.data.data.savedRolls[targetItem.data.data.linkedRollID];
        rollData = targetActor.data.data.savedRolls[linkedRoll];
      }
      //console.log("check for linkage, linkedRoll>", linkedRoll);
      //console.log("check for linkage, rollData>", rollData);
    }
    if (isLinked && typeof rollData !== "undefined" && typeof rollData.name !== "undefined") {rollName = rollData.name;}

    //build option list
    let optionHTML = "";
    // for (let sRoll of Object.keys(targetActor.data.data.savedRolls)) {
    for (const [key, value] of Object.entries(targetActor.data.data.savedRolls)) {
      let selected = "";
      //console.log("option/select loop", key, linkedRoll);
      if (key === linkedRoll) {selected = "selected"; linkKey = key;}
      optionHTML += `<option value="${key}" ${selected}>${targetActor.data.data.savedRolls[key].name}</option>`;
    }

    /* Old method which had it's own listener.
    let rollNameDiv = "";
    if (rollData === {}) {
      rollNameDiv +=
        `<div class="chip-roll-name" id="${ref}">`
    } else {
      rollNameDiv +=
        `<div class="chip-roll-name saved-roll rollable" id="${ref}" data-rollID="${linkKey}">`
    }

    html =
    `<div class="chip">
      <div class="chip-head">
        <i class="fas fa-dice"></i>
      </div>
      <div class="chip-content chip-view">
        ${rollNameDiv}
          ${rollName}
        </div>
      </div>
      <div class="chip-content chip-change chip-hidden">
        <label class="chip-select chip-label" for="chip-select">Link Roll: </label>
        <select class="chip-select" id="chip-select" name="data.linkedRolls.${ref}" data-dtype="String">
          <option value="">None Selected</option>
          ${optionHTML}
        </select>
      </div>
      <div class="chip-control clickable">
        <i class="fas fa-link"></i>
      </div>
    </div>`
    ;
    */

    // New method that uses the general edit-area toggle
    let chipHeadDiv = "";
    if (rollData === {}) {
      chipHeadDiv +=
        `<div class="chip-head" id="${ref}">`
    } else {
      chipHeadDiv +=
        `<div class="chip-head saved-roll rollable" id="${ref}" data-rollID="${linkKey}">`
    }

    html =
    `<div class="chip">
      ${chipHeadDiv}
        <i class="fas fa-dice"></i>
      </div>
      <div class="placeholder can-hide">
      </div>
      <div class="chip-content chip-change can-hide hidden edit-area">
        <label class="chip-body chip-label" for="chip-select">Link Roll: </label>
        <select class="chip-body chip-select" id="chip-select" data-name="data.linkedRolls.${ref}" data-dtype="String">
          <option value="">None Selected</option>
          ${optionHTML}
        </select>
      </div>
    </div>`
    ;

    return html;
  });

}
