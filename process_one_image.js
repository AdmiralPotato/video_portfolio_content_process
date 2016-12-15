//usage: node process_one_image.js inputFilePath outputFilePath 85
//                                                       quality^
var Jimp = require("jimp");
var inputPath = process.argv[2];
var outputPath = process.argv[3];
var quality = parseInt(process.argv[4], 10);

Jimp.read(inputPath, function (err, image) {
	if (err) throw err;
	image
		.quality(quality)
		.write(outputPath, function(){
			console.log(outputPath);
		});
});
