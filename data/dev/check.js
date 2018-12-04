waypoint.waypoints.forEach(block => {

   $.each(block.ends, (key, value) => {

      if (typeof(value) != 'string') {
         
         var xoxo = value[0].toLowerCase();

         if (data.ids[xoxo] == undefined) {

            log(xoxo);
         }

      } else {

         var xoxo = value.toLowerCase();

         if (data.ids[xoxo] == undefined) {
            log(xoxo);
         }
      }

   });
});