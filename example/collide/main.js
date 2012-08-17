
var game=new Game({
	container : "container",
	width : 768,
	height : 480,
	uiPool : "ui-pool",
	resources : [
	],
	initEvent : function(){
		recordKeyState(null,function(event){
			if (event.keyCode==Key.R){
				game.restart();
			}
		});
	},
	onReady : function(){
		// this.showUI("main-menu");
		this.play();
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
	}

});


window.onload=function(){

	game.init();
	game.load();
}


