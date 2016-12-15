//usage: node video_portfolio_content.js doubly_pyramidal-48-png 85
//                              inputPath^                quality^
var Jimp = require("jimp");
var fs = require("fs");
var jerpDerp = function(pngName){return pngName.replace(/png/gi, 'jpg');};
var inputPath = process.argv[2];
var quality = parseInt(process.argv[3], 10);
var outputPath = jerpDerp(inputPath);
var pathInt = function(path){
	var file = path.split('/').pop();
	var int = parseInt(file, 10);
	return int;
};
var inputList = fs.readdirSync(inputPath);
inputList = inputList
	.filter(function(fileName){
		return fileName.split('.').pop() === 'png';
	})
	.sort(function(a, b){
		var A = pathInt(a);
		var B = pathInt(b);
		var result = 0;
		if (A < B) {
			result = -1;
		}
		if (A > B) {
			result =  1;
		}
		return result;
	});
if(!fs.existsSync(outputPath)){
	fs.mkdirSync(outputPath);
}

var shiftLoop = function (inputList, list) {
	if(list === undefined){
		list = inputList.slice();
		console.time(outputPath);
	}
	if(list.length){
		var imageName = list.shift();
		var inputString = inputPath + '/' + imageName;
		var outputString = jerpDerp(inputString);
		var start = Date.now();
		Jimp.read(inputString, function (err, image) {
			if (err) throw err;
			image
				.quality(quality)
				//.resize(960, 540)
				.write(outputString, function(){
					var time = (Date.now() - start);
					console.log(outputString, time + 'ms');
					shiftLoop(inputList, list);
				});
		});
	} else {
		console.timeEnd(outputPath);
	}
};

shiftLoop(inputList);
