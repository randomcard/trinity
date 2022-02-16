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
    console.log("prepareDerivedData called", itemData);

    // Make separate methods for each Actor type (character, npc, etc.) to keep
    // things organized.
    this._prepareSubItemData(itemData);
  }

  _prepareSubItemData(itemData) {
    console.log("_prepareSubItemData called", itemData);
  }

  /**
   * Handle clickable rolls.
   * @param {Event} event   The originating click event
   * @private
   */
  async roll(attribute) {
    // Basic template rendering data
    const token = this.actor.token;
    const item = this.data;
    const actorData = this.actor ? this.actor.data.data : {};
    const itemData = item.data;
    if (attribute == null){
    attribute = 0;
    }

    // Original example roll
    // let roll = new Roll('d20+@abilities.str.mod', actorData);
    let roll = new Roll("(@att+@ski)d10x10cs>=7", {att: attribute, ski: item.skill.value});
    // goals: let the explode value & success value be changeable, and add mofifiers like enhancements
    let label = `Rolling ${item.name}`;
    roll.roll().toMessage({
      speaker: ChatMessage.getSpeaker({ actor: this.actor }),
      flavor: label
    });
  }
}
