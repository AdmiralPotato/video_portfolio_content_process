//usage: node make_thumb.js inputFilePath outputFilePath

var Jimp = require("jimp");
var inputPath = process.argv[2];
var outputPath = process.argv[3];
var quality = 85;

Jimp.read(inputPath, function (err, image) {
	if (err) throw err;
	image
		.resize(640, 360)
		.quality(quality)
		.write(outputPath, function(){
			console.log(outputPath);
		});
});
