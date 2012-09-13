

;(function(scope, undefined){


var FrameCounter = scope.FrameCounter =function(cfg){	
	for (var property in cfg ){
		this[property]=cfg[property];
	}
	this._count=this.count;
};

FrameCounter.prototype= {
	constructor : FrameCounter ,
	id : "FPSCounterBar",
	time : 0,
	count : 60 ,
	_count : 0,
	init : function(){
		var div =document.getElementById(this.id);
		if (div == null) {
			var style ={
				backgroundColor: "rgba(0,0,0,0.6)",
				position: "absolute",
				left: "1px",
				top: "1px",
				border: "solid 1px #ccc",
				color: "#fff",
				padding : "3px",
				width: "100px",
				height: "30px",
				fontSize: "22px",
				zIndex: 99999
			};
			div=document.createElement("div");
			div.id=this.id;
			for (var p in style){
				div.style[p]=style[p];
			}
			document.body.appendChild(div);
		}
		div.innerHTML="Waiting...";
		this.dom=div;
	},

	tick : function(){
		this._count--;
		if (this._count==0){
			var now=Date.now();
			this._count=this.count;
			var fps=this._count*1000/(now-this.time);
			this.time=now;
			this.dom.innerHTML ="FPS:" + (fps*10>>0)/10;
		}
	}
};

}(this));

