// FETCH JQUERY
var $ = require("jquery");

// MAKE INSTANCE DATA PUBLIC FOR ALL FUNCTIONS
var instance_data;

// SET TO TRUE WHEN DEBUGGING
var dev = true;

// ROUTE BROWSING
function browsing(data, render, storage) {

   // SET INSTANCE DATA
   instance_data = data;

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

               // WHEN DEBUGGING
               } else { localStorage.setItem('dev', previous); }

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

               // WHEN DEBUGGING
               } else { localStorage.setItem('dev', next); }

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

         // NORMALLY DO
         if (dev == false) {

            // UPDATE STORAGE & SUBMENU
            storage.update(instance_data);

         // WHEN DEBUGGING
         } else { localStorage.setItem('dev', instance_data.current); }

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

// ACTIONS EVENTS
function actions(build, ui, render) {

   // SHOW OBJECTIVES EVENT
   $('body').on('click', '#actions div', (event) => {

      // FIND WHICH OPTION WAS REQUESTED
      var option = $(event.target).attr('rel');
      
      // PRELOAD BGS
      if (option == 'preload') {
         preload_bgs();

      // IMPORT ROUTE
      } else if (option == 'import') {
         ui.prompt('file');
      }
   });

   // WHEN A FILE IS SELECTED
   $('body').on('change', '#input_route', (event) => {
      
      // FIND THE FILE
      var the_file = event.target.files[0];

      // MAKE SURE THAT ITS A JSON FILE
      if (the_file.type === 'application/json') {

         // FETCH THE READER
         var reader = new FileReader();

         // GENERATE A FETCHABLE URL
         reader.onload = function() {
            
            // FETCH THE REQUESTED FACTION & SWITCH TO LOADING ANIMATION
            var faction = $('#picked')[0].innerText.toLowerCase();
            ui.replace();

            // REMOVE THE LOADED ID FROM LOAD MENU
            $('#loaded').removeAttr('id');

            // CONTRUCT A NEW BUILD
            build.custom(reader.result, faction).then((data) => {

               // UPDATE INSTANCE DATA
               instance_data = data;

               // RENDER & STOP LOADING SCREEN
               render.map(instance_data);
               ui.stop_loading();
            });
         };

         // TRIGGER THE READER
         reader.readAsDataURL(the_file);

      // OTHERWISE, LOG ERROR
      } else { log('Bad file-type. Aborting!'); }
   });

   // WHEN A FACTION BUTTON IS PRESSED
   $('body').on('click', '.btn', (event) => {
      
      // CHECK TARGET STATUS
      var status = $(event.target).attr('id');

      // IF IT ISNT PICKED, SWITCH TO IT
      if (status != 'picked') {
         $('#picked').removeAttr('id');
         $(event.target).attr('id', 'picked');
      }
   });
}

// LOADING EVENTS
function load(ui, storage, build, render) {
   $('body').on('click', '#load div', (event) => {

      // FIND WHICH PROFILE WAS REQUESTED
      var profile = $(event.target).attr('rel');

      // IF ITS VALID
      if (profile != undefined) {

         // START LOADING SCREEN
         ui.start_loading();

         // FLIP 'LOADED' ID
         $('#loaded').removeAttr('id');
         $(event.currentTarget).attr('id', 'loaded');
         
         // FETCH DETAILS FROM STORAGE
         var details = storage.fetch(profile);

         // create_character A NEW BUILD
         build.specific(details.race, details.block).then((data) => {

            // UPDATE INSTANCE DATA & RENDER
            instance_data = data;
            render.map(instance_data);

            // STOP LOADING SCREEN
            ui.stop_loading();
         });
      }
   });
}

