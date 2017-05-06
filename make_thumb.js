//usage: node make_thumb.js inputFilePath outputFilePath 1920x1080

var Jimp = require("jimp");
var argv = process.argv;
var inputPath = argv[2];
var outputPath = argv[3];
var size = argv[4].split('x');
var quality = 95;

Jimp.read(inputPath, function (err, image) {
	if (err) throw err;
	image
		.resize(parseInt(size[0], 10), parseInt(size[1], 10))
		.quality(quality)
		.write(outputPath, function(){
			console.log(outputPath);
		});
});
