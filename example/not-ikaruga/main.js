
var game=new Game({
	container : "container",
	width : 800,
	height : 480,
	uiPool : "ui-pool",
	initEvent : function(){
		window.addEventListener("keydown", function(event) {
			KeyState[event.keyCode] = true;
		}, true);

		window.addEventListener("keyup", function(event) {
			if (event.keyCode==Key.R){
				game.restart();
				return;
			}
			KeyState[event.keyCode] = false;
		}, true);
	},
	onReady : function(){
		this.showUI("main-menu");
	},
	exit : function(){
		window.location.reload();
	},
	play : function(){
		this.start();		
	},
	getSceneInstance : function(index){
		var scene=createScene(index);
		return scene;
	},
	clear : function(){
		this.context.fillStyle="rgba(255,255,255,0.4)";
		this.context.fillRect(0,0,this.viewWidth,this.viewHeight);
	}

});


window.onload=function(){

	game.init();
	game.load();
}


