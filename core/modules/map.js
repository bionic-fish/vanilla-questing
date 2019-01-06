// CENTER MAP
function position(settings) {

   // FIND CENTER COORDS
   var coords = {
      x: -(settings.background.width - ($('#map-inner')[0].offsetWidth - 4)) / 2,
      y: -(settings.background.height - ($('#map-inner')[0].offsetHeight - 4)) / 2
   }

   // EXECUTE MOVEMENT
   $('#map').css('left', coords.x + 'px');
   $('#map').css('top', coords.y + 'px');
}

// EXPORT MODULES
module.exports = {
   position: position
}