/**
 * Welcome to Pebble.js!
 *
 * Escapeprod Salle 1
 */

var UI = require('ui');
var ajax = require('ajax');
var Vector2 = require('vector2');
var Vibe = require('ui/vibe');
var Light = require('ui/light');
var remainingTime = 3599;
var booltime = true;
var main = new UI.Window({
    backgroundColor: 'black'
});
var iproom = '192.168.100.158';
var begin_game = false;
var card = new UI.Card({
  //bodyColor: 'white',
  font: 'gothic-24',
  scrollable: true
});
//card.title('A Card');
//card.subtitle('Is a Window');

var textfield = new UI.Text({
    size: new Vector2(140, 60),
    font: 'leco-32-bold-numbers',
    //font: 'gothic-24',
    text: '60:00',
    //text: 'Appuyez sur les deux boutons bleus en même temps, puis sur les deux boutons jaunes...',
    scrollable: true,
    textAlign: 'center'
});
var windSize = main.size();
  // Center the textfield in the window
var textfieldPos = textfield.position()
      .addSelf(windSize)
      .subSelf(textfield.size())
      .multiplyScalar(0.5);
textfield.position(textfieldPos);
main.add(textfield);
//main.add(card);
checkRoomStatus();
//refreshTime();
main.show();


function checkRoomStatus() {
  console.log("Check Room Status");
  ajax({ url: 'http://'+iproom+':5001/cmd/dev/status/ROOM'},
    function(data) {
      console.log(data);
      var parsed = JSON.parse(data);
      console.log(parsed.begin_game);
      if (parsed.begin_game == true) {
        console.log("Game started");
        begin_game = true;
        refreshTime();
      } else {
        setTimeout(checkRoomStatus, 30000);
      }
    },  // End of success callback
    function(error) {
      console.log('ERR');
      setTimeout(checkRoomStatus, 30000);
    }   // End of error callback
  );
}

function refreshTime() {
  console.log("RefreshTime Debut : "+remainingTime);
  if (remainingTime != 3600) {
    if (remainingTime % 10 == 0) {
        getTime();
        if ((remainingTime == 600) || (remainingTime == 300) || (remainingTime == 900)) {
          Vibe.vibrate('long');
          Light.trigger('long');
        }
    } else {
      	var m = Math.floor(remainingTime / 60);
        var s = Math.floor(remainingTime % 60);
        var min = m < 10 ? '0' + m : m;
        var sec = s < 10 ? '0' + s : s;
        var data = min+":"+sec;
        textfield.font('leco-32-bold-numbers');
      	console.log("time : "+data);
        if (remainingTime > 0) {
          textfield.text(data);
        } else {
          textfield.text("00:00");
        }
        console.log(data);
        remainingTime = remainingTime-1;
    }
  }
  console.log("RefreshTime Fin : "+remainingTime);
  setTimeout(refreshTime, 1000);
}

function getTime() {
  console.log("Get Time");
  ajax({ url: 'http://'+iproom+':5001/watch'},
    function(data) {
      var re = /(\d{2}):(\d{2})/;
      var res = data.match(re);
      if (res != null) {
        var time = res[1]*60+parseInt(res[2]);
        remainingTime = time-1;
        /*if (time != 0) {
          remainingTime = time-1;
        } else {
          remainingTime = 0; 
        }*/
        textfield.font('leco-32-bold-numbers');
      	console.log("time : "+data);
        textfield.text(data);
        if (!booltime) {
          card.hide();
          main.show();
          Vibe.vibrate('long');
          Light.trigger('long');
        }
        booltime=true;
      } else {
        card.body(data);
        //main.hide();
        //card.show();
        //textfield.font('gothic-24');
        //textfield.text(data);
      	console.log("text : "+data);
        console.log(booltime);
        if (booltime) {
          main.hide();
          card.show();
          Vibe.vibrate('long');
          Light.trigger('long');
        }
        booltime=false;
      }
      //setTimeout(getTime, 1000);
    },  // End of success callback
  
    function(error) {
      console.log('ERR');
      //setTimeout(getTime, 1000);
    }   // End of error callback
  );
  
}

/*main.on('click', 'up', function(e) {
  console.log('up');
});

main.on('click', 'down', function(e) {
  console.log('down');
});*/

main.on('click', 'select', function(e) {
  console.log('select');
});

/*
main.on('click', 'back', function(e) {
  console.log('back');
});
*/
