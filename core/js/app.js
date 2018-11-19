// DATA
var data = [
   $.getJSON('../data/001-elwynn.json'),
   $.getJSON('../data/002-transition.json'),
   $.getJSON('../data/003-morogh.json'),
   $.getJSON('../data/004-loch.json'),
   $.getJSON('../data/005-transition.json'),
   $.getJSON('../data/006-darkshore.json'),
   $.getJSON('../data/007-transition.json'),
   $.getJSON('../data/008-westfall.json'),
   $.getJSON('../data/009-transition.json'),
   $.getJSON('../data/010-redridge.json'),
   $.getJSON('../data/011-transition.json'),
   $.getJSON('../data/012-darkshore.json'),
   $.getJSON('../data/013-ashenvale.json'),
   $.getJSON('../data/014-darkshore.json'),
   $.getJSON('../data/015-transition.json'),
   $.getJSON('../data/016-menethil.json'),
   $.getJSON('../data/017-duskwood.json'),
   $.getJSON('../data/018-transition.json'),
   $.getJSON('../data/019-duskwood.json'),
   $.getJSON('../data/020-redridge.json'),
   $.getJSON('../data/021-duskwood.json'),
   $.getJSON('../data/022-transition.json'),
   $.getJSON('../data/023-wetlands.json'),
   $.getJSON('../data/024-transition.json'),
   $.getJSON('../data/025-wetlands.json'),
   $.getJSON('../data/026-transition.json'),
   $.getJSON('../data/027-duskwood.json'),
   $.getJSON('../data/028-transition.json'),
   $.getJSON('../data/029-ashenvale.json'),
   $.getJSON('../data/030-transition.json'),
   $.getJSON('../data/031-stv.json'),
   $.getJSON('../data/032-southshore.json'),
   $.getJSON('../data/033-arathi.json'),
   $.getJSON('../data/034-transition.json'),
   $.getJSON('../data/035-needles.json'),
   $.getJSON('../data/036-dustwallow.json'),
   $.getJSON('../data/037-transition.json'),
   $.getJSON('../data/038-desolace.json'),
   $.getJSON('../data/039-transition.json'),
   $.getJSON('../data/040-swamp.json'),
   $.getJSON('../data/041-transition.json'),
   $.getJSON('../data/042-arathi.json'),
   $.getJSON('../data/043-alterac.json'),
   $.getJSON('../data/044-transition.json'),
   $.getJSON('../data/045-stv.json'),
   $.getJSON('../data/046-transition.json'),
   $.getJSON('../data/047-badlands.json'),
   $.getJSON('../data/048-transition.json'),
   $.getJSON('../data/049-stv.json'),
   $.getJSON('../data/050-tanaris.json')
];

// WAIT FOR EVERYTHING TO RESPOND
Promise.all(data).then((response) => {

   // LOCALSTORAGE KEY NAME
   var key_name = 'questing-page';

   // SET THE USERS STARTING BLOCK TO ZERO IF IT DOESNT EXIST
   if (localStorage.getItem(key_name) === null) { localStorage.setItem(key_name, '0'); }

   // BUILD UNITED JSON FILE
   data = build(response);
   
   // SETTINGS
   var current = parseInt(localStorage.getItem(key_name));
   var last_page = data.length;

   // SET RANGE INPUTS MAX ATTRIBUTE & THE SCROLL TO THE CORRECT POSITION
   $('#range').attr('max', last_page - 1);
   $('#range').val(current);

   // RENDER MAP & WAYPOINTS ON INITIAL LOAD
   render(data, current);

   // LISTEN FOR KEY PRESSES
   $(document).on('keyup', (evt) => {

      // WHEN 'A' IS PRESSED
      if (evt.keyCode == 65) {

         // BIND THE PREVIOUS NUMBER
         var previous = current - 1;

         // IF ITS HIGHER OR EQUAL TO ZERO 
         if (previous >= 0) {

            // UPDATE LOCALSTORAGE & THE CURRENT VAR
            localStorage.setItem(key_name, String(previous));
            current = previous;

            // RENDER NEW MAP & WAYPOINTS
            render(data, current);
         }
      }

      // WHEN 'D' IS PRESSED
      if (evt.keyCode == 68) {

         // BIND THE PREVIOUS NUMBER
         var next = current + 1;
         
         // IF ITS LOWER THAN THE MAXIMUM
         if (next < last_page) {

            // UPDATE LOCALSTORAGE & THE CURRENT VAR
            localStorage.setItem(key_name, String(next));
            current = next;

            // RENDER NEW MAP & WAYPOINTS
            render(data, current);
         }
      }

   });

   // SHOW TOOLTIP ON MOUSEOVER
   $('body').on('mouseover', 'img', (event) => { mouseover(event, data[current]); });

   // HIDE TOOLTIP ON MOUESOUT
   $('body').on('mouseout', 'img', () => { $('#tooltip').css('display', 'none'); });
});