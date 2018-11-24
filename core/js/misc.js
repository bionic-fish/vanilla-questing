// SHORTHAND FOR CONSOLE LOGGING
function log(stuff) { console.log(stuff); }

// WAIT FOR X MS FUNCTION
function sleep (time) { return new Promise((resolve) => setTimeout(resolve, time)); }

// BUILD UNITED JSON FILE FROM ALL THE SMALL PIECES
function build(data) {

   // DECLARE RAW DATA CONTAINER
   data.raw = [];

   // DECLARE BUILD PROP
   data.build = {
      'blocks': 0,
      'waypoints': 0,
      'quests': 0
   };

   // LOOP THROUGH & PUSH EVERY BLOCK TO THE CONTAINER
   data.forEach(block => {
      block.path.forEach(waypoint => {

         // PUSH WAYPOINT OBJECT INTO THE CONTAINER
         data.raw.push(waypoint);

         // INCREMENT BLOCK COUNTER
         data.build.blocks++;
         
         // INCREMENT WAYPOINT COUNTER
         waypoint.waypoints.forEach(foo => {
            data.build.waypoints++;

            // INCREMENT QUEST COUNTER
            foo.starts.forEach(bar => { data.build.quests++; });
         });
      });
   });

   // SET MAX PROPERTY
   data.max = data.raw.length;

   return data;
}

// RENDER IN MAP CONTENT FROM QUERY
function render(data, settings, ref) {

   // UPDATE DATA CURRENT
   data.current = ref;

   // UPDATE LOCALSTORAGE
   localStorage.setItem(settings.localstorage, String(data.current));

   // UPDATE RANGE SCROLLER
   $('#range').val(data.current);

   // GRADUALLY TURN OPACITY OFF
   $('#map').css('opacity', 0);

   // RECALIBRATE NEW DATA PROGRESS & SET FOOTER BACKGROUND ACCORDINGLY
   data.progress = (data.current / data.max) * 100;
   $('#footer #inner').css('background-size', data.progress + '% auto');

   // DECLARE INSTANCE TARGET
   var target = data.raw[data.current];

   // LEVEL/XP PROPERTIES -- FORCE TWO DECIMALS
   var level = {
      'current': parseInt(String(target.experience.toFixed(2)).split(".")[0]),
      'xp': parseInt(String(target.experience.toFixed(2)).split(".")[1])
   }

   // RENDER IN LEVEL/XP TEXT & SET BACKGROUND WIDTH
   $('#experience #inner')
      .html('Level ' + level.current + ' + ' + level.xp + '%')
      .css('background-size', level.xp + '% auto');

   // WAIT 300 MS -- THEN UPDATE MAP
   sleep(300).then(() => {

      // PURGE THE MAP & TOOLTIP OF OLD CONTENT -- ALSO TURN OFF THE TOOLTIP TO AVOID FLICKERING
      $('#map, #tooltip').html('');
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
      $('#map').append('<span id="block-num">#' + data.current + '</span>');

      // GRADUALLY TURN OPACITY ON AFTER EVERYTHING ELSE IS DONE
      $('#map').css('opacity', 1);
   });

   return data;
}

// RENDER MOUSEOVER
function mouseover(event, data) {

   // DECLARE TARGET
   var target = data.raw[data.current];

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

function preload_zones() {

   // ALL THE ZONES & DECLARE PROMISE ARRAY
   var zones = [
      'alterac',
      'arathi',
      'ashenvale',
      'azshara',
      'badlands',
      'barrens',
      'blasted',
      'darkshore',
      'darnassus',
      'deadwind',
      'desolace',
      'duskwood',
      'dustwallow',
      'elwynn',
      'epl',
      'farmfarmfarm',
      'felwood',
      'feralas',
      'hillsbrad',
      'hinterlands',
      'ironforge',
      'loch',
      'moonglade',
      'morogh',
      'needles',
      'redridge',
      'searing',
      'steppes',
      'stonetalon',
      'stormwind',
      'stv',
      'swamp',
      'tanaris',
      'teldrassil',
      'tirisfal',
      'ungoro',
      'westfall',
      'wetlands',
      'winterspring',
      'wpl'
   ];

   // PROMISE CONTAINER
   var promises = [];

   // MAKE A PROMISE FOR EACH ZONE & PUSH IT TO THE CONTAINER
   zones.forEach(zone => {
      var promise = promisify(zone);
      promises.push(promise);
   });

   // WAIT FOR ALL PROMISES TO BE RESOLVED
   Promise.all(promises).then(() => {

      // LOG THAT THE TASK IS DONE
      log('loading done!');
   });
}

// GENERATE A PROMISE
function promisify(zone) {
   return new Promise((resolve, reject) => {

      // CREATE NEW IMAGE OBJECT OF A ZONE
      var img = new Image();
      img.id = zone;
      img.src = 'http://www.vanilla-questing.me/interface/img/maps/' + zone + '.png';

      // APPEND IT TO THE CONTAINER
      $('#bg-load').append(img);

      // RESOLVE AFTER ITS DONE LOADING
      $('#bg-load #' + zone).on('load', () => { resolve(); })
   });
}