var zoom = 1;
var img_x = 1440;
var img_y = 960;
var last_event;

   // WHEN MOUSE IS BEING HELD
   map.addEventListener("mousedown", (event) => {
      last_event = event;
      document.addEventListener('mousemove', drag);
   });

   map.addEventListener('wheel', wheel);

   // WHEN MOUSE IS RELEASED
   document.addEventListener("mouseup", () => {
      document.removeEventListener('mousemove', drag);
   });

   function drag(current_event) {

      // PREVENT DEFAULT
      current_event.preventDefault();

      var bg_x = img_x * zoom;
      var bg_y = img_y * zoom;
   
      $('#map').css('background-size', bg_x + 'px ' + bg_y + 'px');
      var x = -(bg_x - $('#map')[0].offsetWidth) / 2;
      var y = -(bg_y - $('#map')[0].offsetHeight) / 2;
   
      var max_x = x * 2;
      var max_y = y * 2;
   
      $('#map').css('background-position', x + 'px ' + y + 'px');

      // FIGURE OUT COORDINATE DIFFERENCES
      var delta_x = last_event.clientX - current_event.clientX;
      var delta_y = last_event.clientY - current_event.clientY;

      // POSITIONAL DIFFERENCE
      x -= delta_x;
      y -= delta_y;

      // RECALIBRATE X VALUE IF IT BREAKS
      if (x > 0) { x = 0; }
      if (x < max_x) { x = max_x; }

      // RECALIBRATE Y VALUE IF IT BREAKS
      if (y > 0) { y = 0; }
      if (y < max_y) { y = max_y; }

      // CHANGE THE BACKGROUNDS POSITION
      $('#map').css('background-position', x + 'px ' + y + 'px');

      // UPDATE LAST EVENT
      last_event = current_event;
   }

function wheel(event) {

   var direction = event.deltaY;

   if (direction < 0) {
      zoom += .2;
   
   } else {
      zoom -= .2;
   }

   drag(last_event)
}

// MOUSEWHEEL
$('#map').on('wheel', () => {

   // FIGURE OUT WHEEL DIRECTION
   var direction = 'up';
   if (event.deltaY > 0) { direction = 'down'; }
   
   // INCREASE ZOOM
   if (direction == 'up' && settings.zoom.current < settings.zoom.max) {
      settings.zoom.current += settings.zoom.jump;

   // REDUCE ZOOM
   } else if (direction == 'down' && settings.zoom.current > settings.zoom.min) {
      settings.zoom.current -= settings.zoom.jump;
   }
   
   // ROUND TO ONE DECIMAL
   settings.zoom.current = Math.round(settings.zoom.current * 10) / 10;

   // EXECUTE CHANGE IN SIZE
   $('#map').css('background-size', settings.background.width * settings.zoom.current + 'px ' + settings.background.height * settings.zoom.current + 'px');
});