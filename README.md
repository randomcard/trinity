# Trinity Continuum

Unofficial Foundry Virtual Tabletop implementation of the Trinity Continuum Core RPG, by Onyx Path Publishing. The system currently supports Trinity Core, Adventure, Aeon, and Aberrant.

## Info

This is a beginning work by the system author: Expect errors, bugs, and poor coding & design in general.

## How to Use

Install system in Foundry with: https://raw.githubusercontent.com/randomcard/trinity/master/system.json

Due to IP concerns, this system is not playable on installation. It requires the creation of system elements (as Items) that can be added to new characters. The following elements must be created:
* Attributes
* Source Attributes (Facets, Psi, Quantum)
* Skills
* Paths
* Contacts
* Edges
* Specialties
* Skill Tricks
* Gifts
* Equipment
* Stunts
* Tags
* Bonds

Information on each of these elements can be found in the Trinity Continuum Core Rulebook, and other Trinity products. Generally, you would populate these items from the rulebook(s), then drop the items on the character sheet. If you have groups of items in a folder (such as Stunts), you can drop the folder on a new character sheet to give the character copies of them all at once.

### Stunts & Tags
Stunts and tags can be dropped into other item types. For example, Stunts can be added to Actions, or Tags can be added to Equipment.

### Editing the Character
Once the character is created, and desired items added to it, you can make further changes by selecting the "Lock" icon on the right of the character navigation bar. This will allow changes to a wide variety of settings, as well as make visible a "Configure" tab. This tab allows changing a character type (such as a Talent, or a Psion - or both!) and default dice settings, as well as showing all items associated with the character.

## Rolling Dice

Start rolling dice in one of four ways:
1. Click on any "rollable" dot value. For example, click on the dots of an Attribute.
2. Click on a roll icon (Black dice on orange circle). This will bring up the saved roll settings (if set), or an empty roller if not.
3. Go to the "Saved Rolls" tab (the dice on the left of the character navigation bar), and click on the "New Roll" button.
4. Go to the "Saved Rolls" tab, and click on any of the saved rolls there, if any.

After doing any of these, a Roll window will appear, where you can add or remove dice, enhancements, and change roll options like the success value. You can also save the roll settings to use them again later, or to associate with a roll icon.


## Other Notes

Most character elements that can't be dropped as an item on the character (such as facets or inspiration) can be edited in the "Configure" section on the character sheet.

The Actors directory has a "Party Overview" button that launches a window to keep track of party Momentum, and the party's aspirations.

Rolling for initiative requires creating a "Saved Roll":
1. Click on a Skill or Attribute to open the "Roll Options" dialog.
2. Configure the roll as appropriate, **including checking the "Initiative Roll" box**.
3. Select "Save As".
4. Name the Saved Roll and select "Save".
5. Select that Saved Roll from the "Default Initiative Roll" dropdown on the character sheet.

## Code Sources

Some code was obtained from other sources:
- Original code was the Boilerplate System, a lightweight starter set. (https://gitlab.com/asacolips-projects/foundry-mods/boilerplate)
- Elements from party-overview were used. (https://github.com/League-of-Foundry-Developers/party-overview)
- Custom combat class adapted from a sample by Tommycore. (https://discordapp.com/channels/170995199584108546/670336275496042502/893041317637132288)
- And many, many more. I didn't think to keep track until recently. Big thanks to the Discord community!
