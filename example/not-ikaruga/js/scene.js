
function createScene(index){
	
	var scene=new Scene({});

	return scene;
}


function Scene(cfg){
	merger(this, cfg);
}
Scene.prototype={

	init: function(game) {
		this.game=game;
		this.player=createPlayer(this);
		this.player.init(this);
		this.enemies=createEnemies(this)||[];				
	},
	beforeRun : function(){
		this.game.hideUI("game-over");
		this.game.hideUI("main-menu");
		this.game.context.lineWidth=3;
		this.game.context.strokeStyle="black";
		this.game.context.font="bolder 24px Arial";

		this.player.gametime=0;
	},
	update: function(timeStep) {
		var player=this.player;
		if (player.dead){
			cleanKeyState();
			this.paused=true;
			this.game.showUI("game-over");
			$id("scroe").innerHTML=(player.gametime/1000).toFixed(2);
			return;
		}
		player.update(timeStep);
		this.enemies.forEach(function(enemy){
			enemy.update(timeStep);
			player.collide(enemy);
		});
	},

	render: function(context, timeStep) {

		this.enemies.forEach(function(enemy){
			enemy.render(context,timeStep);
		});
		this.player.render(context,timeStep);

		var time=(this.player.gametime/1000).toFixed(2);
		context.fillStyle="black";
		context.fillText("Score: "+time,10,25);
	},


	handleInput : function(game){
		this.player.handleInput(game);
	}
};

