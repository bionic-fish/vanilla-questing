// FETCH JQUERY
var $ = require("jquery");

// ASSEMBLE JSON DATA
function route(race) {

   // RACES PER FACTION
   var alliance = ['human', 'dwarf', 'gnome', 'nelf'];
   var horde = ['orc', 'troll', 'tauren', 'undead'];

   // CONTAINER
   var promises = [];

   // ALLIANCE BLOCKS
   if ($.inArray(race, alliance) != -1) {

      // CONVERT DWARF & GNOME QUERIES TO 'GNORF'
      if (race == 'dwarf' || race == 'gnome') { race = 'gnorf'; }

      // FIND RELEVANT FILES
      promises = [
         $.getJSON('../data/alliance/quests.json'),
         $.getJSON('../data/alliance/' + race + '.json'),
         $.getJSON('../data/alliance/shared.json'),
      ];

   // HORDE BLOCKS
   } else if ($.inArray(race, horde) != -1) {
  
      // CONVERT TROLL AND ORC QUERIES TO 'TRORC'
      if (race == 'troll' || race == 'orc') { race = 'trorc'; }

      // FIND RELEVANT FILES
      promises = [
         $.getJSON('../data/horde/quests.json'),
         $.getJSON('../data/horde/' + race + '.json'),
         $.getJSON('../data/horde/shared.json'),
      ];
   }

   // WAIT FOR THE PROMISES TO RESOLVE
   return Promise.all(promises).then((response) => {

      // CONTAINER
      var combined = [];

      // STITCH THE EARLY AND LATE GAME ROUTES TOGETHER
      response[1].path.forEach(block => { combined.push(block); });
      response[2].path.forEach(block => { combined.push(block); });

      // CREATE THE INITIAL
      var data = {
         quests: response[0],
         route: { path: combined }
      };

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

      // SET THE TARGET BLOCK & RETURN
      data.current = parseInt(block);
      return data;
   });
}

// COMPILE CUSTOM DATASET
function custom(url, faction) {

   // QUEST & ROUTE PROMISES
   var promises = [
      $.getJSON('../data/' + faction + '/quests.json'),
      $.getJSON(url),
   ];

   // WAIT FOR THE PROMISES TO RESOLVE
   return Promise.all(promises).then((response) => {

      // CONSTRUCT THE DATA OBJECT
      var data = {
         quests: response[0],
         route: response[1],
         current: 0
      };

      return data;
   });
}

// COMPILE DATASET FOR DEVELOPMENT PURPOSES
function dev() {

   // DATASET PROMISES
   var promises = [
      $.getJSON('../data/dev/quests.json'),
      $.getJSON('../data/dev/route.json'),
   ];

   // WAIT FOR THE PROMISES TO RESOLVE
   return Promise.all(promises).then((response) => {

      // CREATE DEV PROPERTY IN STORAGE -- IF IT DOESNT EXIST
      if (localStorage.getItem('dev') === null) {
         localStorage.setItem('dev', '0');
      }

      // CONSTRUCT THE DATA OBJECT
      var data = {
         quests: response[0],
         route: response[1],
         current: parseInt(localStorage.getItem('dev'))
      };

      // RETURN THE OBJECT
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

   log(quests);
}

// EXPORT MODULES
module.exports = {
   random: random,
   specific: specific,
   custom: custom,
   dev: dev
}