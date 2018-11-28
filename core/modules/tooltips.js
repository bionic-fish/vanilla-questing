// RENDER EVERYTHING
function map(data) {

   // SHOW TOOLTIP EVENT
   $('body').on('mouseover', '.flightpath, .objective, .travel, .hub, .quest', (event) => {
      
      // TARGET DATASET
      var target = data.build[data.current];

      // PICK UP ID ATTRIBUTE & USE IT TO FIND THE CORRECT WAYPOINT
      var id = $(event.target).attr('wp');
      var waypoint = target.waypoints[id];

      // SELECTOR CONTAINERS
      var title = '';
      var ends = '';
      var starts = '';
      var objectives = '';

      // GENERATE A HEADER ROW
      if (waypoint.header != '') {
         title += `
            <div class="title">
               <div class="split">
                  <div id="left">` + waypoint.header + `</div>
                  <div id="right">` + waypoint.coords.x + `.` + waypoint.coords.y + `</div>
               </div>
            </div>
         `;
      }

      // LOOP THROUGH & GENERATE A SELECTOR FOR EACH QUEST/OBJCTIVE
      waypoint.ends.forEach(data => { ends += row('ends', data); });
      waypoint.starts.forEach(data => { starts += row('starts', data); });
      waypoint.objectives.forEach(data => { objectives += row('objectives', data); });

      // RENDER IN THE ENTIRE TOOLTIP
      $('#tooltip').html('<div id="tooltip-inner">' + title + ends + starts + objectives + '</div>');

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
      container += '<div class="' + category + '">' + data + '</div>';

   // IF ITS AN ARRAY -- GENERATE & APPEND A SELECTOR
   } else {
      container += `
         <div class="` + category + `">
            <div class="split">
               <div id="left">` + data[0] + `</div>
               <div id="right">` + data[1] + `</div>
            </div>
         </div>
      `;
   }

   // RETURN THE CONTAINER
   return container;
}

// EXPORT MODULES
module.exports = {
   map: map
}