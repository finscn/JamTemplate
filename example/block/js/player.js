function createPlayer(scene){
	var player=new Player({
			x : 100,
			y : 100,
			width : 20,
			height : 30,
			defaultVelX : 0.3,
			defaultVelY : 0.3,
		});
	return player ;
}

function Player(cfg){
	EntityTemplate.movable(this);
	EntityTemplate.collidable(this);
	merger(this,cfg);
}

Player.prototype={

	init : function(scene){
		this.maxX=scene.game.viewWidth-this.width;
		this.maxY=scene.game.viewHeight-this.height;

		this.aabb=[];
	},

	update : function(timeStep){
		this.updateAABB();
		this.updateMovement(timeStep);
	},

	updateAABB : function(){
		this.aabb[0] = this.x;
		this.aabb[1] = this.y;
		this.aabb[2] = this.x+this.width;
		this.aabb[3] = this.y+this.height;
	},

	render : function(context, timeStep){
		context.fillRect(this.x,this.y,this.width,this.height);
	},

	handleInput : function(game){

		var up=KeyState[Key.W];
		var down=KeyState[Key.S];
		var left=KeyState[Key.A];
		var right=KeyState[Key.D];

		var dirY=0,dirX=0;

		if (left && !right){
			dirX=-1;
		}else if (right && !left){
			dirX=1;
		}

		if (up && !down){
			dirY=-1;
		}else if (down && !up){
			dirY=1;	
		}
		this.velX=dirX*this.defaultVelX;
		this.velY=dirY*this.defaultVelY;
	}
}