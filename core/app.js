// FETCH THE BUILD MODULE
var build = require('./modules/build.js')();

// WAIT FOR THE NECESSARY DATA TO COMPILE
build.then((data) => {

   // SETTINGS OBJECT
   var settings = {
      'cooldown': {
         'status': false,
         'timer': 500
      },
      align: {
         left: { x: -20, y: -6 },
         right: { x: 10, y: -6 },
         top: { x: -5, y: -21 },
         bottom: { x: -5, y: 10 }
      },
      windows: {
         'preload': 0,
         'faq': 0
      }
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
   tooltips.map(data);
});