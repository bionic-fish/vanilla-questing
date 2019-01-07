// RENDER MAP
function map(data) {

   // MAKE MAP & LOGS TRANSPARENT
   $('#map').css('opacity', 0);
   $('#logs').css('opacity', 0);

   // WAIT 100MS
   sleep(200).then(() => {

      // TARGET DATA
      var target = data.route.path[data.current];
      
      // CHANGE THE BACKGROUND
      $('#map').css('background', 'url("interface/img/maps/' + target.zone + '.png")');

      // NUKE OLD CONTENT
      $('#map').html('');
      $('#obj-log').html('');

      // SELECTOR CONTAINERS
      var lines, points, circles = '';

      // COLLECT DATA FOR MAP ALIGNMENT
      var align = { x: 0, y: 0, length: 0 }
      
      // LOOP THROUGH WAYPOINTS & ADD SELECTORS
      for (var x = 0; x < target.waypoints.length; x++) {

         // WAYPOINT SHORTHAND
         var waypoint = target.waypoints[x];

         // INCREMENT ALIGNMENT PROPERTIES
         align.x += waypoint.coords.x;
         align.y += waypoint.coords.y;
         if (align.length == 0) { align.length = target.waypoints.length; }

         // SET DEFAULT ALIGN TO LEFT
         if (waypoint.align === undefined) { waypoint.align = 'left'; }

         // GENERATE WAYPOINT
         points += `
            <foreignobject width="100%" height="100%">
               <div class="waypoint" style="left: ` + waypoint.coords.x + `%; top: ` + waypoint.coords.y + `%;">
                  <img src="interface/img/waypoints/space.png" id="` + waypoint.type + `"><span id="` + waypoint.align + `" class="number-` + x + `"><img src="interface/img/numbers/` + (x + 1) + `.png"></span>
               </div>
            </foreignobject>
         `;

         // GENERATE HIGHLIGHT CIRCLE
         circles += '<circle r="24" cx="' + waypoint.coords.x + '%" cy="' + waypoint.coords.y + '%" id="waypoint-' + x + '"></circle>';

         // GENERATE LINE -- IF YOU THERE IS MORE THAN ONE WAYPOINT REMAINING
         if (x < target.waypoints.length - 1) {
            lines += '<line x1="' + target.waypoints[x].coords.x + '%" y1="' + target.waypoints[x].coords.y + '%" x2="' + target.waypoints[x + 1].coords.x + '%" y2="' + target.waypoints[x + 1].coords.y + '%"></line>';
         }
      }

      // RENDER IN STATUS CHANGES
      status(data);
      var objectives = objective_log(target.waypoints, data.quests);
      var quests = quest_log(data);

      // WAIT ANOTHER 100MS
      sleep(100).then(() => {

         // RENDER IN MAP & LOGS
         $('#map').html(lines + circles + points);
         $('#obj-log').html(objectives);
         $('#quest-log').html(quests);

         find_pos(align);

         // TURN OPACITY BACK ON
         $('#map').css('opacity', 1);
         $('#logs').css('opacity', 1);
      });
   });
}

// RENDER SIDEPANEL LOGS
function objective_log(waypoints, quests) {
   
   // SELECTOR CONTAINER
   var container = '';

   // LOOP THROUGH EACH WAYPOINT
   for (var x = 0; x < waypoints.length; x++) {
      
      // SHORTHANDS
      var waypoint = waypoints[x];

      // LOOP THROUGH SECTIONS & GENERATE ROWS
      var rows = parse_rows(waypoint, quests);

      // GENERATE A SECTION BLOCK
      container += `
         <div class="section" section="` + x + `">
            <div class="title"><div class="split"><div>` + (x + 1) + `. ` + waypoint.header + `</div><div>` + waypoint.coords.x + `.` + waypoint.coords.y + `</div></div></div>
            ` + rows + `
         </div>
      `;
   }

   // RETURN CONTAINER
   return container;
}

// GET CURRENT QUESTS
function quest_log(data) {

   // INITIAL CONTAINER
   var quests = {};

   // LIST OF QUESTS TO IGNORE
   var blacklist = [

      // ALLIANCE SIDE
      "The Lost Dwarves",
      "Back to Uldaman",
      "Into the Depths",
      "Secret of the Circle",
      "Legends of Maraudon",
      "The Essence of Eranikus",
      "Marshal Windsor",
      "Kharan Mighthammer",
      "Dark Iron Legacy",
      "Attunement to the Core",
      "The Fate of the Kingdom",
      "A Crumpled Up Note",

      // HORDE SIDE
      "Araj's Scarab",
      "Alas, Andorhal",
      "Commander Gor'shak",
      "Necklace Recovery, Take Two",
      "Willix the Importer",
      "Deathstalkers in Shadowfang",
      "Searching for the Lost Satchel"
   ];

   // LOOP THROUGH DATA TO CURRENT BLOCK
   for (var x = 0; x < data.current; x++) {

      // WAYPOINTS SHORTHAND
      var waypoints = data.route.path[x].waypoints;

      // LOOP THROUGH EACH WAYPOINT
      waypoints.forEach(waypoint => {
      
         // ADD EVERY STARTED QUEST
         if (waypoint.starts != undefined) {
            waypoint.starts.forEach(quest => {
               
               // STRING
               if (typeof(quest) != 'string') {

                  // CHECK IF THE QUEST IS BLACKLISTED
                  var check = $.inArray(quest[0], blacklist);
                  if (check == -1) { quests[quest[0]] = quest; }

               // ARRAY
               } else {
                  
                  // CHECK IF THE QUEST IS BLACKLISTED
                  var check = $.inArray(quest, blacklist);
                  if (check == -1) { quests[quest] = quest; }
               }

            });
         }

         // REMOVE EVERY ENDED QUEST
         if (waypoint.ends != undefined) {
            waypoint.ends.forEach(quest => {
               
               // STRING
               if (typeof(quest) != 'string') { delete quests[quest[0]];
               
               // ARRAY
               } else { delete quests[quest]; }

            });
         }
      });
   }

   // SAVE OBJECT KEYS
   var keys = Object.keys(quests);

   // CONTAINER + HEADER
   var content = `
      <div class="title">
         <div class="split">
            <div>Current Quests</div>
            <div>` + keys.length + ` / 20</div>
         </div>
      </div>
   `;

   // GENERATE ROWS & WRAPPER
   keys.forEach(name => {
      
      // GENERATE ROW BASED ON PROP TYPE
      if (typeof(quests[name]) != 'string') { content += `<div class="quest"><div class="split"><div><a href="https://classicdb.ch/?quest=` + data.quests[quests[name][0].toLowerCase()] + `" target="_blank">` + shorten(quests[name][0]) + `</a></div><div>` + quests[name][1] + `</div></div></div>`; 
      } else { content += `<div class="quest"><a href="https://classicdb.ch/?quest=` + data.quests[name.toLowerCase()] + `" target="_blank">` + shorten(name) + `</a></div>`; }

   });

   // WRAP THE QUESTS IN A SECTION BLOCK
   content = '<div class="section">' + content + '</div>';

   return content;
}

