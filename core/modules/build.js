function build() {

   var route = [
      $.getJSON('../data/01-elwynn.json'),
      $.getJSON('../data/02-transition.json'),
      $.getJSON('../data/03-morogh.json'),
      $.getJSON('../data/04-loch.json'),
      $.getJSON('../data/05-transition.json'),
      $.getJSON('../data/06-darkshore.json'),
      $.getJSON('../data/07-transition.json'),
      $.getJSON('../data/08-westfall.json'),
      $.getJSON('../data/09-transition.json'),
      $.getJSON('../data/10-redridge.json'),
      $.getJSON('../data/11-transition.json'),
      $.getJSON('../data/12-darkshore.json'),
      $.getJSON('../data/13-ashenvale.json'),
      $.getJSON('../data/14-transition.json'),
      $.getJSON('../data/15-menethil.json'),
      $.getJSON('../data/16-duskwood.json'),
      $.getJSON('../data/17-transition.json'),
      $.getJSON('../data/18-duskwood.json'),
      $.getJSON('../data/19-redridge.json'),
      $.getJSON('../data/20-duskwood.json'),
      $.getJSON('../data/21-transition.json'),
      $.getJSON('../data/22-wetlands.json'),
      $.getJSON('../data/23-transition.json'),
      $.getJSON('../data/24-wetlands.json'),
      $.getJSON('../data/25-transition.json'),
      $.getJSON('../data/26-duskwood.json'),
      $.getJSON('../data/27-transition.json'),
      $.getJSON('../data/28-ashenvale.json'),
      $.getJSON('../data/29-transition.json'),
      $.getJSON('../data/30-stv.json'),
      $.getJSON('../data/31-southshore.json'),
      $.getJSON('../data/32-arathi.json'),
      $.getJSON('../data/33-transition.json'),
      $.getJSON('../data/34-needles.json'),
      $.getJSON('../data/35-dustwallow.json'),
      $.getJSON('../data/36-transition.json'),
      $.getJSON('../data/37-desolace.json'),
      $.getJSON('../data/38-transition.json'),
      $.getJSON('../data/39-swamp.json'),
      $.getJSON('../data/40-transition.json'),
      $.getJSON('../data/41-arathi.json'),
      $.getJSON('../data/42-alterac.json'),
      $.getJSON('../data/43-transition.json'),
      $.getJSON('../data/44-stv.json'),
      $.getJSON('../data/45-transition.json'),
      $.getJSON('../data/46-badlands.json'),
      $.getJSON('../data/47-transition.json'),
      $.getJSON('../data/48-stv.json'),
      $.getJSON('../data/49-tanaris.json'),
      $.getJSON('../data/50-feralas.json'),
      $.getJSON('../data/51-transition.json'),
      $.getJSON('../data/52-hinterlands.json'),
      $.getJSON('../data/53-transition.json'),
      $.getJSON('../data/54-blasted.json'),
      $.getJSON('../data/55-hinterlands.json'),
      $.getJSON('../data/56-transition.json'),
      $.getJSON('../data/57-searing.json'),
      $.getJSON('../data/58-transition.json'),
      $.getJSON('../data/59-steppes.json'),
      $.getJSON('../data/60-transition.json'),
      $.getJSON('../data/61-azshara.json'),
      $.getJSON('../data/62-ungoro.json'),
      $.getJSON('../data/63-felwood.json'),
      $.getJSON('../data/64-transition.json'),
      $.getJSON('../data/65-feralas.json'),
      $.getJSON('../data/66-felwood.json'),
      $.getJSON('../data/67-transition.json'),
      $.getJSON('../data/68-wpl.json'),
      $.getJSON('../data/69-epl.json'),
      $.getJSON('../data/70-transition.json'),
      $.getJSON('../data/71-felwood.json'),
      $.getJSON('../data/72-ungoro.json'),
      $.getJSON('../data/73-winterspring.json'),
      $.getJSON('../data/74-transition.json'),
      $.getJSON('../data/75-plaguelands.json')
   ];

   var quests = $.getJSON('../data/00-quest-ids.json');

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