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
      $.getJSON('../data/15-transition.json'),
      $.getJSON('../data/16-menethil.json'),
      $.getJSON('../data/17-duskwood.json'),
      $.getJSON('../data/18-transition.json'),
      $.getJSON('../data/19-duskwood.json'),
      $.getJSON('../data/20-redridge.json'),
      $.getJSON('../data/21-duskwood.json'),
      $.getJSON('../data/22-transition.json'),
      $.getJSON('../data/23-wetlands.json'),
      $.getJSON('../data/24-transition.json'),
      $.getJSON('../data/25-wetlands.json'),
      $.getJSON('../data/26-transition.json'),
      $.getJSON('../data/27-duskwood.json'),
      $.getJSON('../data/28-transition.json'),
      $.getJSON('../data/29-ashenvale.json'),
      $.getJSON('../data/30-transition.json'),
      $.getJSON('../data/31-stv.json'),
      $.getJSON('../data/32-southshore.json'),
      $.getJSON('../data/33-arathi.json'),
      $.getJSON('../data/34-transition.json'),
      $.getJSON('../data/35-needles.json'),
      $.getJSON('../data/36-dustwallow.json'),
      $.getJSON('../data/37-transition.json'),
      $.getJSON('../data/38-desolace.json'),
      $.getJSON('../data/39-transition.json'),
      $.getJSON('../data/40-swamp.json'),
      $.getJSON('../data/41-transition.json'),
      $.getJSON('../data/42-arathi.json'),
      $.getJSON('../data/43-alterac.json'),
      $.getJSON('../data/44-transition.json'),
      $.getJSON('../data/45-stv.json'),
      $.getJSON('../data/46-transition.json'),
      $.getJSON('../data/47-badlands.json'),
      $.getJSON('../data/48-transition.json'),
      $.getJSON('../data/49-stv.json'),
      $.getJSON('../data/50-tanaris.json'),
      $.getJSON('../data/51-feralas.json'),
      $.getJSON('../data/52-transition.json'),
      $.getJSON('../data/53-hinterlands.json'),
      $.getJSON('../data/54-transition.json'),
      $.getJSON('../data/55-blasted.json'),
      $.getJSON('../data/56-hinterlands.json'),
      $.getJSON('../data/57-transition.json'),
      $.getJSON('../data/58-searing.json'),
      $.getJSON('../data/59-transition.json'),
      $.getJSON('../data/60-steppes.json'),
      $.getJSON('../data/61-transition.json'),
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

   // WAIT FOR ALL PROMISES TO BE RESOLVED
   return Promise.all(route).then((response) => {

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
         }
      };

      // LOOK THROUGH EACH 
      response.forEach(block => {
         block.path.forEach(waypoint => {
   
            // PUSH WAYPOINT OBJECT INTO THE CONTAINER
            data.build.push(waypoint);
   
            // INCREMENT BLOCK COUNTER
            data.stats.blocks++;
            
            waypoint.waypoints.forEach(foo => {

               // INCREMENT WAYPOINT COUNTER
               data.stats.waypoints++;
   
               // INCREMENT QUEST COUNTER
               foo.starts.forEach(bar => { data.stats.quests++; });
            });
         });
      });

      // IF LOCALSTORAGE IS EMPTY, SET IT TO ZERO
      if (localStorage.getItem(data.storage) === null) { localStorage.setItem(data.storage, '0'); }

      return data;
   });
}

// EXPORT FUNCTION
module.exports = build;