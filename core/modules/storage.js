// MAKE STORAGE KEY GLOBALLY AVAILABLE
var key;

// UPDATE STORAGE
function add(header, details) {

   // FETCH STORAGE STRING & CONVERT TO JSON
   var storage = localStorage.getItem(key);

   // CONVERT TO JSON
   storage = JSON.parse(storage);

   // INJECT THE CHANGES
   storage[header] = details;

   // STRINGIFY STORAGE & SET IT
   storage = JSON.stringify(storage);
   localStorage.setItem(key, storage);

   log('Property Added!');
}

// CHECK IF THERE'S SOMETHING IN LOCALSTORAGE
function check(storage_key) {

   // SET KEY
   key = storage_key;

   if (localStorage.getItem(key) === null) {
      localStorage.setItem(key, '{}');
   }
    
   // CONVERT OLD FORMAT
   convert_old(key);

   // SHORTHAND
   var storage = localStorage.getItem(key);

   // IF SOMETHING IS FOUND
   if (storage != '{}') {

      // CONVERT TO JSON
      storage = JSON.parse(storage);

      // CONTAINER
      var container = '';

      // LOOP THROUGH EACH CHARACTER
      Object.keys(storage).forEach(character => {
         
         // GENERATE A SELECTOR
         container += '<div id="opt" profile="' + character + '"><div class="split"><div><img src="interface/img/icons/' + storage[character].race + '.png"><span id="char-name">' + capitalize(character) + '</span></div><div>Level <span id="char-lvl">' + storage[character].level + '</span></div></div></div>';
      });

      // RENDER THEM IN
      $('#storage').html(container);
   }
}

// UPDATE STORAGE PROPERTY
function update(data) {

   // MAKE SURE A PROFILE IS SELECTED
   if ($('#loaded')[0] != undefined) {

      // FISH OUT RELEVANT PROPERTIES
      var level = parseInt(String(data.route.path[data.current].experience).split('.')[0]);
      var block = data.current;

      // FIND THE LOADED PROFILES NAME
      var profile = $('#loaded').attr('profile');

      // CONVERT STORAGE TO JSON
      var storage = JSON.parse(localStorage.getItem(key));

      // SET NEW VALUES
      storage[profile].block = block;
      storage[profile].level = level;

      // STRINGIFY & UPDATE STORAGE
      storage = JSON.stringify(storage);
      localStorage.setItem(key, storage);

      // UPDATE THE SUBMENU
      $('#loaded #char-lvl').text(level);
   }
}

// CONVERTS OLD FORMAT TO NEW FORMAT
function convert_old() {

   // OLD KEYS
   var alliance = localStorage.getItem('questing-page');
   var horde = localStorage.getItem('horde');

   // CHECK WHETHER EITHER EXISTS
   if (alliance != null || horde != null) {

      // PLACEHOLDER
      var obj = {};

      // CHECK ALLIANCE
      if (alliance != null) {
         
         // INJECT NEW PROPERTY
         obj['allygurl'] = {
            race: 'human',
            level: 99,
            block: alliance
         }

         // REMOVE THE OLD ITEM
         localStorage.removeItem('questing-page');
      }

      // CHECK HORDE
      if (horde != null) {
         
         // INJECT NEW PROPERTY
         obj['hordeboi'] = {
            race: 'orc',
            level: 99,
            block: horde
         }

         // REMOVE THE OLD ITEM
         localStorage.removeItem('horde');
      }

      // STRINGIFY & SET THE NEW ITEM
      obj = JSON.stringify(obj);
      localStorage.setItem(key, obj)
   }
}

// NUKE STORAGE CONTENT
function nuke() {
   localStorage.removeItem(key);
   log('Storage Nuked!');
}

// FETCH BLACKLISTED NAMES
function blacklist() {

   // DEFAULT BLACKLIST
   var blacklist = [];

   // FETCH & CONVERT STORAGE TO JSON
   var storage = localStorage.getItem(key);
   storage = JSON.parse(storage);

   // SET BLACKLIST IF ITS DEFINED
   if (storage != null) { blacklist = Object.keys(storage); }

   return blacklist;
}

// FETCH SPECIFIC DATA
function fetch(name) {

   // FETCH WHOLE STORAGE & CONVERT TO JSON
   var storage = localStorage.getItem(key);
   storage = JSON.parse(storage);

   // SINGLE OUT & RETURN REQUEST 
   var details = storage[name];
   return details;
}

// EXPORT MODULES
module.exports = {
   add: add,
   check: check,
   nuke: nuke,
   update: update,
   blacklist: blacklist,
   fetch: fetch
}