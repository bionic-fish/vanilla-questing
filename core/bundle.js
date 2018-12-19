(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
// FETCH THE BUILD MODULE
var build = require('./modules/build.js')('horde');

// WAIT FOR THE NECESSARY DATA TO COMPILE
build.then((data) => {

   // SETTINGS OBJECT
   var settings = {
      align: {
         left: { x: -20, y: -6 },
         right: { x: 10, y: -6 },
         top: { x: -5, y: -21 },
         bottom: { x: -5, y: 10 }
      },
      windows: {
         preload: 0,
         faq: 0
      },
      maxlength: 28
   }

   // PREPEND IN PROMPT SELECTOR
   $('body').prepend('<div id="prompt"><div id="prompt-inner"></div></div>');

   // RENDER IN BUILD STATISTICS TO HEADER
   $('#block-count').html(data.stats.blocks);
   $('#waypoint-count').html(data.stats.waypoints);
   $('#quest-count').html(data.stats.quests);

   // SET MAX PROPERTY FOR RANGE INPUT
   $('#range').attr('max', data.stats.blocks - 1);

   // FETCH LOCALSTORAGE VALUE
   var reference = localStorage.getItem(data.storage);

   // IMPORT MODULES
   var render = require('./modules/render.js');
   var events = require('./modules/events.js');
   var tooltips = require('./modules/tooltips.js');

   // RENDER THE MAP + ADD EVENTS & TOOLTIPS
   data = render.map(data, settings, reference);
   data = events.map(data, settings, render);
   settings = events.general(settings);
   tooltips.map(data, settings);
});
},{"./modules/build.js":2,"./modules/events.js":3,"./modules/render.js":4,"./modules/tooltips.js":5}],2:[function(require,module,exports){
function build(faction) {

   // PLACEHOLDERS
   var route;
   var quests;

   // ALLIANCE ROUTE DATA & QUEST IDS
   if (faction == 'alliance') {
      route = [
         $.getJSON('../data/alliance/01-elwynn.json'),
         $.getJSON('../data/alliance/02-transition.json'),
         $.getJSON('../data/alliance/03-morogh.json'),
         $.getJSON('../data/alliance/04-loch.json'),
         $.getJSON('../data/alliance/05-transition.json'),
         $.getJSON('../data/alliance/06-darkshore.json'),
         $.getJSON('../data/alliance/07-transition.json'),
         $.getJSON('../data/alliance/08-westfall.json'),
         $.getJSON('../data/alliance/09-transition.json'),
         $.getJSON('../data/alliance/10-redridge.json'),
         $.getJSON('../data/alliance/11-transition.json'),
         $.getJSON('../data/alliance/12-darkshore.json'),
         $.getJSON('../data/alliance/13-ashenvale.json'),
         $.getJSON('../data/alliance/14-transition.json'),
         $.getJSON('../data/alliance/15-menethil.json'),
         $.getJSON('../data/alliance/16-duskwood.json'),
         $.getJSON('../data/alliance/17-transition.json'),
         $.getJSON('../data/alliance/18-duskwood.json'),
         $.getJSON('../data/alliance/19-redridge.json'),
         $.getJSON('../data/alliance/20-duskwood.json'),
         $.getJSON('../data/alliance/21-transition.json'),
         $.getJSON('../data/alliance/22-wetlands.json'),
         $.getJSON('../data/alliance/23-transition.json'),
         $.getJSON('../data/alliance/24-wetlands.json'),
         $.getJSON('../data/alliance/25-transition.json'),
         $.getJSON('../data/alliance/26-duskwood.json'),
         $.getJSON('../data/alliance/27-transition.json'),
         $.getJSON('../data/alliance/28-ashenvale.json'),
         $.getJSON('../data/alliance/29-transition.json'),
         $.getJSON('../data/alliance/30-stv.json'),
         $.getJSON('../data/alliance/31-southshore.json'),
         $.getJSON('../data/alliance/32-arathi.json'),
         $.getJSON('../data/alliance/33-transition.json'),
         $.getJSON('../data/alliance/34-needles.json'),
         $.getJSON('../data/alliance/35-dustwallow.json'),
         $.getJSON('../data/alliance/36-transition.json'),
         $.getJSON('../data/alliance/37-desolace.json'),
         $.getJSON('../data/alliance/38-transition.json'),
         $.getJSON('../data/alliance/39-swamp.json'),
         $.getJSON('../data/alliance/40-transition.json'),
         $.getJSON('../data/alliance/41-arathi.json'),
         $.getJSON('../data/alliance/42-alterac.json'),
         $.getJSON('../data/alliance/43-transition.json'),
         $.getJSON('../data/alliance/44-stv.json'),
         $.getJSON('../data/alliance/45-transition.json'),
         $.getJSON('../data/alliance/46-badlands.json'),
         $.getJSON('../data/alliance/47-transition.json'),
         $.getJSON('../data/alliance/48-stv.json'),
         $.getJSON('../data/alliance/49-tanaris.json'),
         $.getJSON('../data/alliance/50-feralas.json'),
         $.getJSON('../data/alliance/51-transition.json'),
         $.getJSON('../data/alliance/52-hinterlands.json'),
         $.getJSON('../data/alliance/53-transition.json'),
         $.getJSON('../data/alliance/54-blasted.json'),
         $.getJSON('../data/alliance/55-hinterlands.json'),
         $.getJSON('../data/alliance/56-transition.json'),
         $.getJSON('../data/alliance/57-searing.json'),
         $.getJSON('../data/alliance/58-transition.json'),
         $.getJSON('../data/alliance/59-steppes.json'),
         $.getJSON('../data/alliance/60-transition.json'),
         $.getJSON('../data/alliance/61-azshara.json'),
         $.getJSON('../data/alliance/62-ungoro.json'),
         $.getJSON('../data/alliance/63-felwood.json'),
         $.getJSON('../data/alliance/64-transition.json'),
         $.getJSON('../data/alliance/65-feralas.json'),
         $.getJSON('../data/alliance/66-felwood.json'),
         $.getJSON('../data/alliance/67-transition.json'),
         $.getJSON('../data/alliance/68-wpl.json'),
         $.getJSON('../data/alliance/69-epl.json'),
         $.getJSON('../data/alliance/70-transition.json'),
         $.getJSON('../data/alliance/71-felwood.json'),
         $.getJSON('../data/alliance/72-ungoro.json'),
         $.getJSON('../data/alliance/73-winterspring.json'),
         $.getJSON('../data/alliance/74-transition.json'),
         $.getJSON('../data/alliance/75-plaguelands.json')
      ];
      quests = $.getJSON('../data/alliance/00-quest-ids.json');
   
   // HORDE ROUTE & QUEST IDS
   } else {
      route = [$.getJSON('../data/horde/route.json')];
      quests = $.getJSON('../data/horde/00-quest-ids.json');
   }

   // WAIT FOR ALL PROMISES TO BE RESOLVED
   return Promise.all(route).then((response) => {

      // WAIT FOR QUEST-ID PROMISE TO RESOLVE
      return quests.then((ids) => {

         // DECLARE DATA OBJECT
         var data = {
            build: [],
            storage: 'questing-page',
            current: '0',
            stats: {
               blocks: 0,
               waypoints: 0,
               quests: 0,
               progress: 0
            },
            ids: ids
         };

         // LOOK THROUGH EACH 
         response.forEach(block => {
            block.path.forEach(waypoint => {
      
               // PUSH WAYPOINT OBJECT INTO THE CONTAINER
               data.build.push(waypoint);
      
               // INCREMENT BLOCK COUNTER
               data.stats.blocks++;

               // ADD TO WAYPOINT COUNTER
               data.stats.waypoints += waypoint.waypoints.length;
            });
         });

         // SET QUEST COUNT
         data.stats.quests = Object.keys(data.ids).length;

         // IF LOCALSTORAGE IS EMPTY, SET IT TO ZERO
         if (localStorage.getItem(data.storage) === null) { localStorage.setItem(data.storage, '0'); }

         return data;
      });
   });
}

// EXPORT FUNCTION
module.exports = build;
},{}],3:[function(require,module,exports){
// MAP RELATED EVENTS
function map(data, settings, render) {

   // LISTEN FOR KEY-UPS
   $(document).on('keyup', (event) => {

      // WHEN 'A' IS PRESSED
      if (event.keyCode == 65) {
         
         // THE PREVIOUS BLOCK
         var previous = parseInt(data.current) - 1;

         // IF IT FALLS WITHIN RANGE, RENDER MAP AGAIN
         if (previous >= 0) { data = render.map(data, settings, previous); }

      // WHEN 'D' IS PRESSED
      } else if (event.keyCode == 68) {
      
         // THE NEXT BLOCK
         var next = parseInt(data.current) + 1;

         // IF IT FALLS WITHIN RANGE, RENDER MAP AGAIN
         if (next < data.stats.blocks) { data = render.map(data, settings, next); }
      }
   });

   // WHEN THE INPUT RANGE IS USED
   $('#range').on('change', () => { data = render.map(data, settings, $('#range').val()); });

   // DISABLE ARROW KEYS WHEN THE INPUT RANGE IS SELECTED
   $(document).on('keyup keydown', (event) => { if (event.keyCode == 37 || event.keyCode == 38 ||event.keyCode == 39 || event.keyCode == 40) { event.preventDefault(); } });

   // RETURN UPDATED DATA OBJECT
   return data;
}

// GENERAL EVENTS
function general(settings) {

   // FIND MAP COORD ON CLICK
   $('#map').on('click', (event) => {

      // CHECK THAT A WAYPOINT WASNT CLICKED
      if (event.target.tagName != 'IMG') {

         // MAP HEIGHT & WIDTH PROPS
         var map = {
            width: event.currentTarget.clientWidth,
            height: event.currentTarget.clientHeight
         }

         // CLICKED COORDS
         var clicked = {
            x: event.offsetX,
            y: event.offsetY,
         }

         // FIGURE OUT % COORS
         var x = ((clicked.x / map.width) * 100).toFixed(0);
         var y = ((clicked.y / map.height) * 100).toFixed(0);

         // LOG THEM OUT
         log(x + '.' + y)
      }
   });

   // PRELOAD EVENT
   $('#show-preload').on('click', () => {

      // MAKE SURE CHECK PROPERTY IS FALSE
      if (settings.windows.preload == 0) {

         // CHANGE THE SETTING PROPERTY TO BLOCK FURTHER EXECUTIONS
         settings.windows.preload = 1;
         log('Started Preloading..');

         // ADD THE LOADING SELECTOR TO THE PROMPT TABLE & TO TOGGLE THE DISPLAY ON
         $('#prompt-inner').html('<div id="loading"><div class="lds-css ng-scope"><div style="width:100%;height:100%" class="lds-rolling"><div></div></div></div></div>');
         $('#prompt').css('display', 'table');

         // WAIT 50MS TO SMOOTHEN CSS TRANSITION
         sleep(50).then(() => {
         
            // GRADUALLY TURN OPACITY ON
            $('#prompt').css('opacity', '1');

            // LIST OUT ALL ZONES
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

            // GENERATE & PUSH A LOADING PROMISE FOR EACH ZONE
            zones.forEach(zone => { promises.push(zone_promise(zone)); });

            // WAIT FOR ALL PROMISES TO BE RESOLVED
            Promise.all(promises).then(() => {

               // LOG THAT THE TASK IS COMPLETE
               log('Preload Complete!');

               // UPDATE THE PRELOAD LINK
               $('#show-preload').removeAttr('class');
               $('#show-preload').attr('id', 'disabled');
               $('#disabled').text('Backgrounds Loaded');

               // GRADUALLY TURN OPACITY OFF
               $('#prompt').css('opacity', '0');

               // WAIT 200MS FOR THE FADE
               sleep(300).then(() => {

                  // TOGGLE THE PROMP DISPLAY OFF & REMOVE THE LOADING SELECTOR ENTIRELY
                  $('#prompt').css('display', 'none');
                  $('#loading').remove();
               });
            });
         });
      }
   });

   // FAQ EVENT
   $('#show-faq').on('click', () => {

      // MAKE SURE CHECK PROPERTY IS FALSE
      if (settings.windows.faq == 0) {

         // TOGGLE THE PROMPT DISPLAY ON
         $('#prompt').css('display', 'table');

         // LIST OF QUESTIONS & ANSWERS
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
         ];

         // GENERATE A FAQ SELECTOR
         var selector = `
            <div id="faq">
            <div id="title">Frequently Asked Questions</div>
            <div id="content">
         `;

         // LOOP THROUGH QUESTIONS & APPEND IN A ROW FOR EACH ONE
         questions.forEach(row => {
            selector += `
               <div id="question">
                  <div class="split">
                     <div id="left">` + row[0] + `</div>
                     <div id="right">` + row[1] + `</div>
                  </div>
               </div>
            `;
         });

         // STITCH ON THE SELECTORS ENDING
         selector += '</div></div>';

         // RENDER THE SELECTOR INTO THE PROMPT WINDOW
         $('#prompt-inner').html(selector);

         // GRADUALLY TURN THE OPACITY ON AFTER 50MS -- TO SMOOTHEN TRANSITION
         sleep(50).then(() => { $('#prompt').css('opacity', '1'); });

         // WAIT UNTIL THE FADE ENDS & SET THE SETTINGS PROPERTY TO TRUE
         sleep(300).then(() => { settings.windows.faq = 1; })
      }
   });

   // LISTEN FOR KEY PRESSES
   $(document).on('keyup', (evt) => {

      // WHEN 'ESC' IS PRESSED
      if (evt.keyCode == 27) {

         // MAKE SURE CHECK PROPERTY IS FALSE
         if (settings.windows.faq == 1) {

            // GRADUALLY TURN OPACITY OFF
            $('#prompt').css('opacity', '0');

            // WAIT 300 MS, THEN TOGGLE THE PROMPT DISPLAY OFF & SET THE SETTINGS PROPERTY TO FALSE
            sleep(300).then(() => {
               $('#prompt').css('display', 'none');
               settings.windows.faq = 0;
            });
         }
      }

      // WHEN 'F' IS PRESSED
      if (evt.keyCode == 70) {

         // CURRENT DISPLAY VALUE
         var display = $('#sidepanel').css('display');

         // TOGGLE SIDEPANEL & WAYPOINT NUMBERS ON
         if (display == 'none') {
            $('#sidepanel').css('display', 'block');
            $('.waypoint-num').css('display', 'block');

         // TOGGLE SIDEPANEL & WAYPOINT NUMBERS OFF
         } else {
            $('#sidepanel').css('display', 'none');
            $('.waypoint-num').css('display', 'none');
         }
      }

   });

   // SHOW LEGEND EVENT
   $('body').on('mouseover', '#show-legend', (event) => {

      // IF LEGEND SELECTOR DOESNT EXIST FROM BEFORE
      if ($('#legend').length == 0) {

         // LIST OF MARKERS & THEIR MEANING
         var scheme = [
            ['blue', 'Central Hub'],
            ['yellow', 'Quest'],
            ['red', 'Objective'],
            ['green', 'Flightpath'],
            ['purple', 'Travel']
         ];

         var other = [
            ['D', 'Dungeon'],
            ['E', 'Elite'],
            ['F', 'Escort'],
            ['R', 'Random Drop'],
            ['C', 'Class']
         ]

         // GENERATE A LEGEND SELECTOR
         var selector = '<div id="legend"><div id="legend-inner">';

         // LOOP THROUGH SCHEMES & ADD A ROW FOR EACH
         scheme.forEach(row => {
            selector += `
               <div class="category">
                  <div class="split">
                     <div id="left"><img src="interface/img/waypoints/` + row[0] + `.png"></div>
                     <div id="right">` + row[1] + `</div>
                  </div>
               </div>
            `;
         });

         // LOOP THROUGH OTHERS & ADD A ROW FOR EACH
         other.forEach(row => {
            selector += `
               <div class="category">
                  <div class="split">
                     <div id="left">[` + row[0] + `]</div>
                     <div id="right">` + row[1] + `</div>
                  </div>
               </div>
            `;
         });

         // STICH ON THE ENDING
         selector += '</div></div>';

         // APPEND THE SELECTOR IN
         $('#map').append(selector);
      }

      // ASSIST VARS FOR POSITION CALIBRATION
      var height = parseFloat($('#legend').css('height'));
      var width = parseFloat($('#show-legend').css('width'));
      var offset = 10;

      // CALIBRATE RIGHT XY COORDINATES
      var x = event.target.offsetLeft - (width / 2);
      var y = event.target.offsetTop - (height + offset);

      // EXECUTE CSS CHANGES & SHOW THE DATA
      $('#legend').css('left', x);
      $('#legend').css('top', y);
      $('#legend').css('display', 'inline-block');
   });

   // HIDE LEGEND EVENT
   $('body').on('mouseout', '#show-legend', () => { $('#legend').css('display', 'none'); });

   // SHOW OBJECTIVES EVENT
   $('body').on('click', '#show-obj', () => {

      // PICK UP TARGET CLASS ATTRIBUTE
      var check = $(this).attr('class');

      // IF IT ISNT CURRENT
      if (check != 'current') {

         // FLIP CURRENT
         $('#show-quests').removeAttr('class');
         $('#show-obj').attr('class', 'current');

         // FLIP WHICH PANEL IS SHOWN
         $('#quest-log').css('display', 'none');
         $('#obj-log').css('display', 'block');

      // ELSE LOG ERROR
      } else { log('Tab Already Open!'); }
   });

   // SHOW QUESTS EVENT
   $('body').on('click', '#show-quests', () => {

      // PICK UP TARGET CLASS ATTRIBUTE
      var check = $(this).attr('class');

      // IF IT ISNT CURRENT
      if (check != 'current') {

         // FLIP CURRENT
         $('#show-obj').removeAttr('class');
         $('#show-quests').attr('class', 'current');

         // FLIP WHICH PANEL IS SHOWN
         $('#obj-log').css('display', 'none');
         $('#quest-log').css('display', 'block');

      // ELSE LOG ERROR
      } else { log('Tab Already Open!'); }
   });

   // RETURN UPDATED SETTINGS OBJECT
   return settings;
}

// GENERATE A PROMISE FOR A ZONE -- FOR PRELOADING
function zone_promise(zone) {
   return new Promise((resolve, reject) => {
      $.get('interface/img/maps/' + zone + '.png').done(() => { resolve(); });
   });
}

// EXPORT FUNCTIONS
module.exports = {
   map: map,
   general: general
}
},{}],4:[function(require,module,exports){
// RENDER EVERYTHING
function map(data, settings, reference) {

   // UPDATE CURRENT PROP & LOCALSTORAGE
   data.current = reference;
   localStorage.setItem(data.storage, String(reference));

   // CONVERT STRING TO INT FOR EASIER USAGE LATER
   var current = parseInt(data.current);

   // UPDATE THE RANGE SCROLLERS POSITION
   $('#range').val(current);

   // GRADUALLY TURN OPACITY OFF FROM MAP & SIDEPANEL
   $('#map').css('opacity', 0);
   $('#sidepanel-inner').css('opacity', 0);

   // CALIBRATE PROGRESS & SET THE PROPERTY
   data.stats.progress = ((current / (data.stats.blocks - 1)) * 100);

   // ADD ONE FOR VISUAL PURPOSES
   var current_fixed = current + 1;

   // CHANGE PROGRESS BAR TEXT & SIZE
   $('#progress-inner').html('#' + current_fixed + ' &#160;&ndash;&#160; ' + (data.stats.progress).toFixed(2) + '%');
   $('#progress-focus').css('width', data.stats.progress + '%');

   // TARGET SPECIFIC DATASET
   var target = data.build[current];

   // SEPARATE THE LEVEL & XP FROM THE EXPERIENCE PROPERTY
   var level = parseInt(String(target.experience.toFixed(2)).split(".")[0]);
   var xp = parseInt(String(target.experience.toFixed(2)).split(".")[1]);

   // CHANGE LEVEL BAR TEXT & SIZE
   $('#level-inner').html('Level ' + level + ' + ' + xp + '%');
   $('#level-focus').css('width', xp + '%');

   // WAIT 300MS, THEN START UPDATING MAP
   sleep(300).then(() => {
   
      // EMPTY THE MAP & TOOLTIP SELECTORS & TURN OFF THE TOOLTIP TO AVOID FLICKERING
      $('#map, #tooltip').html('');
      $('#tooltip').css('display', 'none');

      // SET THE CORRECT ZONE BACKGROUND TO THE MAP
      $('#map').css('background', 'url("interface/img/maps/' + target.zone + '.png")');

      // LOOP THROUGH EACH WAYPOINT IN BLOCK
      $.each(target.waypoints, (id, waypoint) => {

         // SET THE DEFAULT NUMBER POSITION TO LEFT
         var align_coords = settings.align.left;
         
         // CHECK WHETHER ANOTHER ALIGNMENT WAS REQUESTED -- OVERWRITE
         if (waypoint.align != undefined) { align_coords = settings.align[waypoint.align]; }

         // GENERATE A WAYPOINT SELECTOR
         var point = `
            <div class="waypoint" style="left: ` + waypoint.coords.x + `%; top: ` + waypoint.coords.y + `%;">
               <img src="interface/img/waypoints/space.png" class="` + waypoint.type + `" wp="` + id + `"><span class="waypoint-num" style="left: ` + align_coords.x + `;top: ` + align_coords.y + `"><img src="interface/img/numbers/` + (id + 1) + `.png"></span>
            </div>
         `;

         // APPEND IT TO THE MAP
         $('#map').append(point);
      });

      // LINE CONTAINER
      var lines = '';

      // GENERATE LINES BETWEEN FIRST & SECOND TO LAST WAYPOINTS
      for(var x = 0; x < target.waypoints.length - 1; x++) {
         lines += '<line x1="' + target.waypoints[x].coords.x + '%" y1="' + target.waypoints[x].coords.y + '%" x2="' + target.waypoints[x + 1].coords.x + '%" y2="' + target.waypoints[x + 1].coords.y + '%"/>';
      }

      // APPEND IN AN SVG CANVAS & LINES ONTOP OF THE MAP
      $('#map').append('<svg>' + lines + '</svg>');

      // GENERATE ADDITIONAL ASSIST SELECTORS
      var legend = '<span id="show-legend">Map Legend</span>';
      var hs = '<span id="hearthstone"><span id="hearthstone-inner">None</span></span>';
      var tooltip = '<div id="tooltip"></div>';

      // RENDER THEM IN
      $('#map').append(legend + hs + tooltip);

      // RENDER SIDEPANEL CONTENT
      sidepanel(data, settings);

      // RENDER HEARTHSTONE LOCATION
      hearthstone(data);

      // GRADUALLY TURN OPACITY ON AGAIN
      $('#map').css('opacity', 1);
      $('#sidepanel-inner').css('opacity', 1);
   });

   return data;
}

// GENERATE OVERLOOK FOR THE CURRENT BLOCK
function sidepanel(data, settings) {

   // ASSIST VARS
   var target = data.build[data.current].waypoints;   
   var ids = data.ids;

   // FETCH OBJECTIVES & QUESTS
   var obj = objectives(target, ids, settings);
   var qs = quests(data, settings);

   // RENDER THE NEW INFO IN
   $('#obj-log').html(obj);
   $('#quest-log').html(qs);
}

// GENERATE SIDEPANEL ROW
function row(category, data, settings, ids) {

   // ROW CONTAINER
   var container = '';

   // CHECK THE GIVEN DATA TYPE
   var type = typeof(data);

   // IF ITS A STRING -- GENERATE & APPEND A SELECTOR
   if (type === 'string') {
      container += '<div class="' + category + '"><a href="https://classicdb.ch/?quest=' + ids[data.toLowerCase()] + '" target="_blank">' + shorten(data, settings) + '</a></div>';

   // IF ITS AN ARRAY -- GENERATE & APPEND A SELECTOR
   } else {
      container += `
         <div class="` + category + `">
            <div class="split">
               <div id="left"><a href="https://classicdb.ch/?quest=` + ids[data[0].toLowerCase()] + `" target="_blank">` + shorten(data[0], settings) + `</a></div>
               <div id="right">` + data[1] + `</div>
            </div>
         </div>
      `;
   }

   // RETURN THE CONTAINER
   return container;
}

// GET BLOCK OBJECTIVES
function objectives(target, ids, settings) {

   // INITIAL CONTAINER
   var container = '';

   // LOOP THROUGH EACH WAYPOINT
   $.each(target, (index, waypoint) => {
   
      // MAKE INDEX MORE READER FRIENDLY
      var count = index + 1;

      // GENERATE A SELECTOR & PUSH IT TO THE CONTAINER
      container += `
         <div class="section">
            <div class="title">
               <div class="split">
                  <div id="left">` + count + `. ` + waypoint.header + `</div>
                  <div id="right"></div>
               </div>
            </div>
      `;

      // LOOP THROUGH ENDS, STARTS & OBJECTIVES CONTENT THAT ARE DEFINED
      if (waypoint.ends != undefined) { waypoint.ends.forEach(details => { container += row('ends', details, settings, ids); }); }
      if (waypoint.starts != undefined) { waypoint.starts.forEach(details => { container += row('starts', details, settings, ids); }); }
      if (waypoint.objectives != undefined) { waypoint.objectives.forEach(details => { container += row('objectives', details, settings, ids); }); }
      if (waypoint.special != undefined) { waypoint.special.forEach(details => { container += '<div class="special">' + details + '</div>'; }); }

      // ADD ON SUFFIX
      container += '</div>';
   });

   return container;
}

// GET BLOCK QUESTS
function quests(data, settings) {

   // INITIAL CONTAINER
   var quests = {};

   // LIST OF QUESTS TO IGNORE
   var blacklist = [
      "The Lost Dwarves",
      "Back to Uldaman",
      "Into the Depths",
      "Secret of the Circle",
      "Legends of Maraudon",
      "The Essence of Eranikus",
      "Marshal Windsor",
      "Kharan Mighthammer",
      "Dark Iron Legacy",
      "Attunement to the Core",
      "The Fate of the Kingdom",
      "A Crumpled Up Note"
   ];

   // LOOP THROUGH DATA TO CURRENT BLOCK
   for (var x = 0; x < data.current; x++) {

      // WAYPOINTS SHORTHAND
      var waypoints = data.build[x].waypoints;

      // LOOP THROUGH EACH WAYPOINT
      waypoints.forEach(waypoint => {
      
         // ADD EVERY STARTED QUEST
         if (waypoint.starts != undefined) {

            waypoint.starts.forEach(quest => {
               
               // STRING
               if (typeof(quest) != 'string') {

                  // CHECK IF THE QUEST IS BLACKLISTED
                  var check = $.inArray(quest[0], blacklist);
                  if (check == -1) { quests[quest[0]] = 0; }

               // ARRAY
               } else {
                  
                  // CHECK IF THE QUEST IS BLACKLISTED
                  var check = $.inArray(quest, blacklist);
                  if (check == -1) { quests[quest] = 0; }

               }

            });
         }

         // REMOVE EVERY ENDED QUEST
         if (waypoint.ends != undefined) {

            waypoint.ends.forEach(quest => {
               
               // STRING
               if (typeof(quest) != 'string') {
                  delete quests[quest[0]];
               
               // ARRAY
               } else {
                  delete quests[quest];
               }

            });
         }
      });
   }

   // TRANSFORM OBJECT INTO KEYS
   quests = Object.keys(quests);

   // CONTAINER + HEADER
   var content = `
      <div class="title">
         <div class="split">
            <div id="left">Current Quests</div>
            <div id="right">` + quests.length + ` / 20</div>
         </div>
      </div>
   `;

   // GENERATE ROWS & WRAPPER
   quests.forEach(name => { content += `<div class="ends"><a href="https://classicdb.ch/?quest=` + data.ids[name.toLowerCase()] + `" target="_blank">` + shorten(name, settings) + `</a></div>`; });
   content = '<div class="section">' + content + '</div>';

   return content;
}

function hearthstone(data) {

   // LOCATION PLACEHOLDER
   var location = 'none';

   for (var x = data.current; x >= 0; x--) {

      // BREAK THE LOOP AFTER THE FIRST HIT
      if (location != 'none') { break; }

      // WAYPOINTS SHORTHAND
      var waypoints = data.build[x].waypoints;

      // LOOP THROUGH EACH WAYPOINT
      waypoints.forEach(waypoint => {
      
         // MAKE SURE SPECIAL ARRAY ISNT UNDEFINED
         if (waypoint.special != undefined) {

            // LOOP THROUGH MESSAGES
            waypoint.special.forEach(message => {

               // FORCE LOWERCASE
               message = message.toLowerCase();

               // SET AS THE LOCATION WHEN THE KEYWORD IS FOUND
               if (message == 'set hearthstone') { location = capitalize(data.build[x].zone); }
            });
         }
      });
   }

   // CAPITALIZE IF STV
   if (location == 'Stv') { location = 'STV'; }

   $('#hearthstone-inner').html(location);
}

// EXPORT MODULES
module.exports = {
   map: map
}
},{}],5:[function(require,module,exports){
// RENDER EVERYTHING
function map(data, settings) {

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
      if (waypoint.ends != undefined) { waypoint.ends.forEach(data => { container += row('ends', data, settings); }); }
      if (waypoint.starts != undefined) { waypoint.starts.forEach(data => { container += row('starts', data, settings); }); }
      if (waypoint.objectives != undefined) { waypoint.objectives.forEach(data => { container += row('objectives', data, settings); }); }
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
function row(category, data, settings) {

   // ROW CONTAINER
   var container = '';

   // CHECK THE GIVEN DATA TYPE
   var type = typeof(data);

   // IF ITS A STRING -- GENERATE & APPEND A SELECTOR
   if (type === 'string') {
      container += '<div class="' + category + '">' + shorten(data, settings) + '</div>';

   // IF ITS AN ARRAY -- GENERATE & APPEND A SELECTOR
   } else {
      container += `
         <div class="` + category + `">
            <div class="split">
               <div id="left">` + shorten(data[0], settings) + `</div>
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
},{}]},{},[1]);
