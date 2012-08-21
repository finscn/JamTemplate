
;(function(scope,undefined){
	

var Game=scope.Game=function(cfg){
	scope.merger(this,cfg);
}


Game.prototype={
	constructor : Game,

	FPS : 60 ,
	timer : null ,
	resources : null,

	width : 800,
	height : 480,
	viewWidth : null,
	viewHeight : null,

	container : null ,
	viewport : null ,
	canvas : null ,
	context : null,
	
	sceneIndex : 0 ,
	currentScene : null,
	
	uiPool : null ,
	uiZIndex : 1000,
	uiFadeTime : 2000,

	loader : null ,
	state : null,

	init : function(){

		this.viewWidth=this.viewWidth||this.width;
		this.viewHeight=this.viewHeight||this.height;
	
		this.scenes=this.scenes||[];
		this.sleep=Math.floor(1000/this.FPS);
		this.timer=new scope.Timer(this.timer);

		this.uiPool=scope.$id(this.uiPool)||document.body;
		if ( this.uiPool!=document.body ){
			this.uiPool.style.display="none";
		}
	
		this.initContainer();
		this.initLoader();

		var Me=this;
		this.callRun = function(){
			Me.run();
		}

		this.onInit();
	},
	onInit : scope.noop ,

	initContainer : function(){
		this.container=scope.$id(this.container)||this.container;
		if (!this.container){
			this.container=document.createElement("div");
			document.body.appendChild(this.container);
		}		
		var domStyle=this.container.style;
		scope.merger(domStyle,{
			position : "relative" ,
			overflow : "hidden" ,		
			padding : "0px" ,
			width : this.width+"px" ,
			height : this.height+"px",
			marginLeft : "50%",
			left : -this.width/2+"px"
		});	
	},

	initLoader : function(){
		var Me=this;
		var loader=this.loader||{};
		this.loader=new scope.ProcessQ({
			interval : loader.interval || 1,
			defaultDelay : loader.delay || 1 ,
			onProgressing : function(timeStep, queue){
				var loaded=queue.finishedWeight,
					total=queue.totalWeight,
					results=queue.resultPool;
				return Me.onLoading(loaded,total,results);
			},
			onFinish : function(queue){
				var loaded=queue.finishedWeight,
					total=queue.totalWeight,
					results=queue.resultPool;
				for (var id in results){
					scope.ResourcePool.add(id, results[id]);
				}
				Me.onLoad=Me.onLoad||Me.ready;
				setTimeout(function() {
					Me.onLoad(loaded,total,results);
				},1);
			}
		});
	},

	beforeLoad : scope.noop ,	
	load : function(force){		
		if (this.beforeLoad(force)===false){
			return false;
		}
		var resources=this.resources?[].concat(this.resources):[];
		this.loader.items=resources;
		this.loader.init();
		this.loader.start();
	},
	onLoading : scope.noop,
	onLoad : null,


	initViewport : function(){
		
		this.viewport=document.createElement("div");
		this.container.appendChild(this.viewport);		
		var domStyle=this.viewport.style;
		scope.merger(domStyle,{
			position : "absolute" ,
			left : "0px",
			top : "0px",
			overflow : "hidden" ,	
			padding : "0px" ,
			width : this.viewWidth+"px" ,
			height : this.viewHeight+"px" ,
			className : "viewport",
			backgroundColor : "transparent"
		});
	
	},

	initCanvas : function(){
	
		this.canvas=document.createElement("canvas");

		var domStyle=this.canvas.style;
		scope.merger(domStyle,{
			position : "absolute" ,
			left : "0px",
			top : "0px",
			zIndex : 11
		});

		this.canvas.width=this.viewWidth;
		this.canvas.height=this.viewHeight;
		this.context=this.canvas.getContext('2d');
		this.viewport.appendChild(this.canvas);

	},

	ready : function(){
		
		this.pos=this.container.getBoundingClientRect();
		
		this.initViewport();
		this.initCanvas();
		this.initUI();
		this.initEvent();

		this.onReady();
	},
	initUI : scope.noop ,
	initEvent : scope.noop ,
	onReady : scope.noop,

	activeScene : function(index){
		this.sceneIndex=index;
		this.currentScene=this.scenes[index];
		this.currentScene.init(this);
	},	
	initScene : function(index){
		var scene=this.getSceneInstance(index);
		scene.index=index;
		this.scenes[index]=scene;
		return scene;
	},
	getSceneInstance : scope.noop ,	

	start : function(index){
		if (this.currentScene && this.currentScene.destroy){
			this.currentScene.destroy(this);
		}

		index=index||0;
		this.initScene(index);
		this.activeScene(index);		

		if (!this.currentScene){
			return false;
		}
		if (this.currentScene.beforeRun){
			this.currentScene.beforeRun(this);
		}	
		this.state=Game.PLAYING;		
		this.timer.start();
		this.run();
	},

	restart : function(){	
		this.stop();
		this.start(this.sceneIndex);		
	},
	
	run : function(){
		if (this.state==Game.PLAYING) {
			this.frameCount++;

			this.mainLoop=setTimeout( this.callRun, this.sleep );
			this.timer.tick();
			var timeStep=this.timer.timeStep;
			if (this.paused){
				this.onPausing(timeStep);
			}else if ( timeStep>0 ){
				this.beforeLoop(timeStep);
				this.timer.runTasks();
				this.update(timeStep);
				this.render(timeStep);
				this.afterLoop(timeStep);
			}
			this.handleInput(timeStep);

			this.timer.last=this.timer.now;

		}else if (this.state==Game.STOP) {
			this.stop();
		}else{
			this[this.state]&&this[this.state]();
		}

	},
	onPausing : scope.noop,

	update : function(timeStep){
		if (this.currentScene.handleInput){
			this.currentScene.handleInput(timeStep);
		}
		this.currentScene.update(timeStep);
	},
	clear : function(){
		this.context.clearRect(0,0,this.viewWidth,this.viewHeight);
	},
	render : function(timeStep){
		this.clear(timeStep);
		this.currentScene.render(this.context,timeStep);
	},
	handleInput :  scope.noop,
	beforeLoop : scope.noop,
	afterLoop : scope.noop,
	
	pause : function(){
		this.paused=1;
		this.onPause();
	},
	onPause : scope.noop,
	resume : function(){
		this.paused=0;
		this.onResume();
	},
	onResume : scope.noop,
	exit : scope.noop,

	stop : function(){
		this.state=Game.STOP;
		this.paused=0;
		if (this.mainLoop){
			clearTimeout(this.mainLoop);
		}
		if (this.currentScene){
			if (this.currentScene.destroy){
				this.currentScene.destroy(this);
			}
			this.scenes[this.sceneIndex]=null;
			this.currentScene=null;
		}		
		this.onStop();
	},
	onStop : scope.noop ,

	showUI : function(id,cb){
		var ui=scope.$id(id);
		ui.showing=true;
		ui.hidding=false;

		this.container.appendChild(ui);
		setTimeout(function(){
			if (ui.showing){
				ui.style.opacity=1;
				ui.style.zIndex=this.uiZIndex++;			
			}
		},1);
		if (cb){
			setTimeout(function(){
				if (ui.showing){
					cb();
				}
			},this.uiFadeTime);
		}
	},
	hideUI : function(id,cb){
		var ui=scope.$id(id);
		ui.style.opacity=0;
		ui.hidding=true;
		ui.showing=false;

		var Me=this;
		setTimeout(function(){
			if (ui.hidding){
				Me.uiPool.appendChild(ui);
				if (cb){
					cb();
				}			
			}		
		},this.uiFadeTime);
	},
	switchUI : function(fromUI,toUI){
		this.hideUI(fromUI);
		this.showUI(toUI);
	},

	destroy : scope.noop
	
};

Game.PLAYING="playing";
Game.STOP="stop";


})(this);
