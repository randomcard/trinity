/**
 * Extend the basic Item with some very simple modifications.
 * @extends {Item}
 */
export class TrinityItem extends Item {
  /**
   * Augment the basic Item data model with additional dynamic data.
   */
  prepareData() {
    super.prepareData();

    // Get the Item's data
    const itemData = this.data;
    const actorData = this.actor ? this.actor.data : {};
    const data = itemData.data;
  }

  prepareDerivedData() {
    const itemData = this.data;
    const actorData = this.actor ? this.actor.data : {};
    const data = itemData.data;
    // console.log("prepareDerivedData called", itemData);

    // Make separate methods for each Actor type (character, npc, etc.) to keep
    // things organized.
    this._prepareSubItemData(itemData);
    this._updateFlags(itemData);
    this._matchValues(itemData);
  }


  _updateFlags(itemData) {
    /*
    if (this.data.data.enhancement.value > 0) {this.data.data.flags.isEnhancement = true;}
    else {{this.data.data.flags.isEnhancement = false;}
    if (this.data.data.complication.value > 0) {this.data.data.flags.isComplication = true;}
    else {{this.data.data.flags.isComplication = false;}
    */
    if (typeof this.data.data.injury !== "undefined" && typeof this.data.data.injury.value !== "undefined") {
      if (this.data.data.injury.value < 1) {this.data.data.flags.isInjury = false;}
      else {this.data.data.flags.isInjury = true;}
    }
  }

  _matchValues(itemData) {
    // Certain item types have an enhancement calue equal to dots - this updates that manually
    if (this.data.type === "attribute" && typeof this.data.data.flags.isFacet !== "undefined" && this.data.data.flags.isFacet) {
      this.data.data.enhancement.value = this.data.data.value;
      this.data.data.flags.isEnhancement = true;
    } else if ( this.data.type === "attribute" && typeof this.data.data.flags.isEnhancement ) {
      this.data.data.enhancement.value = this.data.data.value;
    }
  }


  _prepareSubItemData(itemData) {
    // console.log("_prepareSubItemData called", itemData);
    if (typeof this.data.data.subItems !== "undefined") {
      const stunts = [];
      const tags = [];

      for (let i of Object.keys(this.data.data.subItems)) {
        let subItem = this.data.data.subItems[i];
        if (subItem.type === 'stunt') { stunts.push(subItem); }
        if (subItem.type === 'tag') { tags.push(subItem); }
      }

      // Sort & Assign
      this.data.data.stunts = stunts.sort((a, b) => a.name > b.name ? 1 : -1);
      this.data.data.tags = tags.sort((a, b) => a.name > b.name ? 1 : -1);
      this.data.data.totalTagValue = this._getTotalTagValue(tags);
    }

  }

  _getTotalTagValue(tags) {
    let total = 0;
    for (let t of tags) {
      total = total + t.tagValue;
    }
    return total;
  }

}
