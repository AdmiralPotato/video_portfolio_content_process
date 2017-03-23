//usage: node video_portfolio_content.js doubly_pyramidal-48-png
//                              inputPath^

var fs = require("fs");
var child_process = require("child_process");
var inputPath = process.argv[2];
var inputName = inputPath.replace('-png', '');
var quality = parseInt(process.argv[3], 10);
var outputPrefix = 'output/';
if(!fs.existsSync(outputPrefix)){
	fs.mkdirSync(outputPrefix);
}

var childProcessIt = function(command, logName){
	var start = Date.now();
	console.log(logName + ' - Start');
	child_process.exec(
		command,
		function(err, stdout, stderr) {
			console.log(logName + ' - End');
			if (err) {
				console.error(err);
				return;
			}
			var time = (Date.now() - start);
			console.log([stdout, time, 'ms'].join(' ').replace(/\n/g, ' '));
		}
	);
};

var formatList = [
	{
		resolution: [1920,1080],
		bitrate: 20000
	},
	{
		resolution: [960,540],
		bitrate: 5000
	}
];

var makeEncodeCommand = function(format) {
	var pixFormat = 'yuv420p'; //change to 444 later when the client side can handle it
	var resolution = format.resolution.join('x');
	var bitrate = format.bitrate;
	var outputPathString = outputPrefix + [inputName, resolution, pixFormat, bitrate].join('-') + '.hevc';
	return [
		'ffmpeg -framerate 24 -f image2 -i',
		inputPath + '/%04d.png',
		'-vcodec rawvideo -keyint_min 1',
		'-s ' + resolution,
		'-r 24',
		'-pix_fmt ' + pixFormat,
		'-c:v libx265',
		'-b:v ' + bitrate + 'k',
		'-preset veryslow -x265-params keyint=1:ref=1:no-open-gop=1:weightp=0:weightb=0:cutree=0:rc-lookahead=0:bframes=0:scenecut=0:b-adapt=0:repeat-headers=1',
		outputPathString
	].join(' ');
};

var makeVideos = function () {
	formatList.forEach(function(format){
		var command = makeEncodeCommand(format);
		childProcessIt(command, 'makeVideo' + format.resolution.join('x'));
	});
};

var makeThumb = function(){
	var inputPathString = inputPath + '/0001.png';
	var outputPathString = outputPrefix + inputName + '.jpg';
	var command = [
			'node',
			'make_thumb.js',
			inputPathString,
			outputPathString,
			quality
		].join(' ');
	childProcessIt(command, 'makeThumb');
};

makeVideos();
makeThumb();
