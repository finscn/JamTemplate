var fs = require('fs');
var path = require('path');
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
	function _parseFrame(){
		idx++;
		if (idx<frameList.length){
			var frame=frameList[idx];
			createFrameImg( frame, _parseFrame);
		}else if(cb){
			cb();
		}
	}
	_parseFrame();
}

function createFrameImg(frame ,cb) {
	var output=frame.imgPath;
	var dir=path.dirname(output);
	if ( !fs.existsSync(dir) ){
		mkdirp.sync(dir)
	}

	gm(frame.sourcePath).crop(frame.w, frame.h, frame.x, frame.y)
		.write( output , function(err) {
			if (err) {
				console.log(frame.name ,err);
			}else if(cb){
				cb();
			}
		})
}

function join(frameList,outputPath , cb) {

	var ltr=true;

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
		// initConfig(frameList,ltr);
		joinFiles(listFile,outputPath,ltr,cb)
	})
}

function initConfig(frameList,ltr){
	var config=[];
	var lastX=0, lastY=0;

	frameList.forEach(function(frame,idx){
		config.push( {
			img : frame.imgPath,
			x : lastX,
			y : lastY,
			w : frame.w,
			h : frame.h
		})
		if (ltr){
			lastX+=frame.w;
		}else{
			lastY+=frame.h;
		}
	})
	console.log(config);
}

function joinFiles(listFile,outputPath,ltr,cb){

	var output=outputPath;
	var dir=path.dirname(output);
	if ( !fs.existsSync(dir) ){
		mkdirp.sync(dir)
	}

	gm("@"+listFile).append(ltr)
		.write( output , function(err) {
			if (err) {
				console.log(listFile,err);
			}else if(cb){
				fs.unlinkSync(listFile);
				cb();
			}
		});
}


function updateFrameSize(frameList, cb) {
	var idx=-1;
	function _parseFrame(){
		idx++;
		if (idx<frameList.length){
			var frame=frameList[idx];
			readFileSize( frame.imgPath,frame, _parseFrame);
		}else if(cb){
			cb();
		}
	}
	_parseFrame();
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