// PARSE SECTION ROWS
function parse_rows(waypoint, quests) {
   
   // SECTIONS CONTAINER
   var container = '';

   // PARSE ARRAY IF ITS DEFINED
   if (waypoint.ends !== undefined) { container += row(waypoint.ends, quests, 'ends') }
   if (waypoint.starts !== undefined) { container += row(waypoint.starts, quests, 'starts') }
   if (waypoint.objectives !== undefined) { container += row(waypoint.objectives, quests, 'objectives') }
   if (waypoint.special !== undefined) { container += row(waypoint.special, quests, 'special') }

   return container;
}

// GENERATE SINGLE ROW
function row(section, quests, color) {

   // SECTION CONTAINER
   var container = '';

   // LOOP THROUGH SECTION
   section.forEach(line => {

      // ADD LINKS FOR STARTS, ENDS & OBJECTIVES
      if (color != 'special') {

         // GENERATE A LINE
         if (typeof(line) == 'object') { container += '<div class="' + color + '"><div class="split"><div><a href="https://classicdb.ch/?quest=' + quests[line[0].toLowerCase()] + '" target="_blank">' + shorten(line[0]) + '</a></div><div>' + line[1] + '</div></div></div>';
         } else { container += '<div class="' + color + '"><a href="https://classicdb.ch/?quest=' + quests[line.toLowerCase()] + '" target="_blank">' + shorten(line) + '</a></div>'; }

      // PLAIN TEXT FOR SPECIAL
      } else { container += '<div class="' + color + '">' + line + '</div>'; }
   });

   return container;
}

// RENDER SIDEPANEL STATUS
function status(data) {

   // FORMAT LEVEL/XP COMPONENTS
   var level = data.route.path[data.current].experience.toFixed(2);
   var experience = level.split('.')[1];

   // CALCULATE PROGRESS PERCENT
   var max = data.route.path.length;
   var progress = (((data.current) / (max - 1)) * 100).toFixed(2);

   // FIND LAST HEARTHSTONE
   var hearthstone = find_hearthstone(data);

   // SET LEVEL/PROGRESS BAR LENGTHS
   $('#level-bar').css('width', experience + '%');
   $('#progress-bar').css('width', progress + '%');

   // SET LEVEL/PROG/HS VALUES
   $('#lvl').html(level);
   $('#prog').html(progress);
   $('#hs').html(hearthstone);
}

// FIND LAST SET HEARTHSTONE
function find_hearthstone(data) {

   // LOCATION PLACEHOLDER
   var location = 'none';

   for (var x = data.current; x >= 0; x--) {

      // BREAK THE LOOP AFTER THE FIRST HIT
      if (location != 'none') { break; }

      // WAYPOINTS SHORTHAND
      var waypoints = data.route.path[x].waypoints;

      // LOOP THROUGH EACH WAYPOINT
      waypoints.forEach(waypoint => {
      
         // MAKE SURE SPECIAL ARRAY ISNT UNDEFINED
         if (waypoint.special != undefined) {

            // LOOP THROUGH MESSAGES
            waypoint.special.forEach(message => {

               // FORCE LOWERCASE
               message = message.toLowerCase();

               // SET AS THE LOCATION WHEN THE KEYWORD IS FOUND
               if (message == 'set hearthstone') { location = capitalize(data.route.path[x].zone); }
            });
         }
      });
   }

   return location;
}

function find_pos(align) {
   
   // FIGURE OUT AVERAGE XY POSITION
   var avg = {
      x: align.x / align.length,
      y: align.y / align.length
   }

   // BACKGROUND IMAGE SIZE
   var background = {
      x: 1440,
      y: 960
   }

   var left = (background.x * (avg.x / 100)).toFixed(0);

   var width = $('#map-inner')[0].offsetWidth - 4;
   var height = $('#map-inner')[0].offsetHeight - 4;
   log(height)
}

// EXPORT MODULES
module.exports = {
   map: map
}