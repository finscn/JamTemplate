	
function createEnemies(scene){
	var enemyCount=60;
	var enemies=[];
	for (var i=0;i<enemyCount;i++){
		var enemy={
			radius : 8,			
			color : [-1,1][i%2] ,
			init : function(scene){
				this.resetDefaultSpeed();
				this.radiusSq=this.radius*this.radius;
				var offset=this.radius*2+5;
				this.minX=-offset;
				this.minY=-offset;
				this.maxX=scene.game.viewWidth+offset;
				this.maxY=scene.game.viewHeight+offset;
				this.speedX=this.defaultSpeedX;
				this.speedY=this.defaultSpeedY;
				if (i%2){
					this.x=[this.minX,this.maxX][getRandom(0,1)];
					this.y=getRandom(this.minY,this.maxY);
				}else{
					this.x=getRandom(this.minX,this.maxX);
					this.y=[this.minY,this.maxY][getRandom(0,1)];
				}
			},
			resetDefaultSpeed : function(){
				this.defaultSpeedX = getRandom(3,9)/100;
				this.defaultSpeedY = getRandom(3,9)/100;
			},

			update : function(timeStep){
				this.updateMovment(timeStep);
				
				var change=false;
				if (this.x==this.minX){
					this.speedX=this.defaultSpeedX;
					change=true;
				}else if (this.x==this.maxX){
					this.speedX=-this.defaultSpeedX;
					change=true;
				}
				if (this.y==this.minY){
					this.speedY=this.defaultSpeedY;
					change=true;
				}else if (this.y==this.maxY){
					this.speedY=-this.defaultSpeedY;
					change=true;
				}
				if (change){
					this.color=[-1,1][getRandom(0,1)];
					this.resetDefaultSpeed();
				}
			},
			render : function(context, timeStep){
				if (this.color==1){
					context.fillStyle="blue"
				}else{
					context.fillStyle="red"
				}
				context.beginPath();
				context.arc(this.x,this.y,this.radius,0, DOUBLE_PI);
				context.closePath();
				context.fill();
				
			}
		}
		EntityTemplate.movable(enemy);
		enemy.init(scene);
		enemies.push(enemy);
	}
	return enemies;
}