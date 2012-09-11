	
function createPolys(scene){
	var polyCount=20;
	var polys=[];

	for (var i=0;i<polyCount;i++){
		var vertexes=randomPoly(0,0,30,50,3,9);
		var poly=new Poly({
			id : "p_"+i,
			vertexes : vertexes,
			defaultVelX : randomInt(2,5)/100 ,
			defaultVelY : randomInt(2,5)/100 
		});
		poly.init(scene);
		var x,y;
		if (i%2){
			x=[poly.minX,poly.maxX][randomInt(0,1)];
			y=randomInt(poly.minY,poly.maxY);
		}else{
			x=randomInt(poly.minX,poly.maxX);
			y=[poly.minY,poly.maxY][randomInt(0,1)];
		}
		poly.x=x;
		poly.y=y;
		poly.translate(x,y);
		polys.push(poly);
	}
	return polys;
}


function randomPoly(x,y,minR,maxR,minSide,maxSide){
	minR=minR||10;
	maxR=maxR||30;
	minSide=minSide||3, maxSide=maxSide||9;
	var scaleX= randomInt(10,20)/10;
	var scaleY= randomInt(10,20)/10;

	var radius= randomInt(minR,maxR);
	var n= randomInt(minSide,maxSide);
	var vertexes=[];
	var perAng=Math.PI*2/n;
	for (var i=0;i<n;i++ ){
		var ang=perAng*i;
		var _x= x+radius*Math.cos(ang)*scaleX;
		var _y= y+radius*Math.sin(ang)*scaleY;
		vertexes.push( [_x,_y]);
	}
	
	return vertexes;	
}



function Poly(cfg){
	EntityTemplate.movable(this);
	EntityTemplate.collidable(this);
	merger(this,cfg);
}

Poly.prototype={
	collideable : true ,
	vertexes : null,
	aabb : null,
	init : function(scene){
		this.vertexeCount=this.vertexes.length;
		this.aabb=calPolyAABB(this.vertexes);
		this.width=this.aabb[2]-this.aabb[0];
		this.height=this.aabb[3]-this.aabb[1];
		this.cx=0-this.aabb[0];
		this.cy=0-this.aabb[1];

		this.minX=0;
		this.minY=0;
		this.maxX=scene.game.viewWidth;
		this.maxY=scene.game.viewHeight;
		this.velX=this.defaultVelX;
		this.velY=this.defaultVelY;

		this.initHitBox();

	},
	initHitBox : function(){
		this.hitBox=[];
		this.hitBox[0]=this.aabb[0]
		this.hitBox[1]=this.aabb[1]
		this.hitBox[2]=this.aabb[2]
		this.hitBox[3]=this.aabb[3]
	},
	translate : function(x,y){
		for (var i=0;i<this.vertexeCount;i++){
			var v=this.vertexes[i];
			v[0]+=x;
			v[1]+=y;
		}
		
	},


	isCollidedWith : function(otherPoly){
		// var a=checkAABBCollide(this.getHitBox(),otherPoly.getHitBox());
		var a=checkPolyCollide(this.vertexes,otherPoly.vertexes);
		return a;
	},
	onCollided : function(otherPoly){
		this.color="rgba(255,180,180,0.6)";
		otherPoly.color=this.color;
	},
	update : function(timeStep){
		this.updateMovement(timeStep);
		this.updatePosition(timeStep);
		this.translate(this.deltaX,this.deltaY);

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
		this.updateHitBox();
	},
	render : function(context){
		var vertexes=this.vertexes;
		
		context.beginPath();			
		context.moveTo( (vertexes[0][0]) , 
						(vertexes[0][1]) );
		for (var i=0,len=vertexes.length;i<len;i++){
			var idx=(i+1)%len;	      		
			context.lineTo( Math.round(vertexes[idx][0]) , 
							Math.round(vertexes[idx][1]) );
		}
		context.closePath();
		
		context.fillStyle=this.color;
		context.fill();
		context.stroke();

		// context.fillRect(this.aabb[0],this.aabb[1],this.width,this.height);
		// context.strokeRect(this.aabb[0],this.aabb[1],this.width,this.height);
		

	}
};


