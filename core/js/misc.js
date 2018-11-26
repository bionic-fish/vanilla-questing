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
   data.progress = ((data.current / data.max) * 100).toFixed(5);

   // CORRECT WEIRD % WIDTH ISSUE
   var width_correction = ((data.progress / 100) * 763.5);
   $('#footer-inner').css('background-size', width_correction + 'px auto');

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

      // ARRAY OF WAYPOINT ALIGN COORDS
      var align = {
         left: { x: -20, y: -6 },
         right: { x: 10, y: -6 },
         top: { x: -5, y: -21 },
         bottom: { x: -5, y: 10 }
      }

      // LOOP THROUGH WAYPOINTS
      $.each(target.waypoints, (id, waypoint) => {

         // SET DEFAULT POSITION FOR WAYPOINT NUMBER
         var align_coords = align.left;
         
         // IF A CUSTOM WAYPOINT IS REQUESTED
         if (waypoint.align != undefined) { align_coords = align[waypoint.align]; }

         // CONSTRUCT WAYPOINT
         var wp = `
            <div class="waypoint" style="left: ` + waypoint.coords.x + `%; top: ` + waypoint.coords.y + `%;">
               <img src="interface/img/waypoints/space.png" class="` + waypoint.type + `" wp="` + id + `"><span id="waypoint-num" style="left: ` + align_coords.x + `;top: ` + align_coords.y + `"><img src="interface/img/numbers/` + (id + 1) + `.png"></span>
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

      // MAP ASSIST SELECTORS
      var block_num = '<span id="block-num">#' + (parseInt(data.current) + 1) + '</span>';
      var legend = '<span id="show-legend">Map Legend</span><div id="tooltip"></div>';
      var tooltip = '<div id="tooltip"></div>';

      // APPEND THEM IN
      $('#map').append(block_num + legend + tooltip);

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
   if (waypoint.header != '') { header += '<div class="header"><div id="left">' + waypoint.header + '</div><div id="right">' + waypoint.coords.x + '.' + waypoint.coords.y + '</div></div>'; }
   waypoint.ends.forEach(quest_name => { ends += '<div class="ends">' + quest_name + '</div>'; });
   waypoint.starts.forEach(quest_name => { starts += '<div class="starts">' + quest_name + '</div>'; });
   waypoint.objectives.forEach(quest_name => { objectives += '<div class="objectives">' + quest_name + '</div>'; });

   // RENDER IN WAYPOINT DATA
   $('#tooltip').html('<div id="tooltip-inner">' + header + ends + starts + objectives + '</div>');

   var height = parseFloat($('#tooltip').css('height'));
   var width = parseFloat($('#tooltip').css('width'));
   var offset = 15;

   // CALCULATE COORDS  
   var x = event.target.offsetParent.offsetLeft - (width / 2);
   var y = event.target.offsetParent.offsetTop - (height + offset);
   
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

      // APPEND IN PRELOAD CONTAINER
      $('body').append('<div id="preload-container"></div>');

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

   // TURN THE DISPLAY PROPERTY ON FOR THE PARENT SELECTOR
   $('#prompt').css('display', 'table');

   // QUESTIONS & ANSWERS
   var questions = [
      ['Is the route based on someone elses work?', 'No'],
      ['Is it final/perfect?', 'No, but very easy to modify'],
      ['Would I like to collaborate?', 'Absolutely'],
      ['Will you route for non-humans?', 'Yes'],
      ['Will there be a horde version?', 'Yes, probably during xmas'],
      ['How about dungeon "quest run" guides?', 'Yes, likely in short video format'],
      ['Do I want feedback/suggestions?', 'Yes, it\'s essential'],
      ['Both mechanical and game related?', 'Yes'],
      ['Will this require a login?', 'No, everything runs locally'],
      ['My question wasn\'t answered!', 'Try the <a href="https://www.reddit.com/r/classicwow/comments/9zxi0v/inbrowser_160_questing_guide_for_classic/?" target="_blank">Reddit Thread</a>'],
      ['How do I get in touch?', 'Strafir#9133 on <a href="https://discord.gg/classicwow" target="_blank">Discord</a>']
   ]

   // GENERATE FAQ SELECTOR
   var faq = `
      <div id="faq">
      <div id="title">Frequently Asked Questions</div>
      <div id="content">
   `;

   // LOOP THROUGH QUESTIONS
   questions.forEach(row => {
      faq += `
         <div id="question">
            <div id="left">` + row[0] + `</div>
            <div id="right">` + row[1] + `</div>
         </div>
      `;
   });

   // STITCH ON ENDING
   faq += '</div></div>';

   // RENDER IT IN
   $('#prompt-inner').html(faq);

   // WAIT 50MS BEFORE GRADUALLY TURNING OPACITY ON -- TO SMOOTHEN TRANSITION
   sleep(50).then(() => { $('#prompt').css('opacity', '1'); });
}

// SHOW LEGEND
function legend(event) {

   // COLOR SCHEMES
   var scheme = [
      ['blue', 'Central Hub'],
      ['yellow', 'Quest'],
      ['red', 'Objective'],
      ['green', 'Flightpath'],
      ['purple', 'Travel'],
   ];

   // GENERATE LEGEND SELECTOR
   var legend = '<div id="legend"><div id="legend-inner">';

   // LOOP THROUGH SCHEMES
   scheme.forEach(row => {
      legend += `
         <div id="wp">
            <div id="left"><img src="interface/img/waypoints/` + row[0] + `.png"></div>
            <div id="right">` + row[1] + `</div>
         </div>
      `;
   });

   // STICH ON ENDING
   legend += '</div></div>';

   // APPEND THE SELECTOR IN
   $('#map').append(legend);

   // INFO BOX HEIGHT & TRIGGER BOX WIDTH
   var height = parseFloat($('#legend').css('height'));
   var width = parseFloat($('#show-legend').css('width'));
   var offset = 15;

   var x = event.target.offsetLeft - (width / 2);
   var y = event.target.offsetTop - (height + offset);

   // EXECUTE CSS CHANGES & SHOW THE DATA
   $('#legend').css('left', x);
   $('#legend').css('top', y);
   $('#legend').css('display', 'inline-block');
}