// SHORTHAND FOR CONSOLE LOGGING
function log(stuff) { console.log(stuff); }

// WAIT FOR GIVEN MILLISECONDS
function sleep (time) { return new Promise((resolve) => setTimeout(resolve, time)); }

// PRELOAD FUNC
function testing() {

   log('started preloading');

   var sources = [
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
      'duskwood',
      'dustwallow',
      'elwynn',
      'epl',
      'farmfarmfarm',
      'felwood',
      'feralas',
      'hillsbrad',
      'hinterlands',
      'ironforge',
      'loch',
      'moonglade',
      'morogh',
      'needles',
      'redridge',
      'searing',
      'steppes',
      'stonetalon',
      'stormwind',
      'stv',
      'swamp',
      'tanaris',
      'teldrassil',
      'tirisfal',
      'ungoro',
      'westfall',
      'wetlands',
      'winterspring',
      'wpl'
   ];

   var promises = [];

   sources.forEach(zone => { promises.push(generate_promise(zone)); });
   Promise.all(promises).then(() => { log('all done!'); });
}

function generate_promise(zone) {
   return new Promise((resolve, reject) => {
      $.get('interface/img/maps/' + zone + '.png').done(()=> { resolve(); });
   });
}

// LISTEN FOR KEY PRESSES
$(document).on('keyup', (evt) => {

   // WHEN 'P' IS PRESSED
   if (evt.keyCode == 80) { testing(); }

});