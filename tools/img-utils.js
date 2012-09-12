var fs = require('fs');
var Path = require('path');
var gm = require('gm');
var mkdirp = require('mkdirp');
var yaml = require('js-yaml');


exports.join=join;
exports.split=split;

function createEmptyFrame(){
	return {
		sourcePath : null,
		imgPath : null,
		name : null,
		x : 0,
		y : 0,
		w : 0,
		h : 0
	}
}


function split(frameList, cb) {
	var idx=-1;
	function _go_on(){
		idx++;
		if (idx<frameList.length){
			var frame=frameList[idx];
			createFrameImg( frame, _go_on);
		}else if(cb){
			cb();
		}
	}
	_go_on();
}

function createFrameImg(frame ,cb) {
	var output=frame.imgPath;
	var dir=Path.dirname(output);
	if ( !fs.existsSync(dir) ){
		mkdirp.sync(dir)
	}

	gm(frame.sourcePath).crop(frame.w, frame.h, frame.x, frame.y)
		.write( output , function(err) {
			if (err) {
				console.log(frame.name ,err);
			}
			if(cb){
				cb(err);
			}
		})
}

function join(frameList,outputPath , ltr,cb) {

	var fileList=[];
	frameList.forEach(function(frame,idx){
		fileList.push(frame.imgPath);
	})

	var listFile="_temp_filelist_.txt";
	var fileText=fileList.join("\n");

	var fd=fs.openSync(listFile,"w+");
	fs.writeSync(fd,fileText);
	fs.closeSync(fd);
		
	updateFrameSize(frameList,function(){
		joinFiles(listFile,outputPath,ltr,cb)
	})
}



function joinFiles(listFile,outputPath,ltr,cb){

	var output=outputPath;
	var dir=Path.dirname(output);
	if ( !fs.existsSync(dir) ){
		mkdirp.sync(dir)
	}

	gm("@"+listFile).append(ltr)
		.write( output , function(err) {
			if (err) {
				console.log(listFile,err);
			}
			if(cb){
				fs.unlinkSync(listFile);
				cb(err);
			}
		});
}


function updateFrameSize(frameList, cb) {
	var idx=-1;
	function _go_on(){
		idx++;
		if (idx<frameList.length){
			var frame=frameList[idx];
			readFileSize( frame.imgPath,frame, _go_on);
		}else if(cb){
			cb();
		}
	}
	_go_on();
}

function readFileSize(imgPath,frame,cb){

	gm(imgPath).size(function(err,value){
		if (err){
			console.log(imgPath,err);
		}else{
			frame.w=value.width;
			frame.h=value.height;
		}
		if (cb){
			cb();
		}
	});

}






