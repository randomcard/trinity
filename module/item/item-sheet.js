/**
 * Extend the basic ItemSheet with some very simple modifications
 * @extends {ItemSheet}
 */
export class TrinityItemSheet extends ItemSheet {

  /** @override */
  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      classes: ["trinity", "sheet", "item"],
      width: 520,
      height: 480,
      tabs:
      [
        {
        navSelector: ".sheet-tabs",
        contentSelector: ".sheet-body",
        initial: "description"
        }
      ],
      dragDrop:
      [
                { dragSelector: '.item[data-item-id]', dropSelector: null }
      ]
    });
  }

  /** @override */
  get template() {
    const path = "systems/trinity/templates/item";
    // Return a single sheet for all item types.
    // return `${path}/item-sheet.html`;

    // Alternatively, you could use the following return statement to do a
    // unique item sheet by type, like `weapon-sheet.html`.
    return `${path}/item-${this.item.data.type}-sheet.html`;
  }

  /* -------------------------------------------- */

  /** @override */
  getData() {
    const data = super.getData();
    return data;
  }

  /* -------------------------------------------- */

  /** @override */
  setPosition(options = {}) {
    const position = super.setPosition(options);
    const sheetBody = this.element.find(".sheet-body");
    const bodyHeight = position.height - 192;
    sheetBody.css("height", bodyHeight);
    return position;
  }

  /* -------------------------------------------- */

  /** @override */
  activateListeners(html) {
    super.activateListeners(html);

    // Everything below here is only needed if the sheet is editable
    if (!this.options.editable) return;

    // Roll handlers, click handlers, etc. would go here.

    // html.find('.memorization-slot').on("drop", console.log("something dropped: ",this));

  }

  async _onDrop(event) {

    // Try to extract the data
    let data;
    try {
      data = JSON.parse(event.dataTransfer.getData('text/plain'));
    } catch (err) {
      return false;
    }

    console.log(event);
    console.log(data);

    switch ( data.type ) {
    /*  case "ActiveEffect":
        return this._onDropActiveEffect(event, data);
      case "Actor":
        return this._onDropActor(event, data); */
      case "Item":
        return this._onDropItem(event, data);
      case "Folder":
        return this._onDropFolder(event, data);
    }
  }

  async _onDropItem(event, data) {
    if ( !this.item.isOwner ) return false;
    const item = await Item.implementation.fromDropData(data);
    const itemData = item.toObject();

    // Handle item sorting within the same Actor
    // if ( await this._isFromSameActor(data) ) return this._onSortItem(event, itemData);

    // Create the owned item
    return this._onDropGetInfo(itemData);
  }

  async _onDropFolder(event, data) {
    if ( !this.item.isOwner ) return [];
    if ( data.documentName !== "Item" ) return [];
    const folder = game.folders.get(data.id);
    if ( !folder ) return [];
    return this._onDropGetInfo(folder.contents.map(e => e.toObject()));
  }

  async _onDropGetInfo(itemData) {
    itemData = itemData instanceof Array ? itemData : [itemData];
    let updates = [];
    console.log("_onDropGetInfo itemData", itemData);
    for (var droppedItem of itemData) {
      switch (droppedItem.type) {
        case "stunt":
          updates.push({
            "data.stunts" : {
              [droppedItem._id] :{
                name : droppedItem.name,
                description : droppedItem.description,
                costDescription : droppedItem.costDescription,
              }
            }
          });
          break;
        case "tag":
          break;
      }
    }
    await this.item.update(updates);
    // return this.actor.createEmbeddedDocuments("Item", itemData);
  }



}
