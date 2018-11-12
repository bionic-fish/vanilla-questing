// LOAD WAYPOINT BLOCKS
$.getJSON('https://wickstjo.github.io/vanilla-questing/data/blocks.json').then((response) => {

   var current = 0; // response.blocks.length - 1
   var max = response.blocks.length;

   // RUN WHEN FIRST LOADED IN
   set_points(current, response);

   $(document).on('keyup', (evt) => {

      // WHEN 'A' IS PRESSED
      if (evt.keyCode == 65) {
         var block = current - 1;

         if (block < max && block > -1) {
            set_points(block, response);
            current = block;
         }
      }

      // WHEN 'A' IS PRESSED
      if (evt.keyCode == 68) {
         var block = current + 1;

         if (block < max && block > -1) {
            set_points(block, response); 
            current = block;
         }
      }
   });

   // SHOW TOOLTIP ON MOUSEOVER
   $('body').on('mouseover', 'img', (event) => {

      // PICK UP DETAILS
      var id = $(event.target).attr('wp');
      var waypoint = response.blocks[current].waypoints[id];

      // GENERATE WAYPOINT DATA
      var header = '';
      var ends = '';
      var starts = '';
      var objectives = '';

      // GENERATE DIVS FOR FILLED PROPERTIES
      waypoint.ends.forEach(quest_name => { ends += '<div class="ends">' + quest_name + '</div>'; });
      waypoint.starts.forEach(quest_name => { starts += '<div class="starts">' + quest_name + '</div>'; });
      waypoint.objectives.forEach(quest_name => { objectives += '<div class="objectives">' + quest_name + '</div>'; });
      if (waypoint.header != '') { header += '<div class="header">' + waypoint.header + '</div>'; }

      // RENDER IN WAYPOINT DATA
      $('#tooltip').html(header + ends + starts + objectives);

      // TOOLTIP PROPERTIES
      var tooltip = {
         width: parseFloat($('#tooltip').css('width')),
         height: parseFloat($('#tooltip').css('height')),
         padding: parseInt($('#tooltip').css('padding')[0]),
         offset: 5
      }

      // FIGURE OUT THE XY POSITION WITH OFFSETS
      var x = event.target.x - (tooltip.width / 2);
      var y = event.target.y - (tooltip.height + (tooltip.offset + (2 * tooltip.padding)));

      // SET CSS
      $('#tooltip').css('left', x);
      $('#tooltip').css('top', y);
      $('#tooltip').css('display', 'inline-block');
   });

   // HIDE TOOLTIP ON MOUESOUT
   $('body').on('mouseout', 'img', () => { $('#tooltip').css('display', 'none'); });

});