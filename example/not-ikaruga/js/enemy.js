	
function createEnemies(scene){
	var enemyCount=60;
	var enemies=[];
	for (var i=0;i<enemyCount;i++){
		var enemy=new Enemy({
			radius : 8,			
			color : [-1,1][i%2] 
		});
		enemy.init(scene);
		if (i%2){
			enemy.x=[enemy.minX,enemy.maxX][randomInt(0,1)];
			enemy.y=randomInt(enemy.minY,enemy.maxY);
		}else{
			enemy.x=randomInt(enemy.minX,enemy.maxX);
			enemy.y=[enemy.minY,enemy.maxY][randomInt(0,1)];
		}
		enemies.push(enemy);
	}
	return enemies;
}


function Enemy(cfg){
	EntityTemplate.movable(this);
	merger(this, cfg);
}

Enemy.prototype={
	
	init : function(scene){
		this.resetDefaultVel();
		this.radiusSq=this.radius*this.radius;
		var offset=this.radius*2+5;
		this.minX=-offset;
		this.minY=-offset;
		this.maxX=scene.game.viewWidth+offset;
		this.maxY=scene.game.viewHeight+offset;
		this.velX=this.defaultVelX;
		this.velY=this.defaultVelY;
	},

	resetDefaultVel : function(){
		this.defaultVelX = randomInt(3,9)/100;
		this.defaultVelY = randomInt(3,9)/100;
	},

	update : function(timeStep){
		this.updateMovement(timeStep);
		this.updatePosition(timeStep);
		
		var change=false;
		if (this.x==this.minX){
			this.velX=this.defaultVelX;
			change=true;
		}else if (this.x==this.maxX){
			this.velX=-this.defaultVelX;
			change=true;
		}
		if (this.y==this.minY){
			this.velY=this.defaultVelY;
			change=true;
		}else if (this.y==this.maxY){
			this.velY=-this.defaultVelY;
			change=true;
		}
		if (change){
			this.color=[-1,1][randomInt(0,1)];
			this.resetDefaultVel();
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
};