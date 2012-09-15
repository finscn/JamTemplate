

;(function(scope, undefined){


var FrameCounter = scope.FrameCounter =function(cfg){	
	for (var property in cfg ){
		this[property]=cfg[property];
	}
};

FrameCounter.prototype= {
	constructor : FrameCounter ,
	id : "FPSCounterBar",
	avg : false ,
	time : 0,
	avgTime : 0 ,
	FPS : 60 ,
	_count : 0,
	frame : 0,
	start : 0,
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
				minWidth: "100px",
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
	reset : function(){
		this._count=this.FPS;
		this.lastTickTime=Date.now();

		this.avgTime=1000/this.FPS;
		this.lastTime=this.lastTickTime;
		this.tick=this.avg?this.avgTick:this.tickRecently;
	},

	tick : function(){},

	tickAvg : function(){
		this._count--;
		var now=Date.now();
		this.avgTime=this.avgTime*0.9+(now-this.lastTime)*0.1;
		this.lastTime=now;
		if (this._count==0){
			this._count=this.FPS;
			this.dom.innerHTML ="FPS:" + ( 10000/this.avgTime>>0)/10;
		}
	},
	tickRecently : function(){
		this._count--;
		if (this._count==0){
			this._count=this.FPS;
			var now=Date.now();
			var fps=10000*this.FPS/(now-this.lastTickTime);
			this.lastTickTime=now;
			this.dom.innerHTML ="FPS:" + (fps>>0)/10;
		}
	},

	tickDebug : function(){
		this._count--;
		var now=Date.now();

		this.avgTime=this.avgTime*0.9+(now-this.lastTime)*0.1;
		this.lastTime=now;

		this.frame++;
		this.start=this.start||now;

		if (this._count==0){
			this._count=this.FPS;
			var fps=10000*this.FPS/(now-this.lastTickTime);
			this.lastTickTime=now;

			var af=(10000*this.frame/(now-this.start)>>0)/10;

			this.dom.innerHTML ="FPS:" +(fps>>0)/10 + "/"+( 10000/this.avgTime>>0)/10+"-"+af ;
		}
	}
};

}(this));

