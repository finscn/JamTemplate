

;(function(scope,undefined){
	

var Camera=scope.Camera=function(cfg){
	scope.merger(this,cfg);
}


Camera.prototype={
	constructor : Camera,
	x : 0,
	y : 0,
	width : 0,
	height : 0,
	minX : -Infinity,
	minY : -Infinity,
	maxX : Infinity,
	maxY : Infinity,
	top : 0 ,
	right : 0 ,
	bottom : 0 ,
	left : 0 ,
	setPadding : function(top,right,bottom,left){
		this.top=top;
		this.right=right;
		this.bottom=bottom;
		this.left=left;
	},

	focus : function(entity){

		var x=this.x, y=this.y;

		var l = entity.x - x;
		var r = x + this.width - entity.x;
		var t = entity.y - y;
		var b = y + this.height - entity.y;

		if (l < this.left) {
			x = entity.x - this.left;
		} else if (r < this.right) {
			x = entity.x + this.right - this.width;
		}

		if (t < this.top) {
			y = entity.y - this.top;
		} else if (b < this.bottom) {
			y = entity.y + this.bottom - this.height;
		}

		this.setPos(x,y);
	
	},

	setPos : function(x,y){
		this.x=x<this.minX?this.minX:x>this.maxX?this.maxX:x;
		this.y=y<this.minY?this.minY:y>this.maxY?this.maxY:y;
		// this.x=Math.min( this.maxX ,Math.max( this.minX ,this.x ) );
		// this.y=Math.min( this.maxY ,Math.max( this.minY ,this.y ) );
	},
	
	limitX : function(x){
		return x<this.minX?this.minX:x>this.maxX?this.maxX:x;
	},
	limitY : function(y){
		return y<this.minY?this.minY:y>this.maxY?this.maxY:y;
	},
	getPos : function(){
		return [this.x, this.y];
	},
	moveTo : function(x,y,speed){
		var dx=x-this.x,
			dy=y-this.y;
		var rad=Math.atan2( dy , dx );
		var vx= speed * Math.cos(rad);
		var vy= speed * Math.sin(rad); 

		if (this.x<x){
			this.x+=vx;
			if (this.x>x){
				this.x=x;
			}
		}else if (this.x>x){
			this.x+=vx;
			if (this.x<x){
				this.x=x;
			}
		}
		if (this.y<y){
			this.y+=vy;
			if (this.y>y){
				this.y=y;
			}
		}else if (this.y>y){
			this.y+=vy;
			if (this.y<y){
				this.y=y;
			}
		} 
	},
	isAt : function(x,y){
		return this.x==x  &&  this.y==y;
	}

}



}(this));



