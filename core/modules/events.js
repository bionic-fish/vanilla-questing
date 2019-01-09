// MAKE INSTANCE DATA PUBLIC FOR ALL FUNCTIONS
var instance_data;
var cooldown;

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

         // WHEN 'D' IS PRESSED
         } else if (event.keyCode == 68) {
         
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