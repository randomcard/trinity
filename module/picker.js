export class Picker {

  static async pDialog(pickType, targetActor, pickedElements) {

    // add some conditional code here to change the template depending on pickType - attr, skil, etc.
    console.log("Picker, what does it have?");
    console.log(this);
    console.log(pickType);
    console.log(targetActor);
    console.log(pickedElements);
    const html = await renderTemplate("systems/trinity/templates/pickers/pick-attr.html", {picked: pickedElements, actor: targetActor});

    const pickDialog = await new Promise(resolve => {
        new Dialog({
        title: "Pick Element",
        id: "picker",
        content: html,
        buttons: {
          update: {
            icon: "<i class='fas fa-redo'></i>",
            label: "Update",
            callback: () => {
              console.log("Testing getElementsByClassName:");
              console.log(document.getElementsByClassName('input'));
              for (let i of document.getElementsByClassName('input')) {
                if (i.checked) {  // maybe i[0]
                  pickedElements.attr = Object.values(targetActor.data.data.attributes).find(attribute => attribute.name === i.value);
                  console.log("Picker, Update button, pickedElement:");
                  console.log(pickedElements);
                }
              };

/*

              let h = html.find('.input');
              Array.prototype.forEach.call(h, function(i) {
                if (i.checked) {  // maybe i[0]
                  pickedElements.attr = Object.values(targetActor.data.data.attributes).find(attribute => attribute.name === i.value);
                  console.log("Picker, Update button, pickedElement:");
                  console.log(pickedElements);
                }
                console.log(i.tagName);
              });


/*
              for (let i of html.filter('.input')) {
                if (i.checked) {  // maybe i[0]
                  pickedElements.attr = Object.values(targetActor.data.data.attributes).find(attribute => attribute.name === i.value);
                  console.log("Picker, Update button, pickedElement:");
                  console.log(pickedElements);
                }
              };
*/


/* Various useful code snippets
targetAttr = Object.values(targetActor.data.data.attributes).find(attribute => attribute.name === dataset.attrname);
pickedElements.attr = targetAttr;

              if (html.find('#'+i._id)[0].checked) {
                iSelect = html.find('#'+i._id)[0].value;
              }

              for (let part of Object.keys(rollParts)) {
                if (document.getElementById(part)){
                  rollParts[part] = parseInt(document.getElementById(part).value) || rollParts[part];
                }
                console.log("rollParts."+part+":");
                console.log(rollParts[part]);
              }
/* End Code Snippets */


              resolve(pickedElements);
              /* Needs updating to update pickedElements
              for (let part of Object.keys(rollParts)) {
                if (document.getElementById(part)){
                  rollParts[part] = parseInt(document.getElementById(part).value) || rollParts[part];
                }
                console.log("rollParts."+part+":");
                console.log(rollParts[part]);
              }
              resolve(rollParts); */
            }
          },
          cancel: {
            icon: "<i class='fas fa-times'></i>",
            label: "Cancel",
            callback: () => {
              resolve(pickedElements);
          //	  actionType = "remove";
            }
          },
        },
        default:"roll",
        callback: html => {
          resolve(pickedElements);
//            console.log(html, actor);
/*
            let passionName = html[0].querySelector('.newPassion').value
            let passionValue = html[0].querySelector('.newPassionValue').value

            actor.update({
                "data.passions": [...actor.data.passions, [passionName, passionValue]]
*/      }
    }).render(true);
  });
}

}
