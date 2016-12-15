//usage: node video_portfolio_content.js doubly_pyramidal-48-png 85
//                              inputPath^                quality^
var fs = require("fs");
var child_process = require("child_process");
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

console.time(outputPath);
var completed = 0;
inputList.forEach(function(imageName){
		var inputPathString = inputPath + '/' + imageName;
		var outputPathString = jerpDerp(inputPathString);
		var start = Date.now();
		child_process.exec(
			[
				'node',
				'process_one_image.js',
				inputPathString,
				outputPathString,
				85
			].join(' '),
			function(err, stdout, stderr){
				if (err) {
					console.error(err);
					return;
				}
				var time = (Date.now() - start);
				console.log([stdout, time, 'ms'].join(' ').replace(/\n/g, ' '));
				completed++;
				if(completed === inputList.length){
					console.timeEnd(outputPath);
				}
			}
		);
});
