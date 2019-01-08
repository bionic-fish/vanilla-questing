var zones = [
   ['Dutotar', 5.44],
   ['Tirisfal Glades', 10.46],
   ['Silverpine Forest', 12.71],
   ['Barrens', 14.53],
   ['<span>Ragefire Chasm</span>', 17.48],
   ['Stonetalon', 17.97],
   ['Barrens', 18.43],
   ['Silverpine Forest', 20.33],
   ['Hillsbrad Foothills', 20.80],
   ['Stonetalon', 21.65],
   ['Barrens', 22.49],
   ['<span>Wailing Caverns</span>', 24.25],
   ['Stonetalon', 24.91],
   ['<span>Shadowfang Keep</span>', 25.25],
   ['Hillsbrad Foothills', 25.67],
   ['Stonetalon', 26.91],
   ['Ashenvale', 27.20],
   ['<span>Blackfathom Deep</span>', 28.57],
   ['Stonetalon', 28.94],
   ['Thousand Needles', 29.54],
   ['Hillsbrad Foothills', 31.13],
   ['Shimmering Flats', 32.39],
   ['Stranglethorn Vale', 33.09],
   ['Hillsbrad Foothills', 34.33],
   ['Arathi Highlands', 34.76],
   ['Desolace', 36.15],
   ['Grind a Mount', 37.40],
   ['Dustwallow Marsh', 40.00],
   ['<span>Scarlet Monastery</span>', 40.63],
   ['Arathi Highlands', 40.82],
   ['Alterac Mountains', 41.47],
   ['Swamp of Sorrows', 41.85],
   ['Stranglethorn Vale', 42.13],
   ['Badlands', 43.04],
   ['<span>Uldaman</span>', 43.76],
   ['Swamp of Sorrows', 44.07],
   ['Stranglethorn Vale', 44.40],
   ['Hinterlands', 45.92],
   ['Dustwallow Marsh', 46.19],
   ['Tanaris', 46.63],
   ['Feralas', 47.93],
   ['Hinterlands', 49.38],
   ['<span>Zul\'Farrak</span>', 50.13],
   ['<span>Maraudon</span>', 50.57],
   ['Azshara', 51.13],
   ['Stranglethorn Vale', 51.29],
   ['Searing Gorge', 51.45],
   ['Blasted Lands', 52.12],
   ['Hinterlands', 52.49],
   ['Azshara', 52.95],
   ['Un\'Goro Crater', 53.39],
   ['Felwood', 55.19],
   ['Feralas', 55.92],
   ['Felwood', 56.20],
   ['<span>Sunken Temple</span>', 56.40],
   ['Burning Steppes', 56.56],
   ['<span>Blackrock Depths</span>', 56.80],
   ['Eastern Plaguelands', 57.49],
   ['Western Plaguelands', 57.92],
   ['Eastern Plaguelands', 58.54],
   ['Un\'Goro Crater', 59.33],
   ['Winterspring', 59.51],
   ['Western Plaguelands', 60.42],
]

var container = '';

zones.forEach(zone => {

   container += `
      <div id="zone">
         <div id="split">
            <div>` + zone[0] + `</div>
            <div>` + zone[1].toFixed(2) + `</div>
         </div>
      </div>
   `;

});

$('#zone-inner').html(container);