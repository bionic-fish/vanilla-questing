// CALIBRATE INNERBODY SIZE
function calibrate() {

   // FIND RELEVANT HEIGHTS
   var device_height = window.innerHeight;
   var menu_height = $('#menu')[0].offsetHeight;

   // SET THE NEW INNERBODY HEIGHT
   $('#innerbody').css('height', (device_height - menu_height) + 'px');

   // SET LOG HEIGHT TO ONE -- FOR RE-CALIBRATION PURPOSES
   $('#logs').css('height', '1px');

   // FIGURE OUT OBJECTIVE LOG SIZE
   var panel_inner_height = $('#panel-inner')[0].offsetHeight - 4;
   var status_height = $('#status')[0].offsetHeight;

   // SET THE GENERATED SIZE  
   $('#logs').css('height', (panel_inner_height - status_height) + 'px');
}

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
      x: -(settings.background.width - ($('#map-inner')[0].offsetWidth - 4)) / 2,
      y: -(settings.background.height - ($('#map-inner')[0].offsetHeight - 4)) / 2
   }

   // EXECUTE MOVEMENT
   $('#map').css('left', coords.x + 'px');
   $('#map').css('top', coords.y + 'px');
}

// EXPORT MODULES
module.exports = {
   calibrate: calibrate,
   preload: preload,
   open_prompt: open_prompt,
   close_prompt: close_prompt,
   loading: loading,
   center_map: center_map
}