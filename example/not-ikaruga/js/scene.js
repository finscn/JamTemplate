
function createScene(index){
	
	var scene={

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
					this.cleanInputState();
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

			cleanInputState : function(){
				KeyState[Key.W]
					=KeyState[Key.S]
					=KeyState[Key.A]
					=KeyState[Key.D]=false;
			},
			lockingChangeColor : false ,
			handleInput : function(game){
				var up=KeyState[Key.W];
				var down=KeyState[Key.S];
				var left=KeyState[Key.A];
				var right=KeyState[Key.D];
				var changeColor=KeyState[Key.SPACE];

				var dirY=0,dirX=0;
				if (up && !down){
					dirY=-1;
				}else if (down && !up){
					dirY=1;	
				}else{
					dirY=0;	
				}			

				if (left && !right){
					dirX=-1;
				}else if (right && !left){
					dirX=1;
				}else{
					dirX=0;	
				}
				if (changeColor){
					if (!this.lockingChangeColor){
						this.player.color=this.player.color*-1;
						this.lockingChangeColor=true;
					}
				}else{
					this.lockingChangeColor=false;
				}
				this.player.speedX=dirX*this.player.defaultSpeed;
				this.player.speedY=dirY*this.player.defaultSpeed;
			}
		}

	return scene;
}

