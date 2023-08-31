var cmd = require('node-cmd');

//enable swap file
cmd.runSync(`.\\ffmpeg.exe -i test.mp3 -c copy -metadata title="${title}" -metadata artist="${artist}" output.mp3`);
//cmd.run('sudo /bin/echo 1 > /sys/class/leds/green:internet/brightness'); //open stick
