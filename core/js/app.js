// PROMISE ARRAY OF ALL THE BLOCKS
var pathing = [
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

// SETTINGS OBJECT
var settings = {
   'localstorage': 'questing-page',
   'cooldown': {
      'status': false,
      'timer': 500
   },
   'preloaded': 0,
   'faq': 0
}

// DECLARE DATA OBJECT
var data = {}

// PREPEND IN PROMPT SELECTOR
$('body').prepend('<div id="prompt"><div id="prompt-inner"></div></div>');

// WAIT FOR EVERYTHING TO RESPOND
Promise.all(pathing).then((response) => {

   // SET THE USERS STARTING BLOCK TO ZERO IF IT DOESNT EXIST
   if (localStorage.getItem(settings.localstorage) === null) { localStorage.setItem(settings.localstorage, '0'); }

   // BUILD INITIAL DATA OBJECT
   data = build(response);

   // RENDER IN BUILD STATISTICS
   $('#block-count').html(data.build.blocks);
   $('#waypoint-count').html(data.build.waypoints);
   $('#quest-count').html(data.build.quests);

   // SET RANGE INPUTS MAX ATTRIBUTE & THE SCROLL TO THE CORRECT POSITION
   $('#range').attr('max', data.max - 1);

   // RENDER MAP & WAYPOINTS ON INITIAL LOAD & UPDATE DATA OBJECT
   data = render(data, settings, parseInt(localStorage.getItem(settings.localstorage)));

   // LISTEN FOR KEY PRESSES
   $(document).on('keyup', (evt) => {

      // WHEN 'A' IS PRESSED
      if (evt.keyCode == 65) {

         // BIND THE PREVIOUS NUMBER
         var previous = data.current - 1;

         // IF THE REF NUMBER & COOLDOWN STATUS CHECKS OUT
         if (previous >= 0 && settings.cooldown.status == false) {

            // BLOCK FURTHER REQUESTS
            settings.cooldown.status = true;

            // RENDER NEW CONTENT & UPDATE DATA OBJECT
            data = render(data, settings, previous);
            
            // ALLOW NEW REQUEST AFTER 600MS
            sleep(settings.cooldown.timer).then(() => { settings.cooldown.status = false; })
         }
      }

      // WHEN 'D' IS PRESSED
      if (evt.keyCode == 68) {

         // BIND THE PREVIOUS NUMBER
         var next = data.current + 1;
         
         // IF THE REF NUMBER & COOLDOWN STATUS CHECKS OUT
         if (next < data.max && settings.cooldown.status == false) {

            // BLOCK FURTHER REQUESTS
            settings.cooldown.status = true;

            // RENDER NEW CONTENT & UPDATE DATA OBJECT
            data = render(data, settings, next);

            // ALLOW NEW REQUEST AFTER 600MS
            sleep(settings.cooldown.timer).then(() => { settings.cooldown.status = false; })
         }
      }

      // WHEN 'ESC' IS PRESSED
      if (evt.keyCode == 27) {

         // CHECK IF THE RIGHT POPUP WINDOW IS OPEN
         if (settings.faq == 1) {

            // GRADUALLY TURN OPACITY OFF
            $('#prompt').css('opacity', '0');

            // WAIT 200 MS, THEN PROPERLY HIDE THE SELECTOR
            sleep(300).then(() => { $('#prompt').css('display', 'none'); settings.faq = 0; });
         }
      }

   });

   // WHEN THE RANGE SCROLL IS USED
   $('#range').on('change', () => {

      // RENDER NEW CONTENT & UPDATE DATA OBJECT
      var target = parseInt($('#range').val());
      data = render(data, settings, target);
   });

   // BLOCK ARROWKEYS TRIGGERS BECAUSE OF CLUNKY LOADING
   $(document).on('keyup keydown', (evt) => {
      if (evt.keyCode == 37 || evt.keyCode == 39) { evt.preventDefault(); }
   });

   // SHOW/HIDE TOOLTIP ON MOUSEOVER/MOUSEOUT
   $('body').on('mouseover', '.flightpath, .objective, .travel, .hub, .quest', (event) => { mouseover(event, data); });
   $('body').on('mouseout', '.flightpath, .objective, .travel, .hub, .quest', () => { $('#tooltip').css('display', 'none'); });
});

// WHEN PRELOAD BUTTON IS PRESSED
$('#show-preload').on('click', () => {

   // MAKE SURE PRELOAD HASNT BEEN PERFORMED ALREADY
   if (settings.preloaded == 0) {
      
      // CHANGE PRELOAD STATUS & PERFORM THE ACTION
      settings.preloaded = 1;
      preload();

   } else { log('Preload has already been performed'); }
});

// WHEN FAQ BUTTON IS PRESSED
$('#show-faq').on('click', () => {

   // CHECK FAQ STATUS
   if (settings.faq == 0) {

      // CHANGE FAQ STATUS & RENDER FAQ WINDOW IN
      settings.faq = 1;
      faq();

   } else { log('FAQ has already been performed'); }
});

$('body').on('mouseover', '#show-legend', (event) => { legend(event); });
$('body').on('mouseout', '#show-legend', () => { $('#legend').css('display', 'none'); });

// MAP ONCLICK COORD CALCULATOR
$('#map').on('click', (event) => {

   // CHECK THAT A WAYPOINT WASNT CLICKED
   if (event.target.tagName != 'IMG') {

      // MAP HEIGHT & WIDTH PROPS
      var map = {
         width: event.currentTarget.clientWidth,
         height: event.currentTarget.clientHeight
      }

      // CLICKED COORDS
      var clicked = {
         x: event.offsetX,
         y: event.offsetY,
      }

      // FIGURE OUT % COORS
      var x = ((clicked.x / map.width) * 100).toFixed(0);
      var y = ((clicked.y / map.height) * 100).toFixed(0);

      // LOG THEM OUT
      log(x + '.' + y)
   }
});