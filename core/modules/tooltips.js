// RENDER EVERYTHING
function map(data) {

   // SHOW TOOLTIP EVENT
   $('body').on('mouseover', '.flightpath, .objective, .travel, .hub, .quest', (event) => {
      
      // TARGET DATASET
      var target = data.build[data.current];

      // PICK UP ID ATTRIBUTE & USE IT TO FIND THE CORRECT WAYPOINT
      var id = $(event.target).attr('wp');
      var waypoint = target.waypoints[id];

      // TOOLTIP CONTAINER
      var container = '<div id="tooltip-inner">';

      // GENERATE A HEADER ROW
      if (waypoint.header != '') {
         container += `
            <div class="title">
               <div class="split">
                  <div id="left">` + waypoint.header + `</div>
                  <div id="right">` + waypoint.coords.x + `.` + waypoint.coords.y + `</div>
               </div>
            </div>
         `;
      }

      // LOOP THROUGH & GENERATE A SELECTOR FOR EACH QUEST/OBJCTIVE THAT ARE DEFINED
      if (waypoint.ends != undefined) { waypoint.ends.forEach(data => { container += row('ends', data); }); }
      if (waypoint.starts != undefined) { waypoint.starts.forEach(data => { container += row('starts', data); }); }
      if (waypoint.objectives != undefined) { waypoint.objectives.forEach(data => { container += row('objectives', data); }); }
      if (waypoint.special != undefined) { waypoint.special.forEach(details => { container += '<div class="special">' + details + '</div>'; }); }

      container += '</div>';

      // RENDER IN THE ENTIRE TOOLTIP
      $('#tooltip').html(container);

      // ASSIST VARS FOR POSITION CALIBRATION
      var height = parseFloat($('#tooltip').css('height'));
      var width = parseFloat($('#tooltip').css('width'));
      var offset = 15;

      // CALIBRATE CORRECT XY COORDINATES
      var x = event.target.offsetParent.offsetLeft - (width / 2);
      var y = event.target.offsetParent.offsetTop - (height + offset);
      
      // EXECUTE CSS CHANGES & TOGGLE THE DISPLAY ON
      $('#tooltip').css('left', x);
      $('#tooltip').css('top', y);
      $('#tooltip').css('display', 'inline-block');
   });

   // HIDE TOOLTIP EVENT
   $('body').on('mouseout', '.flightpath, .objective, .travel, .hub, .quest', () => { $('#tooltip').css('display', 'none'); });
}

// GENERATE A TOOLTIP ROW FOR QUESTS/OBJECTIVES
function row(category, data) {

   // ROW CONTAINER
   var container = '';

   // CHECK THE GIVEN DATA TYPE
   var type = typeof(data);

   // IF ITS A STRING -- GENERATE & APPEND A SELECTOR
   if (type === 'string') {
      container += '<div class="' + category + '">' + shorten(data) + '</div>';

   // IF ITS AN ARRAY -- GENERATE & APPEND A SELECTOR
   } else {
      container += `
         <div class="` + category + `">
            <div class="split">
               <div id="left">` + shorten(data[0]) + `</div>
               <div id="right">` + data[1] + `</div>
            </div>
         </div>
      `;
   }

   // RETURN THE CONTAINER
   return container;
}

// SHORTEN A LONG STRING
function shorten(string) {
   
   // CHECK IF THE STRING IS LONGER THAN 22 CHARACTERS
   if (string.length > 28) {

      // ALLOW THE FIRST 20 CHARACTERS AND TAG ON THE TRIPLEDOT
      string = string.substring(0, 25);
      string += '...';
   }

   return string;
}

// EXPORT MODULES
module.exports = {
   map: map
}