//usage: node video_portfolio_content.js doubly_pyramidal-48-png
//                              inputPath^

var fs = require("fs");
var JSZip = require("jszip");
var path = require("path");
var child_process = require("child_process");
var inputPath = process.argv[2];
var pathFlavor = inputPath.indexOf('\\') === -1 ? 'posix' : 'win32';
var animationName = path[pathFlavor].basename(inputPath).replace('-png', '');
var frames = parseInt(inputPath.split('-')[1], 10);
var outputPrefix = 'output_jpg/';
if(!fs.existsSync(outputPrefix)){
	fs.mkdirSync(outputPrefix);
}

var childProcessIt = function(command, logName, callback){
	var start = Date.now();
	console.log(logName + ' - Start');
	console.log(command);
	child_process.exec(
		command,
		function(err, stdout, stderr) {
			console.log(logName + ' - End');
			if(callback){
				callback();
			}
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
	'1920x1080',
	'960x540'
];

var makeImageZips = function () {
	formatList.forEach(function(resolution){
		var outputPathString = outputPrefix + [animationName, resolution].join('-');
		var pngToJpgCommand = makeJpgSequenceCommand(resolution, outputPathString);
		var zipOnComplete = function(){
			makeZip(outputPathString);
		};
		if(!fs.existsSync(outputPathString)){
			fs.mkdirSync(outputPathString);
		}
		childProcessIt(pngToJpgCommand, 'makeJpgSequence' + resolution, zipOnComplete);
	});
};

var makeJpgSequenceCommand = function(resolution, outputPathString) {
	var blur = resolution === formatList[0] ? '-define filter:blur=0.5' : '';
	return [
		'convert',
		'-strip',
		'-resize ' + resolution,
		blur,
		'-quality 97%',
		inputPath + '/*.png',
		'-scene 1', // output starts at 0001.jpg instead of 0000.jpg
		outputPathString + '/%04d.jpg'
	].join(' ');
};

var makeZip = function(outputPathString){
	var zip = new JSZip();
	var zipName = outputPathString + '.zip';
	var jpgList = [];
	var frame = frames;
	while (frame--) {
		jpgList.push(outputPathString + '/' + padLeft(frame + 1, 4) + '.jpg');
	}
	jpgList.forEach(function(readImagePath){
		var fileData = fs.readFileSync(readImagePath);
		var fileName = readImagePath.split('/').pop();
		zip.file(
			fileName,
			fileData
		);
	});
	zip
		.generateNodeStream({
			type:'nodebuffer',
			streamFiles:true,
			compression:'DEFLATE',
			compressionOptions: {
				level: 9
			}
		})
		.pipe(fs.createWriteStream(zipName))
		.on('finish', function () {
			console.log(zipName + ' written.');
		});
	console.log('Finished creating zip: ' + zipName);
};

var padLeft = function(nr, n, str){
	return Array(n-String(nr).length+1).join(str||'0')+nr;
};

var makeThumb = function(resolution, name, quality, enableOverlay){
	var command = makeProgressivePreviewCommand(resolution, name, quality, enableOverlay);
	childProcessIt(command, 'makeThumb');
};

var makeProgressivePreviewCommand = function(resolution, name, quality, enableOverlay) {
	var inputPathString = inputPath + '/0001.png';
	var outputPathString = outputPrefix + animationName + '-' + name + '.jpg';
	var blur = resolution === formatList[0] ? '-define filter:blur=0.5' : '';
	var composite = enableOverlay ? 'overlay_play.png -composite' : '';
	return [
		'convert',
		'-gravity center',
		inputPathString,
		composite,
		'-strip',
		'-resize ' + resolution,
		blur,
		'-interlace Plane',
		'-quality '+ (quality || 90) +'%',
		outputPathString
	].join(' ');
};

makeImageZips();
makeThumb('1920x1080', 'og_preview', 97, true);
makeThumb('1920x1080', 'preview');
makeThumb('640x360', 'thumb');
