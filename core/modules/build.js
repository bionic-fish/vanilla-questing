// ASSEMBLE JSON DATA
function route(race) {

   var alliance = ['human', 'dwarf', 'gnome', 'nelf'];
   var horde = ['orc', 'troll', 'tauren', 'undead'];

   var promises = [];

   // ALLIANCE BUILD
   if ($.inArray(race, alliance) != -1) {

      // CONVERT SOME RACE NAMES TO THEIR SHORTHANDS
      if (race == 'dwarf' || race == 'gnome') { race = 'gnorf'; }

      promises = [
         $.getJSON('../data/alliance/quests.json'),
         $.getJSON('../data/alliance/' + race + '.json'),
         $.getJSON('../data/alliance/shared.json'),
      ];

   // HORDE BUILD
   } else if ($.inArray(race, horde) != -1) {
      promises = [
         $.getJSON('../data/horde/quests.json'),
         $.getJSON('../data/horde/route.json'),
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

      // RETURN THE DATA OBJECT
      return data;
   });
}

// AUDIT LOGS FOR DEBUGGING
function audit(data) {

   var quests = {};

   // LOOP THROUGH EACH BLOCK & WAYPOINT
   for (var x = 0; x < data.route.path.length; x++) {
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