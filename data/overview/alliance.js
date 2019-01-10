var zones = [
   ['Elwynn Forest', 5.44],
   ['Stormwind', 10.61],
   ['Dun Morogh', 11.03],
   ['Loch Modan', 11.62],
   ['Darkshore', 13.58],
   ['Westfall', 16.77],
   ['<span>Deadmines</span>', 19.28],
   ['Redridge Mountains', 20.44],
   ['Darkshore', 21.92],
   ['Ashenvale', 22.29],
   ['Wetlands', 24.26],
   ['Duskwood', 24.50],
   ['Redridge Mountains', 25.74],
   ['Duskwood', 26.62],
   ['<span>The Stockade</span>', 27.11],
   ['Wetlands', 27.55],
   ['Duskwood', 29.89],
   ['Ashenvale', 31.42],
   ['Stranglethorn Vale', 32.24],
   ['Hillsbrad Foothills', 33.75],
   ['Arathi Highlands', 34.78],
   ['Shimmering Flats', 35.63],
   ['Dustwallow Marsh', 36.03],
   ['Desolace', 36.64],
   ['Farm a Mount', 38.10],
   ['Swamp of Sorrows', 40.02],
   ['Arathi Highlands', 40.61],
   ['Alterac Mountains', 41.19],
   ['<span>Scarlet Monastery</span>', 41.27],
   ['Stranglethorn Vale', 41.75],
   ['Badlands', 42.80],
   ['<span>Uldaman</span>', 43.84],
   ['Stranglethorn Vale', 44.48],
   ['Tanaris', 45.44],
   ['Feralas', 46.73],
   ['Azshara', 47.93],
   ['Hinterlands', 48.40],
   ['<span>Zul\'Farrak</span>', 48.94],
   ['<span>Maraudon</span>', 49.54],
   ['Blasted Lands', 50.06],
   ['Searing Gorge', 50.78],
   ['<span>Sunken Temple</span>', 51.72],
   ['Burning Steppes', 52.06],
   ['Azshara', 52.66],
   ['Un\'Goro Crater', 52.98],
   ['Felwood', 54.50],
   ['Feralas', 55.04],
   ['Eastern Plaguelands', 55.81],
   ['Western Plaguelands', 55.98],
   ['Eastern Plaguelands', 56.84],
   ['<span>Blackrock Depths</span>', 57.45],
   ['Un\'Goro Crater', 58.44],
   ['Winterspring', 58.63],
   ['Eastern Plaguelands', 59.74],
   ['Western Plaguelands', 60.19],
]

var container = '';

zones.forEach((zone, i) => {

   container += `
      <div id="zone">
         <div id="split">
            <div>` + (i + 1) + `.&nbsp;</div>
            <div>` + zone[0] + `</div>
            <div>` + zone[1].toFixed(2) + `</div>
         </div>
      </div>
   `;

});

$('#zone-inner').html(container);