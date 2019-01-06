// SHORTHAND FOR CONSOLE LOGGING
function log(stuff) { console.log(stuff); }

// WAIT FOR GIVEN MILLISECONDS
function sleep (time) { return new Promise((resolve) => setTimeout(resolve, time)); }

// SHORTEN A LONG STRING
function shorten(string) {
   
   // MAX CHARACTER LIMIT
   var max_length = 25;
   
   // CHECK IF THE STRING IS LONGER THAN 22 CHARACTERS
   if (string.length > max_length) {

      // ALLOW THE FIRST 20 CHARACTERS AND TAG ON THE TRIPLEDOT
      string = string.substring(0, (max_length - 3));
      string += '...';
   }

   return string;
}

// CAPITALIZE STRING
function capitalize(string) {
   string = string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
   return string;
}