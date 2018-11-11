var current = 1;
var max = 4;
set_points(current);

$(document).on('keyup', (evt) => {

   // WHEN 'A' IS PRESSED
   if (evt.keyCode == 65) {
      var block = current - 1;

      if (block < 5 && block > 0) {
         set_points(block);
         current = block;
      }
   }

   // WHEN 'A' IS PRESSED
   if (evt.keyCode == 68) {
      var block = current + 1;

      if (block < 5 && block > 0) {
         set_points(block); 
         current = block;
      }
   }
});