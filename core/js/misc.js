function set_points(block) {

   // PURGE SELECTORS
   $('#map').html('');
   $('#tooltip').html('');
   $('#tooltip').css('display', 'none');

   // WAIT FOR BOTH PROMISES TO RESOLVE
   $.getJSON('../data/blocks.json').then((response) => {

      // ATTACH CORRECT MAP
      $('#map').css('background', 'url("interface/img/maps/' + response[block].zone + '.jpg")');

      // WAYPOINTS SHORTHAND
      var waypoints = response[block].waypoints;

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

      // SHOW TOOLTIP ON MOUSEOVER
      $('body').on('mouseover', 'img', (event) => {

         // PICK UP DETAILS
         var id = $(event.target).attr('wp');
         var waypoint = waypoints[id];

         // GENERATE WAYPOINT DATA
         var header = '';
         var ends = '';
         var starts = '';
         var objectives = '';

         // GENERATE DIVS FOR FILLED PROPERTIES
         waypoint.ends.forEach(quest_name => { ends += '<div class="ends">' + quest_name + '</div>'; });
         waypoint.starts.forEach(quest_name => { starts += '<div class="starts">' + quest_name + '</div>'; });
         waypoint.objectives.forEach(quest_name => { objectives += '<div class="objectives">' + quest_name + '</div>'; });
         if (waypoint.header != '') { header += '<div class="header">' + waypoint.header + '</div>'; }

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
      
         // SET CSS
         $('#tooltip').css('left', x);
         $('#tooltip').css('top', y);
         $('#tooltip').css('display', 'inline-block');
      });
      
      // HIDE TOOLTIP ON MOUESOUT
      $('body').on('mouseout', 'img', () => { $('#tooltip').css('display', 'none'); });
   });
}

// SHORTHAND FOR CONSOLE LOGGING
function log(stuff) { console.log(stuff); }

// WAIT FOR X MS FUNCTION
function sleep (time) { return new Promise((resolve) => setTimeout(resolve, time)); }