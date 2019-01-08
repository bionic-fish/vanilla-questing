// ASSEMBLE JSON DATA
function route(race) {

   // ROUTE & ID COMBOS
   var options = {
      human: {
         route: $.getJSON('../data/alliance/route.json'),
         quests: $.getJSON('../data/alliance/quests.json')
      },
      dwarf: {
         route: $.getJSON('../data/alliance/route.json'),
         quests: $.getJSON('../data/alliance/quests.json')
      },
      gnome: {
         route: $.getJSON('../data/alliance/route.json'),
         quests: $.getJSON('../data/alliance/quests.json')
      },
      nelf: {
         route: $.getJSON('../data/alliance/route.json'),
         quests: $.getJSON('../data/alliance/quests.json')
      },
      orc: {
         route: $.getJSON('../data/horde/route.json'),
         quests: $.getJSON('../data/horde/quests.json')
      },
      troll: {
         route: $.getJSON('../data/horde/route.json'),
         quests: $.getJSON('../data/horde/quests.json')
      },
      tauren: {
         route: $.getJSON('../data/horde/route.json'),
         quests: $.getJSON('../data/horde/quests.json')
      },
      undead: {
         route: $.getJSON('../data/horde/route.json'),
         quests: $.getJSON('../data/horde/quests.json')
      }
   }

   // CHECK IF RACE IS FOUND
   var keys = Object.keys(options);
   var check = $.inArray(race, keys);

   // IF ITS FOUND
   if (check != -1) {

      // SHORTHANDS
      var route = options[race].route;
      var quest_ids = options[race].quests;

      // WAIT FOR ALL PROMISES TO BE RESOLVED
      return Promise.all([route, quest_ids]).then((response) => {
      
         // DATA OBJECT
         var data = {
            route: response[0],
            quests: response[1]
         };

         return data;
      });

   // LOG AN ERROR IF IT ISNT
   } else { log('Race not found!') }
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
      
      data.route.path.forEach(element => {
         log(element.zone + ': ' + element.experience)
      });

      // RETURN THE DATA OBJECT
      return data;
   });
}

// EXPORT MODULES
module.exports = {
   random: random,
   specific: specific
}