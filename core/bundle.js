(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
// FETCH NEEDED MODULES
var func = require('./modules/func.js');
var events = require('./modules/events.js');
var build = require('./modules/build.js');
var storage = require('./modules/storage.js');
var render = require('./modules/render.js');

// START THE LOADING PROMPT
func.loading();

// GLOBAL SETTINGS OBJECT
var settings = {
   background: { width: 1440, height: 960 },
   storage: 'vanilla-questing',
   cooldown: 1000
}

// CHECK STORAGE
storage.check(settings.storage);

// CENTER THE MAP WHEN WINDOW SIZE CHANGES
$(window).resize(() => { func.center_map(settings); });

// ADD VARIOUS EVENTS
events.move_map(settings.background);
events.map_highlight();
events.submenu();
events.log_menu();
events.preload(func);
events.new_profile(func, storage, render, build);
events.load(func, storage, render, build);

// RENDER RANDOM BLOCK ON LOAD
build.random().then((data) => {

   // RENDER A RANDOM BLOCK & ENABLE BROWSING ON LOAD
   render.map(data);

   // CENTER THE MAP IF THE WINDOW IS LARGER THAN THE THE BACKGROUND
   func.center_map(settings);

   // ENABLE BROWSING
   events.browsing(data, render, settings, storage);
   events.handheld_browsing(render, storage);

   // CLOSE THE LOADING PROMPT AFTER 1s
   sleep(settings.cooldown).then(() => { func.close_prompt(); });
});
},{"./modules/build.js":2,"./modules/events.js":3,"./modules/func.js":4,"./modules/render.js":5,"./modules/storage.js":6}],2:[function(require,module,exports){
// ASSEMBLE JSON DATA
function route(race) {

   var alliance = ['human', 'dwarf', 'gnome', 'nelf'];
   var horde = ['orc', 'troll', 'tauren', 'undead'];

   var promises = [];

   // ALLIANCE BUILD
   if ($.inArray(race, alliance) != -1) {

      // CONVERT DWARF & GNOME QUERIES TO 'GNORF'
      if (race == 'dwarf' || race == 'gnome') { race = 'gnorf'; }

      // FIND RELEVANT FILES
      promises = [
         $.getJSON('../data/alliance/quests.json'),
         $.getJSON('../data/alliance/' + race + '.json'),
         $.getJSON('../data/alliance/shared.json'),
      ];

   // HORDE BUILD
   } else if ($.inArray(race, horde) != -1) {
  
      // CONVERT TROLL AND ORC QUERIES TO 'TRORC'
      if (race == 'troll' || race == 'orc') { race = 'trorc'; }

      // FIND RELEVANT FILES
      promises = [
         $.getJSON('../data/horde/quests.json'),
         $.getJSON('../data/horde/' + race + '.json'),
         $.getJSON('../data/horde/shared.json'),
      ];

   // DEVELOPMENT
   } else if (race == 'dev') {
      promises = [
         $.getJSON('../data/dev/quests.json'),
         $.getJSON('../data/dev/route.json'),
      ];
   }

   // WAIT FOR THE REQUESTED PROMISE TO RESOLVE
   return Promise.all(promises).then((response) => {

      // DATA OBJECT
      var data = {
         quests: response[0],
         route: response[1]
      };

      // IF THE ROUTE CONSISTS OF TWO PARTS
      if (response.length == 3) {

         // CONTAINER
         var combined = [];

         // PUSH BOTH INTO THE CONTAINER
         response[1].path.forEach(block => { combined.push(block); });
         response[2].path.forEach(block => { combined.push(block); });

         // SET THE NEW ROUTE
         data.route.path = combined;
      }

      return data;
   });
}

// COMPILE RANDOM DATASET
function random() {

   // PICK A RACE RANDOMLY
   var races = ['human', 'dwarf', 'gnome', 'nelf', 'orc', 'troll', 'tauren', 'undead'];
   var randomize = Math.floor((Math.random() * races.length) + 0);

   // BUILD ROUTE & RENDER IT
   return route(races[randomize]).then((data) => {

      // RANDOMIZE BLOCK NUMBER & SET IS AS CURRENT
      data.current = Math.floor((Math.random() * data.route.path.length - 1) + 1);

      // RETURN THE DATA OBJECT
      return data;
   });
}

// COMPILE SPECIFIC DATASET
function specific(race, block) {

   // BUILD ROUTE & RENDER IT
   return route(race).then((data) => {

      // SET THE TARGET BLOCK
      data.current = parseInt(block);

      // RETURN THE DATA OBJECT
      return data;
   });
}

// COMPILE RANDOM DATASET
function dev() {

   // BUILD ROUTE & RENDER IT
   return route('dev').then((data) => {

      // RANDOMIZE BLOCK NUMBER & SET IS AS CURRENT
      data.current = parseInt(localStorage.getItem('dev'));

      audit(data);

      // RETURN THE DATA OBJECT
      return data;
   });
}

// AUDIT LOGS FOR DEBUGGING
function audit(data) {

   var quests = {};

   // LOOP THROUGH EACH BLOCK & WAYPOINT
   for (var x = 0; x < 20; x++) {
      data.route.path[x].waypoints.forEach(waypoint => {
         
         if (waypoint.starts != undefined) {
            waypoint.starts.forEach(quest => {
               if (typeof(quest) == 'string') {
                  quests[quest.toLowerCase()] = 0;
               } else {
                  quests[quest[0].toLowerCase()] = 0;
               }
            });
         }

      });
   }

   log(quests)
}

// EXPORT MODULES
module.exports = {
   random: random,
   specific: specific,
   dev: dev
}
},{}],3:[function(require,module,exports){
// MAKE INSTANCE DATA PUBLIC FOR ALL FUNCTIONS
var instance_data;
var cooldown;

// WHEN DEBUGGING
var dev = false;

// MAP MOVEMENT
function move_map(background) {

   // ASSIST VARS
   var moving = false;
   var lastevent = null;

   // MOUSEDOWN
   $('#map').on('mousedown touchstart', (event) => {
      
      // BLOCK DEFAULT ACTION
      event.preventDefault();

      // TURN OFF SUBMENU FOR -- FIX FOR TABLET/MOBILE DEVICES
      $('#submenu').css('display', 'none');

      // ENABLE MAP MOVEMENT & SAVE TRIGGER EVENT
      moving = true;
      lastevent = event;
   });

   // MOUSEMOVE -- IF MOUSEDOWN IS ACTIVE
   $('#map').on('mousemove touchmove', (event) => {

      // BLOCK DEFAULT ACTION
      event.preventDefault();

      // MODIFY EVENT VARIABLE ON TABLET/MOBILE DEVICES
      if (event.type == 'touchmove') { event = event.touches[0]; }
      
      // IF MOVING IS ENABLED
      if (moving === true) {

         // STARTING COORDS
         var starting = {
            x: lastevent.clientX,
            y: lastevent.clientY
         }

         // ENDING COORDS
         var ending = {
            x: event.clientX,
            y: event.clientY
         }

         // DELTA COORDS
         var delta = {
            x: starting.x - ending.x,
            y: starting.y - ending.y,
         }

         // CURRENT POSITION
         var position = {
            x: $('#map').css('left').replace('px', ''),
            y: $('#map').css('top').replace('px', '')
         }

         // NEW POSITION
         var new_position = {
            x: position.x - delta.x,
            y: position.y - delta.y
         }

         // LIMIT THE MOVEMENT
         var limit = {
            x: -(background.width - $('#map-outer').width()),
            y: -(background.height - $('#map-outer').height())
         }

         // RECALIBRATE OVERFLOW
         if (new_position.x < limit.x) { new_position.x = limit.x; }
         if (new_position.y < limit.y) { new_position.y = limit.y; }
         if (new_position.x > 0) { new_position.x = 0; }
         if (new_position.y > 0) { new_position.y = 0; }

         // EXECUTE MOVEMENT -- IF THERE IS EXTRA SPACE
         if (limit.x <= 0) { $('#map').css('left', new_position.x + 'px'); }
         if (limit.y <= 0) { $('#map').css('top', new_position.y + 'px'); }

         // REFRESH LAST EVENT
         lastevent = event;
      }
   });

   // MOUSEUP -- DISABLE MAP MOVEMENT
   $(document).on('mouseup touchend', () => { moving = false; });
}

// SECTION HIGHLIGHTING
function map_highlight() {

   var selector;

   // TURN MOUSEOVER CIRCLE ON
   $('body').on('mouseover', '.section', (event) => {

      // FIND SECTION ATTR NUMBER
      var id = $(event.currentTarget).attr('section');

      // TURN HIGHLIGHT CIRCLE OPACITY ON & NUMBER OPACITY OFF
      $('#waypoint-' + id).css('opacity', 0.7);
      $('.number-' + id).css('opacity', 0);
      selector = $('.number-' + id);
   });

   // TURN MOUSEOVER CIRCLE OFF
   $('body').on('mouseout', '.section', () => {

      // TURN HIGHLIGHT CIRCLE OPACITY OFF & NUMBER OPACITY ON
      $('circle').css('opacity', 0);
      $(selector).css('opacity', 1);
   });
}

// ROUTE BROWSING
function browsing(data, render, settings, storage) {

   // SET INSTANCE DATA
   instance_data = data;
   cooldown = settings.cooldown;

   // LISTEN FOR KEY-UPS
   $(document).on('keyup', (event) => {

      // MAKE SURE PROMPT TABLE ISNT ACTIVE
      if ($('#prompt').css('display') != 'table') {

         // WHEN 'A' IS PRESSED
         if (event.keyCode == 65) {
            
            // THE PREVIOUS BLOCK
            var previous = parseInt(instance_data.current - 1);

            // IF IT FALLS WITHIN RANGE, RENDER MAP AGAIN
            if (previous >= 0) {

               // SET NEW CURRENT
               instance_data.current = previous;

               // NORMALLY DO
               if (dev == false) {

                  // UPDATE STORAGE & SUBMENU
                  storage.update(instance_data);

               // IF DEBUGGING
               } else { localStorage.setItem('dev', previous); log(previous); }

               // RENDER NEW MAP
               render.map(instance_data);
            }

         // WHEN 'D' IS PRESSED
         } else if (event.keyCode == 68) {
         
            // THE NEXT BLOCK
            var next = parseInt(instance_data.current + 1);

            // IF IT FALLS WITHIN RANGE, RENDER MAP AGAIN
            if (next < instance_data.route.path.length) {

               // SET NEW CURRENT
               instance_data.current = next;

               // NORMALLY DO
               if (dev == false) {

                  // UPDATE STORAGE & SUBMENU
                  storage.update(instance_data);

               // IF DEBUGGING
               } else { localStorage.setItem('dev', next); log(next); }

               // RENDER NEW MAP
               render.map(instance_data);
            }
         }
      }

   });

   // WHEN THE INPUT RANGE IS USED
   $('body').on('click', '#progress', (event) => {
      
      // EVENT PROPS
      var mouse_click = event.clientX;
      var selector_position = event.currentTarget.offsetLeft;

      // DO THE MATH
      var difference = mouse_click - selector_position;
      var selector_width = event.currentTarget.offsetWidth;

      // CONVERT TO PERCENTAGE
      var percent = difference / selector_width;

      // FIND CLOSEST BLOCK
      var block = Math.floor(percent * instance_data.route.path.length);

      // MAKE SURE ITS IN RANGE
      if (block <= instance_data.route.path.length && block != instance_data.current) {

         // SET NEW CURRENT PROP & RENDER
         instance_data.current = block;

         // UPDATE STORAGE & SUBMENU
         storage.update(instance_data);

         // RENDER NEW MAP
         render.map(instance_data);

      } else { log('Range Issue!'); }
   });
}

// ROUTE BROWSING FOR HANDHELD DEVICES
function handheld_browsing(render, storage) {

   // MOBILE/TABLET BROWSING MOUSEOVER
   $('body').on('mouseover', '#map, #next, #prev', () => {
      $('#next, #prev').css('opacity', 1);
   });

   // MOBILE/TABLET BROWSING MOUSEOUT
   $('body').on('mouseout', '#map, #next, #prev', () => {
      $('#next, #prev').css('opacity', 0);
   });

   $('body').on('click', '#next, #prev', (event) => {

      // PREVENT DEFAULT ACTION
      event.preventDefault();

      var target = $(event.currentTarget).attr('id');

      // RENDER PREVIOUS BLOCK
      if (target == 'prev') {

         // THE PREVIOUS BLOCK
         var previous = instance_data.current - 1;

         // IF IT FALLS WITHIN RANGE, RENDER MAP AGAIN
         if (previous >= 0) {

            // SET NEW CURRENT
            instance_data.current = previous;

            // UPDATE STORAGE & SUBMENU
            storage.update(instance_data);

            // RENDER NEW MAP
            render.map(instance_data);
         }

      // RENDER NEXT BLOCK
      } else if (target == 'next') {

         // THE NEXT BLOCK
         var next = instance_data.current + 1;

         // IF IT FALLS WITHIN RANGE, RENDER MAP AGAIN
         if (next < instance_data.route.path.length) {

            // SET NEW CURRENT
            instance_data.current = next;

            // UPDATE STORAGE & SUBMENU
            storage.update(instance_data);

            // RENDER NEW MAP
            render.map(instance_data);
         }
      }

   });
}

// SUBMENU DROPDOWNS
function submenu() {

   // PLACEHOLDERS
   var last_selector;
   var menu;

   // MOUSEOVER
   $('body').on('mouseover', '#sub', (event) => {

      // HIDE THE PREVIOUS MENU
      if (last_selector != undefined) { last_selector.css('display', 'none'); }

      // SAVE EVENT TARGET & SET NEW POSITION
      menu = $(event.target);

      // DEFAULT X POSITION
      var position = $(event.target)[0].offsetLeft;

      // RIGHT ALIGNMENT
      if (menu[0].innerText != 'Overview') {
         var submenu_width = parseInt($('#submenu').css('width').replace('px', '')) + 4;
         position = ($(event.target)[0].offsetLeft + $(event.target)[0].offsetWidth) - submenu_width;
      }

      // DEFAULT SELECTOR
      var selector = $('#overview');

      if (menu[0].innerText == 'Load From Storage') {
         selector = $('#storage');
      } else if (menu[0].innerText == 'Create New Profile') {
         selector = $('#create');
      } else if (menu[0].innerText == 'Actions') {
         selector = $('#actions');
      }

      // SHOW THE CORRECT MENU
      selector.css('display', 'block');

      // REGISTER THE LAST MENU FOR HIDING PURPOSES
      last_selector = selector;

      // FIND MENU HEIGHT FOR POSITIONING
      var menu_height = $('#menu')[0].offsetHeight - 2;

      // POSITION & SHOW THE SUBMENU
      $('#submenu').css('top', menu_height);
      $('#submenu').css('left', position);
      $('#submenu').css('display', 'block');
   });

   // KEEP SELECTED MENU DARKENED WHILE SUBMENU IS OPEN
   $('body').on('mouseover', '#submenu, #sub', () => {
      $(menu).css('background', 'rgba(2, 2, 2, 0.151)');
      $('#submenu').css('display', 'block');
   });

   // TURN OFF THE SUBMENU & MAKE THE MENU TRANSPARENT ON MOUSEOUT
   $('body').on('mouseout', '#submenu, #sub', () => {
      $(menu).css('background', 'rgba(2, 2, 2, 0)');
      $('#submenu').css('display', 'none');
   });
}

// OBJECTIVE/QUEST LOG BUTTONS
function log_menu() {

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
}

// PRELOAD BUTTON
function preload(func) {

   // SHOW OBJECTIVES EVENT
   $('body').on('click', '.preload', () => {
      func.preload();
   });
}

// CREATE NEW PROFILE
function new_profile(func, storage, render, build) {

   // PLACEHOLDERS
   var race = '';

   // SHOW OBJECTIVES EVENT
   $('body').on('click', '.profile', (event) => {

      // REGISTER THE SELECTED RACE
      race = event.currentTarget.innerText.toLowerCase();

      // PROMPT SELECTOR
      var selector = `
         <div id="input-box">
            <input type="text" placeholder="Enter Profile Name" id="profile_name"><input type="submit" value="Create" id="bad-submit">
         </div>
         <img src="interface/img/close.png" id="close">
      `;

      // WAIT FOR THINGS TO RENDER -- AUTO FOCUS INPUT
      func.open_prompt(selector).then(() => { $('#profile_name').focus(); });
   });

   // CLOSE THE WINDOW BY CLICKING
   $('body').on('click', '#close', () => { func.close_prompt(); });

   // SPECIFIC KEY EVENTS
   $(document).on('keyup', (event) => {
      
      // CLOSE WINDOW WITH ESC
      if (event.keyCode == 27 && $('#close')[0] != undefined) { func.close_prompt(); }

      // CREATE NEW PROFILE
      if (event.keyCode == 13 && $('#good-submit')[0] != undefined) {
         
         // PLAYER NAME -- FORCE LOWERCASE
         var player = $('#profile_name').val().toLowerCase();

         // SWITCH TO LOADING ANIMATION
         func.loading();

         // PLAYER DETAILS
         var details = {
            race: race,
            level: 5,
            block: 0
         };

         // ADD PROFILE TO STORAGE
         storage.add(player, details);

         // GENERATE NEW SUBMENU SELECTOR
         var selector = '<div id="loaded" profile="' + player + '"><div class="split"><div><img src="interface/img/icons/' + details.race + '.png"><span id="char-name">' + capitalize(player) + '</span></div><div>Level <span id="char-lvl">' + details.level + '</span></div></div></div>';

         // IF OTHER PROFILES EXIST
         if ($('#soon')[0] === undefined) {

            // UNCOLOR PREVIOUS LOADED OPTION & APPEND IN NEW LOAD OPTION
            $('#loaded').attr('id', 'opt');

            // APPEND IT IN
            $('#storage').append(selector);

         // REPLACE OLD CONTENT
         } else { $('#storage').html(selector); }

         // RENDER THE MAP
         build.specific(details.race, details.block).then((data) => {

            // UPDATE INSTANCE DATA
            instance_data = data;

            // RENDER THE NEW MAP & UPDATE THE DATA OBJECT 
            render.map(instance_data);

            // CLOSE THE LOADING ANIMATION WHEN DONE
            sleep(cooldown).then(() => { func.close_prompt(); });
         });
      }
   });

   // LISTEN TO INPUT KEY EVENTS
   $('body').on('keyup', '#profile_name', (event) => {

      // DONT VALIDATE WHEN ESC IS PRESSED -- TO FIX ERROR BLINKING
      if (event.keyCode != 27) {

         // REMOVE OLD ERRORS
         $('#error').remove();

         // INPUT VALUE
         var value = $('#profile_name').val().replace(/\s/g, '');

         // ERROR ARRAY
         var errors = [];

         // FETCH BLACKLISTED NAMES
         var blacklist = storage.blacklist();

         // CHECK IF ITS BLACKLISTED
         if ($.inArray(value.toLowerCase(), blacklist) != -1) { errors.push('Name Already Exists'); }

         // CHECK THAT A NAME WAS GIVEN
         if (value == '') { errors.push('Unique Name Required'); }

         // CHECK THAT A NAME WAS GIVEN
         if (value.length < 3) { errors.push('3 Character Minimum'); }

         // RENDER PROBLEM
         if (errors.length != 0) {

            // ADD ERROR SELECTOR
            $('#prompt-inner').prepend('<div id="error">' + errors[0] + '</div>');

            // TURN THE BUTTON RED BY DEFAULT
            $('#good-submit').attr('id', 'bad-submit');

            // X POSITION
            var left = $('#input-box')[0].offsetLeft;
            var width = $('#input-box')[0].offsetWidth;

            // Y POSITION
            var top = $('#input-box')[0].offsetTop;
            var offset = $('#input-box')[0].offsetHeight;

            // CHANGE POSITION
            $('#error').css('top', (top - offset) + 'px');
            $('#error').css('left', left + (width / 4) + 'px');

            // DISPLAY THE BOX
            $('#error').css('display', 'block');

         // IF NO ERRORS ARE DETECTED, TURN THE BUTTON GREEN
         } else { $('#bad-submit').attr('id', 'good-submit'); }
      }
   });

   $('body').on('click', '#good-submit', () => {
         
      // PLAYER NAME -- FORCE LOWERCASE
      var player = $('#profile_name').val().toLowerCase();

      // SWITCH TO LOADING ANIMATION
      func.loading();

      // PLAYER DETAILS
      var details = {
         race: race,
         level: 5,
         block: 0
      };

      // ADD PROFILE TO STORAGE
      storage.add(player, details);

      // GENERATE NEW SUBMENU SELECTOR
      var selector = '<div id="loaded" profile="' + player + '"><div class="split"><div><img src="interface/img/icons/' + details.race + '.png"><span id="char-name">' + capitalize(player) + '</span></div><div>Level <span id="char-lvl">' + details.level + '</span></div></div></div>';

      // IF OTHER PROFILES EXIST
      if ($('#soon')[0] === undefined) {

         // UNCOLOR PREVIOUS LOADED OPTION & APPEND IN NEW LOAD OPTION
         $('#loaded').attr('id', 'opt');

         // APPEND IT IN
         $('#storage').append(selector);

      // REPLACE OLD CONTENT
      } else { $('#storage').html(selector); }

      // RENDER THE MAP
      build.specific(details.race, details.block).then((data) => {

         // UPDATE INSTANCE DATA
         instance_data = data;

         // RENDER THE NEW MAP & UPDATE THE DATA OBJECT 
         render.map(instance_data);

         // CLOSE THE LOADING ANIMATION WHEN DONE
         sleep(cooldown).then(() => { func.close_prompt(); });
      });
   });
}

// LOAD EXISTING PROFILE
function load(func, storage, render, build) {
   $('body').on('click', '#storage #opt', (event) => {

      // SWITCH TO LOADING ANIMATION
      func.loading();

      $('#loaded').attr('id', 'opt');
      $(event.currentTarget).attr('id', 'loaded');
      
      // REGISTER REQUESTED BLOCK & RACE
      var profile = $(event.currentTarget).attr('profile');

      // FETCH PROFILE DETAILS
      var details = storage.fetch(profile);

      // RENDER THE MAP
      build.specific(details.race, details.block).then((data) => {

         // UPDATE INSTANCE DATA
         instance_data = data;

         // RENDER THE NEW MAP & UPDATE THE DATA OBJECT 
         render.map(instance_data);

         // CLOSE THE LOADING ANIMATION WHEN DONE
         sleep(cooldown).then(() => { func.close_prompt(); });
      });
   });
}

// EXPORT MODULES
module.exports = {
   move_map: move_map,
   map_highlight: map_highlight,
   browsing: browsing,
   submenu: submenu,
   log_menu: log_menu,
   preload: preload,
   new_profile: new_profile,
   load: load,
   handheld_browsing: handheld_browsing
}
},{}],4:[function(require,module,exports){
// PRELOAD BACKGROUNDS
function preload() {

   // LOG EVENT START
   log('Preload Initiated.');

   // LOADING SELECTOR
   var loading = '<div class="lds-dual-ring"></div>';

   // WAIT FOR THINGS TO RENDER
   open_prompt(loading).then(() => {

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
         'durotar',
         'duskwood',
         'dustwallow',
         'elwynn',
         'epl',
         'felwood',
         'feralas',
         'hillsbrad',
         'hinterlands',
         'ironforge',
         'loch',
         'moonglade',
         'morogh',
         'mulgore',
         'needles',
         'orgrimmar',
         'redridge',
         'searing',
         'silverpine',
         'steppes',
         'stonetalon',
         'stormwind',
         'stv',
         'swamp',
         'tanaris',
         'teldrassil',
         'thunderbluff',
         'tirisfal',
         'undercity',
         'ungoro',
         'westfall',
         'wetlands',
         'winterspring',
         'wpl'
      ];

      // PROMISE CONTAINER
      var promises = [];

      // GENERATE & PUSH A LOADING PROMISE FOR EACH ZONE
      zones.forEach(zone => {

         // GENERATE A PROMISE
         var p = new Promise((resolve, reject) => {
            $.get('interface/img/maps/' + zone + '.png').done(() => { resolve(); });
         });

         // PUSH IT TO THE CONTAINER
         promises.push(p);
      });

      // WAIT FOR ALL PROMISES TO BE RESOLVED
      Promise.all(promises).then(() => {

         // LOG TASK COMPLETION & CLOSE THE PROMPT GRADUALLY
         log('Preload Complete!');
         close_prompt();
      });
   });
}

// OPEN PROMPT WINDOW
function open_prompt(selector) {

   // TURN OFF SUBMENU
   $('#submenu').css('display', 'none');

   // RENDER IN REQUESTED SELECTOR
   $('body').prepend('<div id="prompt"><div id="prompt-inner">' + selector + '</div></div>');
   
   // WAIT 50MS & GRADUALLY TURN OPACITY ON
   return sleep(50).then(() => { $('#prompt').css('opacity', '1'); });
}

// CLOSE PROMPT WINDOW
function close_prompt() {

   // TURN OPACITY OFF
   $('#prompt').css('opacity', 0);

   // WAIT 300MS, THEN REMOVE THE PROMPT SELECTOR
   sleep(300).then(() => { $('#prompt').remove(); });
}

// SHORTHAND FOR RENDERING LOADING ANIMATION
function loading() {

   // LOADING SELECTOR
   var loading = '<div class="lds-dual-ring"></div>';

   if ($('#prompt')[0] != undefined) {

      $('#prompt-inner').html(loading);

   } else { open_prompt(loading); }
}

// CENTER MAP
function center_map(settings) {

   // FIND CENTER COORDS
   var coords = {
      x: -(settings.background.width - ($('#map-outer')[0].offsetWidth - 4)) / 2,
      y: -(settings.background.height - ($('#map-outer')[0].offsetHeight - 4)) / 2
   }

   // EXECUTE MOVEMENT
   $('#map').css('left', coords.x + 'px');
   $('#map').css('top', coords.y + 'px');
}

// EXPORT MODULES
module.exports = {
   preload: preload,
   open_prompt: open_prompt,
   close_prompt: close_prompt,
   loading: loading,
   center_map: center_map
}
},{}],5:[function(require,module,exports){
// RENDER MAP
function map(data) {

   // MAKE MAP & LOGS TRANSPARENT
   $('#map').css('opacity', 0);
   $('#logs').css('opacity', 0);

   // WAIT 100MS
   sleep(200).then(() => {

      // TARGET DATA
      var target = data.route.path[data.current];
      
      // CHANGE THE BACKGROUND
      $('#map').css('background', 'url("interface/img/maps/' + target.zone + '.png")');

      // NUKE OLD CONTENT
      $('#map').html('');

      // SELECTOR CONTAINERS
      var lines, points, circles = '';

      // COLLECT DATA FOR MAP ALIGNMENT
      var align = { x: 0, y: 0, length: 0 }
      
      // LOOP THROUGH WAYPOINTS & ADD SELECTORS
      for (var x = 0; x < target.waypoints.length; x++) {

         // WAYPOINT SHORTHAND
         var waypoint = target.waypoints[x];

         // INCREMENT ALIGNMENT PROPERTIES
         align.x += waypoint.coords.x;
         align.y += waypoint.coords.y;
         if (align.length == 0) { align.length = target.waypoints.length; }

         // SET DEFAULT ALIGN TO LEFT
         if (waypoint.align === undefined) { waypoint.align = 'left'; }

         // GENERATE WAYPOINT
         points += `
            <foreignobject width="100%" height="100%">
               <div class="waypoint" style="left: ` + waypoint.coords.x + `%; top: ` + waypoint.coords.y + `%;">
                  <img src="interface/img/waypoints/space.png" id="` + waypoint.type + `"><span id="` + waypoint.align + `" class="number-` + x + `"><img src="interface/img/numbers/` + (x + 1) + `.png"></span>
               </div>
            </foreignobject>
         `;

         // GENERATE HIGHLIGHT CIRCLE
         circles += '<circle r="24" cx="' + waypoint.coords.x + '%" cy="' + waypoint.coords.y + '%" id="waypoint-' + x + '"></circle>';

         // GENERATE LINE -- IF YOU THERE IS MORE THAN ONE WAYPOINT REMAINING
         if (x < target.waypoints.length - 1) {
            lines += '<line x1="' + target.waypoints[x].coords.x + '%" y1="' + target.waypoints[x].coords.y + '%" x2="' + target.waypoints[x + 1].coords.x + '%" y2="' + target.waypoints[x + 1].coords.y + '%"></line>';
         }
      }

      // RENDER IN STATUS CHANGES
      status(data);
      var objectives = objective_log(target.waypoints, data.quests);
      var quests = quest_log(data);

      // WAIT ANOTHER 100MS
      sleep(100).then(() => {

         // RENDER IN MAP & LOGS
         $('#map').html(lines + circles + points);
         $('#obj-log').html(objectives);
         $('#quest-log').html(quests);

         find_pos(align);

         // TURN OPACITY BACK ON
         $('#map').css('opacity', 1);
         $('#logs').css('opacity', 1);
      });
   });
}

// RENDER SIDEPANEL LOGS
function objective_log(waypoints, quests) {
   
   // SELECTOR CONTAINER
   var container = '';

   // LOOP THROUGH EACH WAYPOINT
   for (var x = 0; x < waypoints.length; x++) {
      
      // SHORTHANDS
      var waypoint = waypoints[x];

      // LOOP THROUGH SECTIONS & GENERATE ROWS
      var rows = parse_rows(waypoint, quests);

      // GENERATE A SECTION BLOCK
      container += `
         <div class="section" section="` + x + `">
            <div class="title"><div class="split"><div>` + (x + 1) + `. ` + waypoint.header + `</div><div>` + waypoint.coords.x + `.` + waypoint.coords.y + `</div></div></div>
            ` + rows + `
         </div>
      `;
   }

   // RETURN CONTAINER
   return container;
}

// GET CURRENT QUESTS
function quest_log(data) {

   // INITIAL CONTAINER
   var quests = {};

   // LIST OF QUESTS TO IGNORE
   var blacklist = [

      // ALLIANCE SIDE
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
      "A Crumpled Up Note",

      // HORDE SIDE
      "Araj's Scarab",
      "Alas, Andorhal",
      "Commander Gor'shak",
      "Necklace Recovery, Take Two",
      "Willix the Importer",
      "Deathstalkers in Shadowfang",
      "Searching for the Lost Satchel"
   ];

   // LOOP THROUGH DATA TO CURRENT BLOCK
   for (var x = 0; x < data.current; x++) {

      // WAYPOINTS SHORTHAND
      var waypoints = data.route.path[x].waypoints;

      // LOOP THROUGH EACH WAYPOINT
      waypoints.forEach(waypoint => {
      
         // ADD EVERY STARTED QUEST
         if (waypoint.starts != undefined) {
            waypoint.starts.forEach(quest => {
               
               // STRING
               if (typeof(quest) != 'string') {

                  // CHECK IF THE QUEST IS BLACKLISTED
                  var check = $.inArray(quest[0], blacklist);
                  if (check == -1) { quests[quest[0]] = quest; }

               // ARRAY
               } else {
                  
                  // CHECK IF THE QUEST IS BLACKLISTED
                  var check = $.inArray(quest, blacklist);
                  if (check == -1) { quests[quest] = quest; }
               }

            });
         }

         // REMOVE EVERY ENDED QUEST
         if (waypoint.ends != undefined) {
            waypoint.ends.forEach(quest => {
               
               // STRING
               if (typeof(quest) != 'string') { delete quests[quest[0]];
               
               // ARRAY
               } else { delete quests[quest]; }

            });
         }
      });
   }

   // SAVE OBJECT KEYS
   var keys = Object.keys(quests);

   // CONTAINER + HEADER
   var content = `
      <div class="title">
         <div class="split">
            <div>Current Quests</div>
            <div>` + keys.length + ` / 20</div>
         </div>
      </div>
   `;

   // GENERATE ROWS & WRAPPER
   keys.forEach(name => {
      
      // GENERATE ROW BASED ON PROP TYPE
      if (typeof(quests[name]) != 'string') { content += `<div class="quest"><div class="split"><div><a href="https://classicdb.ch/?quest=` + data.quests[quests[name][0].toLowerCase()] + `" target="_blank">` + shorten(quests[name][0]) + `</a></div><div>` + quests[name][1] + `</div></div></div>`; 
      } else { content += `<div class="quest"><a href="https://classicdb.ch/?quest=` + data.quests[name.toLowerCase()] + `" target="_blank">` + shorten(name) + `</a></div>`; }

   });

   // WRAP THE QUESTS IN A SECTION BLOCK
   content = '<div class="section">' + content + '</div>';

   return content;
}

// PARSE SECTION ROWS
function parse_rows(waypoint, quests) {
   
   // SECTIONS CONTAINER
   var container = '';

   // PARSE ARRAY IF ITS DEFINED
   if (waypoint.ends !== undefined) { container += row(waypoint.ends, quests, 'ends') }
   if (waypoint.starts !== undefined) { container += row(waypoint.starts, quests, 'starts') }
   if (waypoint.objectives !== undefined) { container += row(waypoint.objectives, quests, 'objectives') }
   if (waypoint.special !== undefined) { container += row(waypoint.special, quests, 'special') }

   return container;
}

// GENERATE SINGLE ROW
function row(section, quests, color) {

   // SECTION CONTAINER
   var container = '';

   // LOOP THROUGH SECTION
   section.forEach(line => {

      // ADD LINKS FOR STARTS, ENDS & OBJECTIVES
      if (color != 'special') {

         // GENERATE A LINE
         if (typeof(line) == 'object') { container += '<div class="' + color + '"><div class="split"><div><a href="https://classicdb.ch/?quest=' + quests[line[0].toLowerCase()] + '" target="_blank">' + shorten(line[0]) + '</a></div><div>' + line[1] + '</div></div></div>';
         } else { container += '<div class="' + color + '"><a href="https://classicdb.ch/?quest=' + quests[line.toLowerCase()] + '" target="_blank">' + shorten(line) + '</a></div>'; }

      // PLAIN TEXT FOR SPECIAL
      } else { container += '<div class="' + color + '">' + line + '</div>'; }
   });

   return container;
}

// RENDER SIDEPANEL STATUS
function status(data) {

   // FORMAT LEVEL/XP COMPONENTS
   var level = data.route.path[data.current].experience.toFixed(2);
   var experience = level.split('.')[1];

   // CALCULATE PROGRESS PERCENT
   var max = data.route.path.length;
   var progress = (((data.current) / (max - 1)) * 100).toFixed(2);

   // FIND LAST HEARTHSTONE
   var hearthstone = find_hearthstone(data);

   // SET LEVEL/PROGRESS BAR LENGTHS
   $('#level-bar').css('width', experience + '%');
   $('#progress-bar').css('width', progress + '%');

   // SET LEVEL/PROG/HS VALUES
   $('#lvl').html(level);
   $('#prog').html(progress);
   $('#hs').html(hearthstone);
}

// FIND LAST SET HEARTHSTONE
function find_hearthstone(data) {

   // LOCATION PLACEHOLDER
   var location = 'none';

   for (var x = data.current; x >= 0; x--) {

      // BREAK THE LOOP AFTER THE FIRST HIT
      if (location != 'none') { break; }

      // WAYPOINTS SHORTHAND
      var waypoints = data.route.path[x].waypoints;

      // LOOP THROUGH EACH WAYPOINT
      waypoints.forEach(waypoint => {
      
         // MAKE SURE SPECIAL ARRAY ISNT UNDEFINED
         if (waypoint.special != undefined) {

            // LOOP THROUGH MESSAGES
            waypoint.special.forEach(message => {

               // FORCE LOWERCASE
               message = message.toLowerCase();

               // SET AS THE LOCATION WHEN THE KEYWORD IS FOUND
               if (message == 'set hearthstone') { location = capitalize(data.route.path[x].zone); }
            });
         }
      });
   }

   return location;
}

function find_pos(align) {
   
   // FIGURE OUT AVERAGE XY POSITION
   var avg = {
      x: align.x / align.length,
      y: align.y / align.length
   }

   // BACKGROUND IMAGE SIZE
   var background = {
      width: 1440,
      height: 960
   }

   // SELECTOR DIMENSIONS
   var selector = {
      width: $('#map-outer').width() / 2,
      height: $('#map-outer').height() / 2
   }

   // CONVERT PERCENT TO PIXELS
   var left = (background.width * (avg.x / 100)).toFixed(0);
   var top = (background.height * (avg.y / 100)).toFixed(0);

   // SUBTRACT THE MAP SELECTOR DIMENSIONS
   var new_x = -(left - selector.width);
   var new_y = -(top - selector.height);

   // FIND COOR LIMITS
   var limit = {
      x: -(background.width - $('#map-outer').width()),
      y: -(background.height - $('#map-outer').height())
   }

   // RECALIBRATE WHEN XY LIMITS ARE SURPASSED
   if (new_y > 0) { new_y = 0; }
   if (new_y < limit.y) { new_y = limit.y; }
   if (new_x > 0) { new_x = 0; }
   if (new_x < limit.x) { new_x = limit.x; }

   // MOVE THE MAP IF THERE'S ROOM
   if ((selector.width * 2) < background.width) { $('#map').css('left', new_x + 'px'); }
   if ((selector.height * 2) < background.height) { $('#map').css('top', new_y + 'px'); }
}

// EXPORT MODULES
module.exports = {
   map: map
}
},{}],6:[function(require,module,exports){
// MAKE STORAGE KEY GLOBALLY AVAILABLE
var key;

// UPDATE STORAGE
function add(header, details) {

   // FETCH STORAGE STRING & CONVERT TO JSON
   var storage = localStorage.getItem(key);

   // CONVERT TO JSON
   storage = JSON.parse(storage);

   // INJECT THE CHANGES
   storage[header] = details;

   // STRINGIFY STORAGE & SET IT
   storage = JSON.stringify(storage);
   localStorage.setItem(key, storage);

   log('Property Added!');
}

// CHECK IF THERE'S SOMETHING IN LOCALSTORAGE
function check(storage_key) {

   // SET KEY
   key = storage_key;

   if (localStorage.getItem(key) === null) {
      localStorage.setItem(key, '{}');
   }
    
   // CONVERT OLD FORMAT
   convert_old(key);

   // SHORTHAND
   var storage = localStorage.getItem(key);

   // IF SOMETHING IS FOUND
   if (storage != '{}') {

      // CONVERT TO JSON
      storage = JSON.parse(storage);

      // CONTAINER
      var container = '';

      // LOOP THROUGH EACH CHARACTER
      Object.keys(storage).forEach(character => {
         
         // GENERATE A SELECTOR
         container += '<div id="opt" profile="' + character + '"><div class="split"><div><img src="interface/img/icons/' + storage[character].race + '.png"><span id="char-name">' + capitalize(character) + '</span></div><div>Level <span id="char-lvl">' + storage[character].level + '</span></div></div></div>';
      });

      // RENDER THEM IN
      $('#storage').html(container);
   }
}

// UPDATE STORAGE PROPERTY
function update(data) {

   // MAKE SURE A PROFILE IS SELECTED
   if ($('#loaded')[0] != undefined) {

      // FISH OUT RELEVANT PROPERTIES
      var level = parseInt(String(data.route.path[data.current].experience).split('.')[0]);
      var block = data.current;

      // FIND THE LOADED PROFILES NAME
      var profile = $('#loaded').attr('profile');

      // CONVERT STORAGE TO JSON
      var storage = JSON.parse(localStorage.getItem(key));

      // SET NEW VALUES
      storage[profile].block = block;
      storage[profile].level = level;

      // STRINGIFY & UPDATE STORAGE
      storage = JSON.stringify(storage);
      localStorage.setItem(key, storage);

      // UPDATE THE SUBMENU
      $('#loaded #char-lvl').text(level);
   }
}

// CONVERTS OLD FORMAT TO NEW FORMAT
function convert_old() {

   // OLD KEYS
   var alliance = localStorage.getItem('questing-page');
   var horde = localStorage.getItem('horde');

   // CHECK WHETHER EITHER EXISTS
   if (alliance != null || horde != null) {

      // PLACEHOLDER
      var obj = {};

      // CHECK ALLIANCE
      if (alliance != null) {
         
         // INJECT NEW PROPERTY
         obj['allygurl'] = {
            race: 'human',
            level: 99,
            block: alliance
         }

         // REMOVE THE OLD ITEM
         localStorage.removeItem('questing-page');
      }

      // CHECK HORDE
      if (horde != null) {
         
         // INJECT NEW PROPERTY
         obj['hordeboi'] = {
            race: 'orc',
            level: 99,
            block: horde
         }

         // REMOVE THE OLD ITEM
         localStorage.removeItem('horde');
      }

      // STRINGIFY & SET THE NEW ITEM
      obj = JSON.stringify(obj);
      localStorage.setItem(key, obj)
   }
}

// NUKE STORAGE CONTENT
function nuke() {
   localStorage.removeItem(key);
   log('Storage Nuked!');
}

// FETCH BLACKLISTED NAMES
function blacklist() {

   // DEFAULT BLACKLIST
   var blacklist = [];

   // FETCH & CONVERT STORAGE TO JSON
   var storage = localStorage.getItem(key);
   storage = JSON.parse(storage);

   // SET BLACKLIST IF ITS DEFINED
   if (storage != null) { blacklist = Object.keys(storage); }

   return blacklist;
}

// FETCH SPECIFIC DATA
function fetch(name) {

   // FETCH WHOLE STORAGE & CONVERT TO JSON
   var storage = localStorage.getItem(key);
   storage = JSON.parse(storage);

   // SINGLE OUT & RETURN REQUEST 
   var details = storage[name];
   return details;
}

// EXPORT MODULES
module.exports = {
   add: add,
   check: check,
   nuke: nuke,
   update: update,
   blacklist: blacklist,
   fetch: fetch
}
},{}]},{},[1]);
