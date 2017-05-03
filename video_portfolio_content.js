//usage: node video_portfolio_content.js doubly_pyramidal-48-png
//                              inputPath^

var fs = require("fs");
var path = require("path");
var child_process = require("child_process");
var inputPath = process.argv[2];
var pathFlavor = inputPath.indexOf('\\') === -1 ? 'posix' : 'win32';
var animationName = path[pathFlavor].basename(inputPath).replace('-png', '');
var outputPrefix = 'output/';
if(!fs.existsSync(outputPrefix)){
	fs.mkdirSync(outputPrefix);
}

var childProcessIt = function(command, logName){
	var start = Date.now();
	console.log(logName + ' - Start');
	console.log(command);
	child_process.exec(
		command,
		function(err, stdout, stderr) {
			console.log(logName + ' - End');
			if (err) {
				console.error(err);
				return;
			}
			if (stderr) {
				console.error(stderr);
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
		bitrate: 40000
	},
	{
		resolution: [960,540],
		bitrate: 10000
	}
];

var makeEncodeCommand = function(format) {
	var pixFormat = 'yuv444p';
	var resolution = format.resolution.join('x');
	var bitrate = format.bitrate;
	var outputPathString = outputPrefix + [animationName, resolution, pixFormat, bitrate].join('-') + '.webm';
	return [
		'ffmpeg -y -framerate 24 -f image2 -i',
		inputPath + '/%04d.png',
		'-vcodec rawvideo -keyint_min 1',
		'-s ' + resolution,
		'-r 24',
		'-c:v libvpx-vp9',
		'-threads 4',
		'-profile 1',
		'-pix_fmt ' + pixFormat,
		'-b:v ' + bitrate + 'k',
		'-preset veryslow',
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
	var quality = 85;
	var inputPathString = inputPath + '/0001.png';
	var outputPathString = outputPrefix + animationName + '.jpg';
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
