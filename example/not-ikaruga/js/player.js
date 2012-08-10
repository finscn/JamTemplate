function createPlayer(scene){
	var player={

		radius : 15,
		defaultSpeed : 0.3,
		color : [-1,1][ getRandom(0,1)] ,
		
		init : function(scene){
			this.radiusSq=this.radius*this.radius;
			this.maxX=scene.game.viewWidth;
			this.maxY=scene.game.viewHeight;
			this.x=(this.minX+this.maxX)/2;
			this.y=(this.minY+this.maxY)/2;
		},

		update : function(timeStep){
			this.gametime+=timeStep;
			this.updateMovment(timeStep);
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
		}
	};
	EntityTemplate.movable(player);
	return player ;
}
