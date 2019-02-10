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

// START LOADING SCREEN
ui.start_loading();

// CHECK FOR OUTDATED STORAGE CONTENT
storage.check(settings.storage);

// ADD UI COMPONENTS
ui.dropdowns(settings.background);
ui.map_movement();
ui.map_highlighting();
ui.panel_menu();
ui.resize();

// ADD EVENT COMPONENTS
events.actions(build, ui, render);
events.load(ui, storage, build, render);
events.create(ui, storage, build, render);

// RENDER RANDOM BLOCK ON LOAD
build.random().then((data) => {

   // RENDER A RANDOM BLOCK & AUTOCENTER
   render.map(data, ui);
   ui.map_center();

   // ENABLE BROWSING
   events.browsing(data, render, storage, ui);
   events.handheld_browsing(render, storage, ui);

   // END THE LOADING SCREEN
   ui.stop_loading();
});