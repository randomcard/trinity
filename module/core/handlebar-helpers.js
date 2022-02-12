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

  Handlebars.registerHelper('createChip', function(actorID, ref) {
    let targetActor = game.actors.get(actorID);
    let isItem = false;
    let isLinked = false;
    let rollName = "No Roll Linked";
    let rollData = {};
    // check if ref is an actor quality or an item
    if (typeof targetActor.items.get(ref) !== "undefined") {isItem = true;}
    // Check for existing linkage
    if (!isItem) {
      if (typeof targetActor.data.data.linkedRolls[ref] !== "undefined") {
        isLinked = true;
        rollData = targetActor.data.data.savedRolls[targetActor.data.data.linkedRolls[ref]];
      }
    } else {
      if (typeof targetActor.items[ref].data.data.linkedRollID !== "undefined") {
        isLinked = true;
        rollData = targetActor.data.data.savedRolls[targetActor.items[ref].data.data.linkedRollID];
      }
    }
    if (isLinked) {rollName = rollData.name;}

    //build option list
    let optionHTML = "";
    for (let sRoll of Object.keys(targetActor.data.data.savedRolls)) {
      let selected = "";
      if (sRoll === Object.keys({rollData})[0]) {selected = "selected"}
      optionHTML += `<option value="${sRoll}" ${selected}>${targetActor.data.data.savedRolls[sRoll]}</option>`;
    }

    let html =
    `<div class="chip">
      <div class="chip-head">
        <i class="fas fa-dice">
      </div>
      <div class="chip-content chip-view">
        <div class="chip-roll-name" id="${ref}">
          ${rollName}
        </div>
        <div class="chip-link">
          <i class="fas fa-link">
        </div>
      </div>
      <div class="chip-content chip-change">
        <label class="chip-select resource-label" for="chip-select">Link Roll: </label>
        <select class="chip-select" id="chip-select" name="data.linkedRollID" data-dtype="String">
          {{#select data.linkedRollID}}
          <option value="">None Selected</option>
          ${optionHTML}
          {{/select}}
        </select>
        <div class="chip-save">
          <i class="fas fa-save">
        </div>
      </div>
    </div>`
    ;

    return html;
  });

}
