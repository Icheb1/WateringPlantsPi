//Bewässerungsprojekt für Raspberry Pi
//
// Braucht: https://github.com/pichfl/spi-device-mcp3008
//

const spiDeviceMcp3008 = require('spi-device-mcp3008');

var channelList = [];
var averagesV = [];
var averagesR = [];
var iterations = 0;

for (var i = 0; i < 8; i++) {
  channelList.push(spiDeviceMcp3008(i, 0, 0)); // channel i of /dev/spidev0.0
  averagesV.push(0);
  averagesR.push(0);
}

channelList.forEach((channel, i) => {
  channel
  .on('read', (value, raw) => {
    console.log(i);
    console.log(value, raw);
    averagesV[i] += value;
    averagesR[i] += raw;
    console.log(averagesV[i]/iterations, averagesR[i]/iterations);
    console.log("");
  })
  .on('error', err => console.error(err));



});

readoutAll();





async function readoutAll() {
  console.log("");
  console.log("Iteration: ", iterations);
  iterations++;
  channelList.forEach((channel, i) => {
    channel.read();
  });
  console.log("");
  setTimeout(readoutAll, 1000*5);
}
