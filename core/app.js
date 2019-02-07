// FETCH NECESSARY MODULES
var ui = require('./modules/ui.js');
var storage = require('./modules/storage.js');
var events = require('./modules/events.js');
var build = require('./modules/build.js');
var render = require('./modules/render.js');

// SETTINGS
var settings = {
   background: { width: 1440, height: 960 },
   storage: 'vanilla-questing'
}

// START LOADING SCREEN & CHECK FOR OUTDATED STORAGE CONTENT
ui.start_loading();
storage.check(settings.storage);

// ADD UI COMPONENTS
ui.dropdowns();
ui.map_movement(settings.background);
ui.map_highlighting();
ui.panel_menu();
ui.resize(settings);

// ADD EVENT COMPONENTS
events.actions();
events.load(ui, storage, build, render);
events.create(ui, storage, build, render);

// RENDER RANDOM BLOCK ON LOAD
build.random().then((data) => {

   // RENDER A RANDOM BLOCK & AUTOCENTER
   render.map(data);
   ui.map_center(settings);

   // ENABLE BROWSING
   events.browsing(data, render, settings, storage);
   events.handheld_browsing(render, storage);

   // END THE LOADING SCREEN
   ui.stop_loading();
});