# Trinity Continuum

Unofficial Foundry Virtual Tabletop implementation of the Trinity Continuum Core RPG, by Onyx Path Publishing. The system currently supports Trinity Adventure in addition to Core (as it shares the same "Talent" mechanics), but not Aeon or Aberrant as yet.

## Info

This is a beginning work by the system author: Expect errors, bugs, and poor coding & design in general.

## How to Use

Due to IP concerns, this system is not playable on installation. It requires the creation of system elements (as Items) that can be added to new characters. The following elements must be created:
* Skills
* Paths
* Contacts
* Edges
* Specialties
* Skill Tricks
* Gifts
* Weapons
* Armor
* Stunts
* Artifacts
* Bonds

Information on each of these elements can be found in the Trinity Continuum Core Rulebook, and other Trinity products. Generally, you would populate these items from the rulebook(s), then drop the items on the character sheet. If you have groups of items in a folder (such as Stunts), you can drop the folder on a new character sheet to give the character copies of them all at once.

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