// CREATE EVENTS
function create(ui, storage, build, render) {

   // SAVE REQUESTED RACE
   var race;

   // INITIAL TRIGGER
   $('body').on('click', '#create div', (event) => {

      // FIND WHICH RACE WAS REQUESTED
      race = $(event.target).attr('rel');
      
      // OPEN INPUT WINDOW
      ui.prompt('text');
   });

   // GLOBAL KEY EVENTS
   $(document).on('keyup', (event) => {
   
      // CLOSE WINDOW WITH 'ESC'
      if (event.keyCode == 27) { ui.stop_loading(); }

      // WHEN 'ENTER' IS PRESSED & BUTTON IS GREEN
      if (event.keyCode == 13 && $('#good-submit')[0] != undefined) { create_character(ui, storage, build, render, race); }
   });

   // VALIDATE INPUT CONTENT
   $('body').on('keyup', '#profile_name', (event) => {

      // DONT VALIDATE WHEN ESC IS PRESSED -- TO FIX ERROR BLINKING
      if (event.keyCode != 27) {
         
         // NUKE THE OLD ERROR SELECTOR & DECLARE CONTAINER
         $('#error').remove();
         var errors = [];

         // REMOVE SPACES FROM INPUT & FETCH BLACKLIST
         var value = $('#profile_name').val().replace(/\s/g, '');
         var blacklist = storage.blacklist();

         // CHECK IF ITS BLACKLISTED
         if ($.inArray(value.toLowerCase(), blacklist) != -1) { errors.push('Name Already Exists'); }

         // CHECK THAT THE SELECTOR ISNT EMPTY
         if (value == '') { errors.push('Unique Name Required'); }

         // CHECK INPUT LENGTH
         if (value.length < 3) { errors.push('3 Character Minimum'); }

         // IF ERRORS ARE FOUND
         if (errors.length != 0) {

            // APPEND THEM IN & TURN THE BUTTON RED
            $('#prompt-inner').prepend('<div id="error">' + errors[0] + '</div>');
            $('#good-submit').attr('id', 'bad-submit');

            // X POSITION
            var left = $('#input-box')[0].offsetLeft;
            var width = $('#input-box')[0].offsetWidth;

            // Y POSITION
            var top = $('#input-box')[0].offsetTop;
            var offset = $('#input-box')[0].offsetHeight;

            // SET ERROR FRAME POSITION & TURN IT ON
            $('#error').css('top', (top - offset) + 'px');
            $('#error').css('left', left + (width / 4) + 'px');
            $('#error').css('display', 'block');

         // IF NO ERRORS ARE DETECTED, TURN THE BUTTON GREEN
         } else { $('#bad-submit').attr('id', 'good-submit'); }

      }
   });

   // CLOSE WINDOW BY CLICKING
   $('body').on('click', '#close', () => { ui.stop_loading(); });

   // WHEN THE GREEN BUTTON IS CLICKED
   $('body').on('click', '#good-submit', () => { create_character(ui, storage, build, render, race); });
}

// PRELOAD BACKGROUNDS
function preload_bgs() {

   // FETCH THE UI MODULE
   var ui = require('../modules/ui.js');

   // START LOADING SCREEN & LOG MSG
   ui.start_loading();
   log('Preload Initiated!');

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

   // GENERATE & PUSH A PROMISE FOR EACH ZONE
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

      // STOP LOADING & MSG
      ui.stop_loading();
      log('Preload Complete!');
   });
}

// CREATE CHARACTER
function create_character(ui, storage, build, render, race) {

   // FETCH THE NAME
   var player = $('#profile_name').val().toLowerCase();
   
   // REPLACE INPUT WITH LOADING ANIMATION
   ui.replace();

   // create_character NEW STORAGE BLOCK
   var details = {
      race: race,
      level: 5,
      block: 0
   };

   // ADD IT TO STORAGE
   storage.add(player, details);

   // create_character A NEW MENU SELECTOR
   var selector = '<div id="loaded" rel="' + player + '"><img src="interface/img/icons/' + details.race + '.png">' + capitalize(player) + '</div>';

   // IF THERE IS SOMETHING IN THE LOAD SUBMENU
   if ($('.dead')[0] === undefined) {

      // REMOVE LOADED ID FROM OLD SELECTOR & APPEND
      $('#loaded').removeAttr('id');
      $('#load').append(selector);
   
   // IF ITS EMPTY -- REPLACE FILLER TEXT
   } else { $('#storage').html(selector); }

   // CONTRUCT A NEW BUILD
   build.specific(details.race, details.block).then((data) => {

      // UPDATE INSTANCE DATA
      instance_data = data;

      // RENDER & STOP LOADING SCREEN
      render.map(instance_data);
      ui.stop_loading();
   });
}

// EXPORT MODULES
module.exports = {
   browsing: browsing,
   handheld_browsing: handheld_browsing,
   actions: actions,
   load: load,
   create: create,
}