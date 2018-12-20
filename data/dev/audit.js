// TESTING STARTS

var quest_check = {};

data.build.forEach(block => {
   
   block.waypoints.forEach(waypoint => {
   
      if (waypoint.ends != undefined) {
         waypoint.ends.forEach(quest => {
            
            if (typeof(quest) == 'string') {
               quest_check[quest] = 0;
            } else {
               quest_check[quest[0]] = 0;
            }
            
         });
      }

   });

});

data.build.forEach(block => {
   
   block.waypoints.forEach(waypoint => {
   
      if (waypoint.starts != undefined) {
         waypoint.starts.forEach(quest => {
            
            if (typeof(quest) == 'string') {
               
               var check = quest_check[quest];

               if (check != 0) { log(quest) }

            } else {
               
               var check = quest_check[quest[0]];

               if (check != 0) { log(quest[0]) }

            }
            
         });
      }

   });

});

log(quest_check)
log(Object.keys(quest_check).length)

// TESTING ENDS