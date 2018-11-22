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
      block.path.forEach(waypoint => { container.push(waypoint); });
   });

   return container;
}

// RENDER IN MAP CONTENT FROM QUERY
function render(data, current, max) {

   // GRADUALLY TURN OPACITY OFF
   $('#map').css('opacity', 0);

   // WAIT 200 MS
   sleep(200).then(() => {

      // BIND TARGET BLOCK
      var target = data[current];

      // PURGE THE MAP & TOOLTIP OF OLD CONTENT
      $('#map, #tooltip').html('');

      // SPLIT JSON PROPERTY FOR CLARITY
      var level = parseInt(String(target.experience).split(".")[0]);
      var xp = parseInt(String(target.experience).split(".")[1]);
      var percent = (current / max) * 100;

      // RENDER IN LEVEL/XP TEXT & SET BACKGROUND WIDTH
      $('#experience #inner')
         .html('Level ' + level + ' + ' + xp + '%')
         .css('background-size', xp + '% auto');

      // MOVE THE RANGE SCROLLER
      $('#range').val(current);

      // FILL THE LEFT SIDE OF THE RANGE BAR
      $('#footer #inner').css('background-size', percent + '% auto');

      // TURN OFF THE TOOLTIP WITH CSS TO AVOID FLICKERING
      $('#tooltip').css('display', 'none');

      // ATTACH CORRECT ZONE MAP AS BACKGROUND
      $('#map').css('background', 'url("interface/img/maps/' + target.zone + '.png")');

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
         lines += '<line x1="' + target.waypoints[x].coords.x + '%" y1="' + target.waypoints[x].coords.y + '%" x2="' + target.waypoints[x + 1].coords.x + '%" y2="' + target.waypoints[x + 1].coords.y + '%"/>';
      }

      // APPEND AN SVG ONTOP OF THE BACKGROUND & THE WAYPOINT LINES
      $('#map').append('<svg>' + lines + '</svg>');

      // APPEND IN THE BLOCK NUMBER
      $('#map').append('<span id="block-num">#' + current + '</span>');

      // GRADUALLY TURN OPACITY ON AFTER EVERYTHING ELSE IS DONE
      $('#map').css('opacity', 1);
   });
}

// RENDER MOUSEOVER
function mouseover(event, target) {

   // PICK UP & BIND RELEVANT DATA
   var id = $(event.target).attr('wp');
   var waypoint = target.waypoints[id];

   // DECLARE EMPTY TOOLTIP CONTAINERS
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

   // POSITION THE TOOLTIP CORRECTLY
   var x = event.target.x - (tooltip.width / 2);
   var y = event.target.y - (tooltip.height + (tooltip.offset + (2 * tooltip.padding)));

   // EXECUTE CSS CHANGES & SHOW THE DATA
   $('#tooltip').css('left', x);
   $('#tooltip').css('top', y);
   $('#tooltip').css('display', 'inline-block');
}

// FIGURE OUT QUEST LOG
function quests(data, current) {

   var quests = {};

   // FIND EACH WAYPOINT
   for (var x = 0; x < current; x++) {
      var waypoints = data[x].waypoints;
      
      // LOOP THROUGH EACH WAYPOINT ARRAY
      for (var y = 0; y < waypoints.length; y++) {

         // BIND STARTS/ENDS ARRAYS
         var starts = waypoints[y].starts;
         var ends = waypoints[y].ends;

         // ADD NEW QUESTS & REMOVE OLD ONES
         starts.forEach(quest => { quests[quest] = 0; });
         ends.forEach(quest => { delete quests[quest]; });
      }
   }

   var final = Object.keys(quests);
   var str = '<div id="item"><div id="title">Quests Currently:</div><div id="prop">' + final.length + '/20</div></div>';

   for (var z = 0; z < final.length; z++) {
      str += '<div id="quest">' + final[z] + '</div>';
   }

   $('#quests #inner').html(str);
}