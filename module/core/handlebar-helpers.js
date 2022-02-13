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

  /* Not used now, fixed template
  Handlebars.registerHelper('varToString', function(v) {
    return Object.keys({v})[0];
  });
  */

  // From Party-Overview
  Handlebars.registerHelper("ifEquals", function (arg1, arg2, options) {
    return arg1 == arg2 ? options.fn(this) : options.inverse(this);
  });

  Handlebars.registerHelper('toDots', function(n) {
    let dots = '';
    let filled = '<i class="fa fa-circle"></i>';
    let empty = '<i class="far fa-circle"></i>';
    if (n > 10) {
      dots = n.toString();
      dots += filled;
    } else {
      for (let i = 0; i < Math.max(n, 5); i++) {
        if (i === 5) { dots += ' '; }
        if (i < n) { dots += filled; }
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


// Use on an actor sheet like: {{{createChip "data.defense.value"}}}
// Use on an actor sheet, within an #each, like: {{{createChip this.item._id --FIGURE THIS OUT-- }}}
// Use on an item sheet like: {{{createChip this.item._id}}}
  Handlebars.registerHelper('createChip', function(ref, actor) {
    console.log("createChip, this", this);
    console.log("createChip, actor", this.actor);
    let targetActor = {};
    if (actor) {
      targetActor = actor;
    } else {
      targetActor = this.actor || this.item.actor;
    }
    console.log("createChip, targetActor", targetActor);
    // let targetActor = this.actor || this.item.actor;
    let isItem = false;
    let isLinked = false;
    let rollName = "No Roll Linked";
    let rollData = {};
    let linkedRoll = "";
    let linkKey = "";

    // convert the ref to a complete path
    let refPath = targetActor.data.data.linkedRolls;
    let refSplit = ref.split('.');
    for(var i = 0; i < refSplit.length; i++) {
      // if (typeof refPath[refSplit[i]] !== "undefined") {refPath = refPath[refSplit[i]];}
      refPath = refPath[refSplit[i]];
    }

    // check if ref is an actor quality or an item
    if (typeof targetActor.items.get(ref) !== "undefined") {isItem = true;}
    // Check for existing linkage
    console.log("check for linkage, ref", ref);
    console.log("check for linkage, actor", targetActor);
    console.log("check for linkage, targetActor.data.data.linkedRolls", targetActor.data.data.linkedRolls);
    console.log("check for linkage, Item/Actor", isItem, targetActor.data.data.linkedRolls[ref]);
    console.log("check for linkage, refPath", refPath);
    if (!isItem) {
      if (typeof refPath !== "undefined" && refPath !== "") {
        linkedRoll = refPath;
        isLinked = true;
        rollData = targetActor.data.data.savedRolls[refPath];
      }
    } else if (isItem) {
      if (typeof targetActor.items[ref].data.data.linkedRollID !== "undefined" && targetActor.items[ref].data.data.linkedRollID !== "") {
        linkedRoll = targetActor.items[ref].data.data.linkedRollID;
        isLinked = true;
        rollData = targetActor.data.data.savedRolls[targetActor.items[ref].data.data.linkedRollID];
      }
    }
    if (isLinked && typeof rollData.name !== "undefined") {rollName = rollData.name;}

    //build option list
    let optionHTML = "";
    // for (let sRoll of Object.keys(targetActor.data.data.savedRolls)) {
    for (const [key, value] of Object.entries(targetActor.data.data.savedRolls)) {
      let selected = "";
      console.log("option/select loop", key, linkedRoll);
      if (key === linkedRoll) {selected = "selected"; linkKey = key;}
      optionHTML += `<option value="${key}" ${selected}>${targetActor.data.data.savedRolls[key].name}</option>`;
    }

    let rollNameDiv = "";
    if (rollData === {}) {
      rollNameDiv +=
        `<div class="chip-roll-name" id="${ref}">`
    } else {
      rollNameDiv +=
        `<div class="chip-roll-name saved-roll rollable" id="${ref}" data-rollID="${linkKey}">`
    }

    let html =
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

    return html;
  });

}
