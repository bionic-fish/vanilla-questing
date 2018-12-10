function build(faction) {

   // PLACEHOLDERS
   var route;
   var quests;

   // ALLIANCE ROUTE DATA & QUEST IDS
   if (faction == 'alliance') {
      route = [
         $.getJSON('../data/alliance/01-elwynn.json'),
         $.getJSON('../data/alliance/02-transition.json'),
         $.getJSON('../data/alliance/03-morogh.json'),
         $.getJSON('../data/alliance/04-loch.json'),
         $.getJSON('../data/alliance/05-transition.json'),
         $.getJSON('../data/alliance/06-darkshore.json'),
         $.getJSON('../data/alliance/07-transition.json'),
         $.getJSON('../data/alliance/08-westfall.json'),
         $.getJSON('../data/alliance/09-transition.json'),
         $.getJSON('../data/alliance/10-redridge.json'),
         $.getJSON('../data/alliance/11-transition.json'),
         $.getJSON('../data/alliance/12-darkshore.json'),
         $.getJSON('../data/alliance/13-ashenvale.json'),
         $.getJSON('../data/alliance/14-transition.json'),
         $.getJSON('../data/alliance/15-menethil.json'),
         $.getJSON('../data/alliance/16-duskwood.json'),
         $.getJSON('../data/alliance/17-transition.json'),
         $.getJSON('../data/alliance/18-duskwood.json'),
         $.getJSON('../data/alliance/19-redridge.json'),
         $.getJSON('../data/alliance/20-duskwood.json'),
         $.getJSON('../data/alliance/21-transition.json'),
         $.getJSON('../data/alliance/22-wetlands.json'),
         $.getJSON('../data/alliance/23-transition.json'),
         $.getJSON('../data/alliance/24-wetlands.json'),
         $.getJSON('../data/alliance/25-transition.json'),
         $.getJSON('../data/alliance/26-duskwood.json'),
         $.getJSON('../data/alliance/27-transition.json'),
         $.getJSON('../data/alliance/28-ashenvale.json'),
         $.getJSON('../data/alliance/29-transition.json'),
         $.getJSON('../data/alliance/30-stv.json'),
         $.getJSON('../data/alliance/31-southshore.json'),
         $.getJSON('../data/alliance/32-arathi.json'),
         $.getJSON('../data/alliance/33-transition.json'),
         $.getJSON('../data/alliance/34-needles.json'),
         $.getJSON('../data/alliance/35-dustwallow.json'),
         $.getJSON('../data/alliance/36-transition.json'),
         $.getJSON('../data/alliance/37-desolace.json'),
         $.getJSON('../data/alliance/38-transition.json'),
         $.getJSON('../data/alliance/39-swamp.json'),
         $.getJSON('../data/alliance/40-transition.json'),
         $.getJSON('../data/alliance/41-arathi.json'),
         $.getJSON('../data/alliance/42-alterac.json'),
         $.getJSON('../data/alliance/43-transition.json'),
         $.getJSON('../data/alliance/44-stv.json'),
         $.getJSON('../data/alliance/45-transition.json'),
         $.getJSON('../data/alliance/46-badlands.json'),
         $.getJSON('../data/alliance/47-transition.json'),
         $.getJSON('../data/alliance/48-stv.json'),
         $.getJSON('../data/alliance/49-tanaris.json'),
         $.getJSON('../data/alliance/50-feralas.json'),
         $.getJSON('../data/alliance/51-transition.json'),
         $.getJSON('../data/alliance/52-hinterlands.json'),
         $.getJSON('../data/alliance/53-transition.json'),
         $.getJSON('../data/alliance/54-blasted.json'),
         $.getJSON('../data/alliance/55-hinterlands.json'),
         $.getJSON('../data/alliance/56-transition.json'),
         $.getJSON('../data/alliance/57-searing.json'),
         $.getJSON('../data/alliance/58-transition.json'),
         $.getJSON('../data/alliance/59-steppes.json'),
         $.getJSON('../data/alliance/60-transition.json'),
         $.getJSON('../data/alliance/61-azshara.json'),
         $.getJSON('../data/alliance/62-ungoro.json'),
         $.getJSON('../data/alliance/63-felwood.json'),
         $.getJSON('../data/alliance/64-transition.json'),
         $.getJSON('../data/alliance/65-feralas.json'),
         $.getJSON('../data/alliance/66-felwood.json'),
         $.getJSON('../data/alliance/67-transition.json'),
         $.getJSON('../data/alliance/68-wpl.json'),
         $.getJSON('../data/alliance/69-epl.json'),
         $.getJSON('../data/alliance/70-transition.json'),
         $.getJSON('../data/alliance/71-felwood.json'),
         $.getJSON('../data/alliance/72-ungoro.json'),
         $.getJSON('../data/alliance/73-winterspring.json'),
         $.getJSON('../data/alliance/74-transition.json'),
         $.getJSON('../data/alliance/75-plaguelands.json')
      ];
      quests = $.getJSON('../data/alliance/00-quest-ids.json');
   
   // HORDE ROUTE & QUEST IDS
   } else {
      route = [
         $.getJSON('../data/horde/01-durotar.json'),
         $.getJSON('../data/horde/02-tirisfal.json'),
         $.getJSON('../data/horde/03-silverpine.json'),
         $.getJSON('../data/horde/04-transition.json')
      ];
      quests = $.getJSON('../data/horde/00-quest-ids.json');
   }

   // WAIT FOR ALL PROMISES TO BE RESOLVED
   return Promise.all(route).then((response) => {

      // WAIT FOR QUEST-ID PROMISE TO RESOLVE
      return quests.then((ids) => {

         // DECLARE DATA OBJECT
         var data = {
            build: [],
            storage: 'questing-page',
            current: '0',
            stats: {
               blocks: 0,
               waypoints: 0,
               quests: 0,
               progress: 0
            },
            ids: ids
         };

         // LOOK THROUGH EACH 
         response.forEach(block => {
            block.path.forEach(waypoint => {
      
               // PUSH WAYPOINT OBJECT INTO THE CONTAINER
               data.build.push(waypoint);
      
               // INCREMENT BLOCK COUNTER
               data.stats.blocks++;

               // ADD TO WAYPOINT COUNTER
               data.stats.waypoints += waypoint.waypoints.length;
            });
         });

         // SET QUEST COUNT
         data.stats.quests = Object.keys(data.ids).length;

         // IF LOCALSTORAGE IS EMPTY, SET IT TO ZERO
         if (localStorage.getItem(data.storage) === null) { localStorage.setItem(data.storage, '0'); }

         return data;
      });
   });
}

// EXPORT FUNCTION
module.exports = build;