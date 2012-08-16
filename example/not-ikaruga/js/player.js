function createPlayer(scene){
	var player=new Player({
		radius : 15,
		defaultVel : 0.3,
		color : [-1,1][ getRandom(0,1)],
		lockingChangeColor : false 
	});

	return player ;
}

function Player(cfg){
	EntityTemplate.movable(this);
	merger(this,cfg);
}

Player.prototype={

	init : function(scene){
		this.radiusSq=this.radius*this.radius;
		this.maxX=scene.game.viewWidth;
		this.maxY=scene.game.viewHeight;
		this.x=(this.minX+this.maxX)/2;
		this.y=(this.minY+this.maxY)/2;
	},

	update : function(timeStep){
		this.gametime+=timeStep;
		this.updateMovement(timeStep);
		this.updatePosition();
		if (this.anim){
			this.anim.update(timeStep);
		}
	},

	collide : function(bullet){
		if (this.color==bullet.color){
			var dis=Math.pow(this.x-bullet.x,2)+Math.pow(this.y-bullet.y,2);
			var r=Math.pow(this.radius+bullet.radius,2);
			if (dis<r){
				this.dead=true;
				return true;
			}
		}
		return false;
	},

	render : function(context, timeStep){
		if (this.color==1){
			context.fillStyle="blue";
		}else{
			context.fillStyle="red";
		}
		context.beginPath();
		context.arc(this.x,this.y,this.radius,0, DOUBLE_PI);
		context.closePath();
		context.fill();
		context.stroke();
	},

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
				this.color=this.color*-1;
				this.lockingChangeColor=true;
			}
		}else{
			this.lockingChangeColor=false;
		}
		this.velX=dirX*this.defaultVel;
		this.velY=dirY*this.defaultVel;
	}
};