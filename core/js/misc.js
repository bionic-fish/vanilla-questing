// SHORTHAND FOR CONSOLE LOGGING
function log(stuff) { console.log(stuff); }

// WAIT FOR X MS FUNCTION
function sleep (time) { return new Promise((resolve) => setTimeout(resolve, time)); }

// BUILD UNITED JSON FILE FROM ALL THE SMALL PIECES
function build(data) {

   // CONTAINED FOR PARSED DATA
   var container = [];

   // LOOP THROUGH & PUSH EVERY BLOCK TO THE CONTAINER
   data.forEach(block => {
      var path_array = block.path;
      path_array.forEach(waypoint => { container.push(waypoint); });
   });

   return container;
}

// RENDER IN MAP CONTENT FROM QUERY
function render(data, current) {

   // BIND TARGET BLOCK
   var target = data[current];

   // GRADUALLY TURN OPACITY OFF
   $('#map').css('opacity', 0);

   // WAIT 200 MS
   sleep(200).then(() => {

      // RENDER IN PAGE-NUMBER & EXPERIENCE
      $('#current').html('#' + current);
      $('#experience').html('Level ' + target.experience + '%');

      // PURGE THE MAP & TOOLTIP THEIR CONTENT
      $('#map').html('');
      $('#tooltip').html('');

      // TURN OFF THE TOOLTIP WITH CSS TO AVOID FLICKERING
      $('#tooltip').css('display', 'none');

      // ATTACH CORRECT ZONE BACKGROUND
      $('#map').css('background', 'url("interface/img/maps/' + target.zone + '.jpg")');

      // LOOP THROUGH WAYPOINTS
      $.each(target.waypoints, (id, waypoint) => {
         
         // CONSTRUCT WAYPOINT
         var wp = `
            <div class="waypoint" style="left: ` + waypoint.coords.x + `%; top: ` + waypoint.coords.y + `%;">
               <img src="interface/img/waypoints/space.png" class="` + waypoint.type + `" wp="` + id + `">
            </div>
         `;

         // APPEND WAYPOINT TO THE MAP
         $('#map').append(wp);
      });

      // LINE CONTAINER
      var lines = '';

      // GENERATE LINES BETWEEN FIRST & SECOND TO LAST WAYPOINTS
      for(var x = 0; x < target.waypoints.length - 1; x++) {
         var line = '<line x1="' + target.waypoints[x].coords.x + '%" y1="' + target.waypoints[x].coords.y + '%" x2="' + target.waypoints[x + 1].coords.x + '%" y2="' + target.waypoints[x + 1].coords.y + '%"/>';
         lines += line;
      }

      // APPEND AN SVG ONTOP OF THE BACKGROUND & THE WAYPOINT LINES
      $('#map').append('<svg>' + lines + '</svg>');

      // GRADUALLY TURN OPACITY ON
      $('#map').css('opacity', 1);
   });
}

// RENDER MOUSEOVER
function mouseover(event, target) {

   // PICK UP & BIND RELEVANT DATA
   var id = $(event.target).attr('wp');
   var waypoint = target.waypoints[id];

   // GENERATE WAYPOINT DATA
   var header = '';
   var ends = '';
   var starts = '';
   var objectives = '';

   // GENERATE DIVS FOR FILLED PROPERTIES
   if (waypoint.header != '') { header += '<div class="header">' + waypoint.header + '</div>'; }
   waypoint.ends.forEach(quest_name => { ends += '<div class="ends">' + quest_name + '</div>'; });
   waypoint.starts.forEach(quest_name => { starts += '<div class="starts">' + quest_name + '</div>'; });
   waypoint.objectives.forEach(quest_name => { objectives += '<div class="objectives">' + quest_name + '</div>'; });

   // RENDER IN WAYPOINT DATA
   $('#tooltip').html(header + ends + starts + objectives);

   // TOOLTIP PROPERTIES
   var tooltip = {
      width: parseFloat($('#tooltip').css('width')),
      height: parseFloat($('#tooltip').css('height')),
      padding: parseInt($('#tooltip').css('padding')[0]),
      offset: 5
   }

   // FIGURE OUT THE XY POSITION WITH OFFSETS
   var x = event.target.x - (tooltip.width / 2);
   var y = event.target.y - (tooltip.height + (tooltip.offset + (2 * tooltip.padding)));

   // SET CSS COORDINATES & SHOW THE DATA
   $('#tooltip').css('left', x);
   $('#tooltip').css('top', y);
   $('#tooltip').css('display', 'inline-block');
}