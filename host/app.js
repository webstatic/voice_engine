var cmd = require('node-cmd');

//enable swap file
cmd.runSync('swapon /swapfile');
cmd.run('sudo /bin/echo 1 > /sys/class/leds/green:internet/brightness'); //open stick

//get docker image name
let syncDir = cmd.runSync('docker images'); //open stick

let spt = syncDir.data.split('\n')[1].split('   ')
let dockImage = spt[0] + ':' + spt[1]

console.log('start docker image', dockImage, '...');
//start docker
const processRef = cmd.run("docker run --rm -p '50021:50021' --cpus 4 " + dockImage);

let theFirst = true

//listen to the python terminal output
processRef.stdout.on('data', function (data) {
    if (theFirst) {
        cmd.run('sudo /bin/echo 0 > /sys/class/leds/green:internet/brightness'); //open stick
        theFirst = false
    }

    console.log(data);
});
