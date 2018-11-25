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
   $('#footer-inner').css('background-size', data.progress + '% auto');

   // DECLARE INSTANCE TARGET
   var target = data.raw[data.current];

   // LEVEL/XP PROPERTIES -- FORCE TWO DECIMALS
   var level = {
      'current': parseInt(String(target.experience.toFixed(2)).split(".")[0]),
      'xp': parseInt(String(target.experience.toFixed(2)).split(".")[1])
   }

   // RENDER IN LEVEL/XP TEXT & SET BACKGROUND WIDTH
   $('#xp-inner')
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

   // TOOLTIP PADDING DOESNT WORK IN FIREFOX??

   // POSITION THE TOOLTIP CORRECTLY
   var x = event.clientX - (tooltip.width / 2);
   var y = event.clientY - (tooltip.height + (tooltip.offset + (2 * 5)));

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

// PRELOAD EVERY ZONES BACKGROUND
function preload() {

   // PUSH IN SPINNING SELECTOR
   $('#prompt-inner').html('<div id="loading"><div class="lds-css ng-scope"><div style="width:100%;height:100%" class="lds-rolling"><div></div></div></div></div>');

   // TURN THE DISPLAY PROPERTY ON
   $('#prompt').css('display', 'table');

   // WAIT 50MS BEFORE GRADUALLY TURNING OPACITY ON -- TO SMOOTHEN TRANSITION
   sleep(50).then(() => {
      $('#prompt').css('opacity', '1');

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
      zones.forEach(zone => { promises.push(promisify(zone)); });

      // WAIT FOR ALL PROMISES TO BE RESOLVED
      Promise.all(promises).then(() => {

         // CHANGE PRELOAD BUTTONS TEXT & COLOR
         $('#preload').attr('id', 'disabled');
         $('#disabled').text('Backgrounds Loaded');

         // LOG THAT THE TASK IS DONE
         log('Preload complete!');

         // GRADUALLY TURN OFF OPACITY
         $('#prompt').css('opacity', '0');
         
         // WAIT 200MS - THEN OFF LOADING SELECTOR & REMOVE THE ANIMATION ENTIRELY
         sleep(200).then(() => {
            $('#prompt').css('display', 'none');
            $('#loading').remove();
         });
      });
   });
}

// GENERATE A PROMISE
function promisify(zone) {
   return new Promise((resolve, reject) => {

      // CREATE NEW IMAGE OBJECT OF A ZONE
      var img = new Image();
      img.id = zone;
      img.src = 'interface/img/maps/' + zone + '.png';

      // APPEND IT TO THE CONTAINER
      $('#preload-container').append(img);

      // RESOLVE AFTER ITS DONE LOADING
      $('#preload-container #' + zone).on('load', () => { resolve(); })
   });
}

// OPEN FAQ WINDOW
function faq() {

   // GENERATE SELECTOR
   var faq = `
      <div id="faq">
      <div id="title">Frequently Asked Questions</div>
      <div id="content">
         <div id="question">
            <div id="left">Is this based on someone elses work?</div>
            <div id="right">No</div>
         </div>
         <div id="question">
            <div id="left">Is it final/perfect?</div>
            <div id="right">No, but very easy to modify</div>
         </div>
         <div id="question">
            <div id="left">Would I like to collaborate?</div>
            <div id="right">Absolutely</div>
         </div>
         <div id="question">
            <div id="left">Will you route for non-humans?</div>
            <div id="right">Yes</div>
         </div>
         <div id="question">
            <div id="left">Will there be a horde version?</div>
            <div id="right">Yes, probably during xmas</div>
         </div>
         <div id="question">
            <div id="left">How about dungeon "quest run" guides?</div>
            <div id="right">Yes, likely in short video format</div>
         </div>
         <div id="question">
            <div id="left">Do I want feedback/suggestions?</div>
            <div id="right">Yes, it's essential</div>
         </div>
         <div id="question">
            <div id="left">Both mechanical and game related?</div>
            <div id="right">Yes</div>
         </div>
         <div id="question">
            <div id="left">Can I view the suggestion queue?</div>
            <div id="right">Yes, check the todo list</div>
         </div>
         <div id="question">
            <div id="left">Will this require a login?</div>
            <div id="right">No, everything runs locally</div>
         </div>
         <div id="question">
            <div id="left">My question wasn't answered!</div>
            <div id="right">Try the <a href="https://www.reddit.com/r/classicwow/comments/9zxi0v/inbrowser_160_questing_guide_for_classic/?" target="_blank">Reddit Thread</a></div>
         </div>
         <div id="question">
            <div id="left">How do I get in touch?</div>
            <div id="right">Strafir#9133 on <a href="https://discord.gg/classicwow" target="_blank">Discord</a></div>
         </div>
      </div></div>
   `;

   // RENDER IT IN
   $('#prompt-inner').html(faq);

   // TURN THE DISPLAY PROPERTY ON FOR THE PARENT SELECTOR
   $('#prompt').css('display', 'table');

   // WAIT 50MS BEFORE GRADUALLY TURNING OPACITY ON -- TO SMOOTHEN TRANSITION
   sleep(50).then(() => { $('#prompt').css('opacity', '1'); });
}