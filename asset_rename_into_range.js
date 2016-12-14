//usage: node asset_rename_into_range.js target_dir-48-png
//                                       num frames ^
var fs = require("fs");
var padLeft = function(nr, n, str){
	return Array(n-String(nr).length+1).join(str||'0')+nr;
};
var inputPath = process.argv[2];
var pathParts = inputPath.split('-');
var numFrames = parseInt(pathParts[1], 10);
var inputList = fs.readdirSync(inputPath)
	.filter(function(fileName){
		return fileName.split('.').pop() === 'png';
	});
inputList.forEach(function (imageName, i) {
	var correctedImageName = padLeft(
			((parseInt(imageName, 10) -1) % numFrames) + 1,
			4,
			'0'
		) + '.png';
	var inputString = inputPath + '/' + imageName;
	var outputString = inputPath + '/' + correctedImageName;
	console.log(inputString, outputString);
	fs.renameSync(inputString, outputString);
});
