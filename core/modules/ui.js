// FETCH JQUERY
var $ = require("jquery");

// SUBMENU DROPDOWNS
function dropdowns() {

   // SAVE LAST MOUSEOVER TARGET
   var last_menu;
   var last_submenu;

   // SHOW SUBMENU
   $('body').on('mouseover', '.more', (event) => {
      
      // FIND THE RELATIONAL LINK
      var rel = $(event.target).attr('rel');

      // SAVE EVENTS
      last_menu = $(event.target);
      last_submenu = $('#' + rel);

      // FIND THE POSITIONAL COORDS
      var position = {
         left: $(event.target)[0].offsetLeft,
         top: $('#menu')[0].offsetHeight - 2
      };

      // MAKE DIMENSIONS AVAILABLE BUT KEEP IT TRANSPARENT
      last_submenu.css('display', 'block');
      last_submenu.css('opacity', 0);

      // RIGHT ALIGN LAST MENU
      if (rel == 'create') {
         position.left -= last_submenu[0].offsetWidth - $(event.target)[0].offsetWidth;
      }

      // POSITION & SHOW THE SUBMENU PROPERLY
      last_submenu.css('top', position.top);
      last_submenu.css('left', position.left);
      last_submenu.css('opacity', 1);
   });

   // KEEP SUBMENU VISIBLE
   $('body').on('mouseover', '.more, #overview, #actions, #load, #create', () => {
      last_submenu.css('display', 'block');
      last_menu.css('background-color', 'rgba(2, 2, 2, 0.151)');
   });

   // HIDE SUBMENU
   $('body').on('mouseout', '.more, #overview, #actions, #load, #create', () => {
      last_submenu.css('display', 'none');
      last_menu.css('background-color', 'rgba(0, 0, 0, 0)');
   });
}

// MAP MOVEMENT
function map_movement(background) {

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
function map_highlighting() {

   // SAVE LAST TARGET
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

// CENTER MAP
function map_center(settings) {

   // FIND CENTER COORDS
   var coords = {
      x: -(settings.background.width - ($('#map-outer')[0].offsetWidth - 4)) / 2,
      y: -(settings.background.height - ($('#map-outer')[0].offsetHeight - 4)) / 2
   }

   // EXECUTE MOVEMENT
   $('#map').css('left', coords.x + 'px');
   $('#map').css('top', coords.y + 'px');
}

// IF THE WINDOW SIZE CHANGES
function resize(settings) {
   $(window).resize(() => { map_center(settings); });
}

// OBJECTIVE/QUEST LOG BUTTONS
function panel_menu() {

   // SHOW OBJECTIVES EVENT
   $('body').on('click', '#show-objectives', () => {

      // PICK UP TARGET CLASS ATTRIBUTE
      var check = $(this).attr('class');

      // IF IT ISNT CURRENT
      if (check != 'current') {

         // FLIP CURRENT
         $('#show-quests').removeAttr('class');
         $('#show-objectives').attr('class', 'current');

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
         $('#show-objectives').removeAttr('class');
         $('#show-quests').attr('class', 'current');

         // FLIP WHICH PANEL IS SHOWN
         $('#obj-log').css('display', 'none');
         $('#quest-log').css('display', 'block');

      // ELSE LOG ERROR
      } else { log('Tab Already Open!'); }
   });
}

// START LOADING SCREEN
function start_loading() {

   // CLOSE ANY SUBMENU
   $('#overview, #actions, #load, #create').css('display', 'none');
   
   // RENDER IN PROMPT SELECTOR
   $('body').prepend('<div id="prompt"><div id="prompt-inner"><div class="lds-dual-ring"></div></div></div>');
   
   // WAIT 50MS & GRADUALLY TURN OPACITY ON
   return sleep(50).then(() => { $('#prompt').css('opacity', '1'); });
}

// STOP LOADING SCREEN
function stop_loading() {

   // TURN OPACITY OFF
   $('#prompt').css('opacity', 0);

   // WAIT 300MS, THEN REMOVE THE PROMPT SELECTOR
   sleep(300).then(() => { $('#prompt').remove(); });
}

// INPUT PROMPT
function prompt(type) {

   // CLOSE ANY SUBMENU
   $('#overview, #actions, #load, #create').css('display', 'none');

   // PLACEHOLDER
   var selector;

   // CHARACTER CREATION
   if (type == 'text') {
      selector = `
         <div id="input-box">
            <input type="text" placeholder="Enter Profile Name" id="profile_name"><input type="submit" value="Create" id="bad-submit">
         </div>
      `;

   // ROUTE IMPORTING
   } else {
      selector = `
         <div id="input-box">
            <div id="factions">
               <div>
                  <div class="btn" id="picked">Alliance</div>
               </div>
               <div>
                  <div class="btn">Horde</div>
               </div>
            </div>
            <div id="filebox">
               <input type="file" placeholder="Select Route File" id="input_route">
            </div>
         </div>
      `;
   }

   // RENDER PROMPT
   $('body').prepend('<div id="prompt"><div id="prompt-inner">' + selector + '<img src="interface/img/close.png" id="close"></div></div>');
   
   // WAIT 50MS & GRADUALLY TURN OPACITY ON
   return sleep(50).then(() => { $('#prompt').css('opacity', '1'); });
}

// REPLACE INPUT WITH LOADING SELECTOR
function replace() {
   $('#prompt-inner').html('<div class="lds-dual-ring"></div>');
}

// EXPORT MODULES
module.exports = {
   dropdowns: dropdowns,

   // MAP RELATED
   map_movement: map_movement,
   map_highlighting: map_highlighting,
   map_center: map_center,
   resize: resize,
   panel_menu: panel_menu,

   // LOADING SCREEN RELATED
   start_loading: start_loading,
   stop_loading: stop_loading,
   prompt: prompt,
   replace: replace
}