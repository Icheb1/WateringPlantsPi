//Bewässerungsprojekt für Raspberry Pi
//
// Braucht: https://github.com/pichfl/spi-device-mcp3008
//

const spiDeviceMcp3008 = require('spi-device-mcp3008');
const gpio = require('onoff').Gpio;

var channelList = [];
var isbeingWatered = [];
var relais = [];
const gpioNr = [21,20,16,26,19,13,6,5];


for (var i = 0; i < 8; i++) {
  channelList.push(spiDeviceMcp3008(i, 0, 0)); // channel i of /dev/spidev0.0
  isbeingWatered.push(false);
  relais.push(new gpio(gpioNr[i], 'in'));
}

channelList.forEach((channel, i) => {
  channel
  .on('read', (value, raw) => {
    console.log(i);
    console.log(value, raw);
    console.log("");
    if ((raw > 800 || isbeingWatered[i]) && raw > 500) { // TODO: Wert durch Config ändern
      //GPIO
      if (!isbeingWatered[i]) {
        relais[i].setDirection('out');
      }
      console.log("watering..");
      isbeingWatered[i] = true;
      sleep(1000)
      //Rekursion
      channel.read()
    }
    if (raw < 500 && isbeingWatered[i]) { // TODO: Wert durch Config ändern
      isbeingWatered[i] = false;
      relais[i].setDirection('in');
      console.log("Stopped");
    }
    if (raw < 800 && !isbeingWatered[i] && i < 7) {
      channelList[i+1].read()
    }
    return true;
  })
  .on('error', err => console.error(err));



});

readoutAll();


function sleep(milliseconds) {
  const date = Date.now();
  let currentDate = null;
  do {
    currentDate = Date.now();
  } while (currentDate - date < milliseconds);
}

async function readoutAll() {
  console.log("");
  channelList[0].read();
  setTimeout(readoutAll, 1000*60);
}
