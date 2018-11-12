function set_points(block, response) {

   $('#map').css('opacity', 0);

   sleep(200).then(() => {

      // PURGE SELECTORS
      $('#map').html('');
      $('#tooltip').html('');
      $('#tooltip').css('display', 'none');

      // ATTACH CORRECT MAP
      $('#map').css('background', 'url("interface/img/maps/' + response.blocks[block].zone + '.jpg")');

      // WAYPOINTS SHORTHAND
      var waypoints = response.blocks[block].waypoints;

      // LOOP THROUGH EACH WAYPOINT OF THIS BLOCK
      $.each(waypoints, (id, waypoint) => {
         
         // CONSTRUCT WAYPOINT
         var wp = `
            <div class="waypoint" style="left: ` + waypoint.coords.x + `%; top: ` + waypoint.coords.y + `%;">
               <img src="interface/img/waypoints/space.png" class="` + waypoint.type + `" wp="` + id + `">
            </div>
         `;

         // APPEND IT TO THE MAP
         $('#map').append(wp);
      });

      // LINE CONTAINER
      var lines = '';

      // GENERATE LINES
      for(var x = 0; x < waypoints.length - 1; x++) {
         var line = '<line x1="' + waypoints[x].coords.x + '%" y1="' + waypoints[x].coords.y + '%" x2="' + waypoints[x + 1].coords.x + '%" y2="' + waypoints[x + 1].coords.y + '%"/>';
         lines += line;
      }

      // APPEND AN SVG ONTOP OF THE BACKGROUND & DRAW LINES
      $('#map').append('<svg>' + lines + '</svg>');

      $('#map').css('opacity', 1);
   });
}

// SHORTHAND FOR CONSOLE LOGGING
function log(stuff) { console.log(stuff); }

// WAIT FOR X MS FUNCTION
function sleep (time) { return new Promise((resolve) => setTimeout(resolve, time)); }