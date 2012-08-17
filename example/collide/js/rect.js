	
function createRects(scene){
	var rectCount=30;
	var rects=[];
	for (var i=0;i<rectCount;i++){
		var rect=new Rect({
			width : getRandom(45,65),
			height : getRandom(45,65)
		});
		rect.init(scene);
		if (i%2){
			rect.x=[rect.minX,rect.maxX][getRandom(0,1)];
			rect.y=getRandom(rect.minY,rect.maxY);
		}else{
			rect.x=getRandom(rect.minX,rect.maxX);
			rect.y=[rect.minY,rect.maxY][getRandom(0,1)];
		}
		rects.push(rect);
	}
	return rects;
}

function Rect(cfg){
	EntityTemplate.movable(this);
	merger(this,cfg);
}

Rect.prototype={
	collideable : true ,
	init : function(scene){
		this.aabb=[];
		this.defaultVelX = getRandom(2,4)/100;
		this.defaultVelY = getRandom(2,4)/100;
		var s=Math.max(this.width,this.height);
		var offset=s/2+5;
		this.minX=-offset;
		this.minY=-offset;
		this.maxX=scene.game.viewWidth-offset;
		this.maxY=scene.game.viewHeight-offset;
		this.velX=this.defaultVelX;
		this.velY=this.defaultVelY;
	},

	updateAABB : function(){
		this.aabb[0] = this.x;
		this.aabb[1] = this.y;
		this.aabb[2] = this.x+this.width;
		this.aabb[3] = this.y+this.height;
	},
	getAABB : function(){
		return this.aabb;
	},
	isCollidedWith : function(otherRect){
		var a=checkAABBCollide(this.getAABB(),otherRect.getAABB());
		return a;
	},
	onCollided : function(otherRect){
		this.color="rgba(255,180,180,0.6)";
		otherRect.color=this.color;
	},
	update : function(timeStep){
		this.updateMovement(timeStep);
		this.updatePosition(timeStep);
		this.updateAABB();
		this.color="rgba(200,200,200,0.5)";

		if (this.x==this.minX){
			this.velX=this.defaultVelX;
		}else if (this.x==this.maxX){
			this.velX=-this.defaultVelX;
		}
		if (this.y==this.minY){
			this.velY=this.defaultVelY;
		}else if (this.y==this.maxY){
			this.velY=-this.defaultVelY;
		}
	},
	render : function(context){
		context.fillStyle=this.color;
		context.fillRect(this.x,this.y,this.width,this.height);
		context.strokeRect(this.x,this.y,this.width,this.height);
	}
};


