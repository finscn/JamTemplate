
;(function(scope, undefined){

	var EntityTemplate=scope.EntityTemplate={};

	scope.merger( EntityTemplate ,{


		movable : function(obj){
			obj=obj||{};
			var base= {

				x : 0,
				y : 0 ,

				velX : 0,
				velY : 0,
				accX : 0,
				accY : 0,

				minX : 0,
				minY : 0,

				maxX : Infinity,
				maxY : Infinity,

				minVelX : -Infinity,
				minVelY : -Infinity,

				maxVelX : Infinity,
				maxVelY : Infinity,

				defaultVelX : 0,
				defaultVelY : 0,
				
				computeVel : function(time,height,distance){
					var vx=distance/time;
					time=time/2;
					var vy=-2*height/time
					var accY= -vy/time;

					this.defaultVelX=vx;
					this.defaultVelY=vy;
					this.accY=accY;
				},

				updateMovement : function(timeStep){

					this.lastVelX=this.velX;
					this.lastVelY=this.velY;
					
					var newVelX=this.velX+this.accX * timeStep;		
					var newVelY=this.velY+this.accY * timeStep;	

					newVelX=Math.min(this.maxVelX, Math.max(this.minVelX,newVelX) );	
					newVelY=Math.min(this.maxVelY, Math.max(this.minVelY,newVelY) );	
					
					var dx=(this.velX + newVelX)/2 * timeStep;
					var dy=(this.velY + newVelY)/2 * timeStep;
	
					this.velX=newVelX;
					this.velY=newVelY;

					this.deltaX=dx;
					this.deltaY=dy;

				},

				updatePosition : function(){
					this.x=Math.max(this.minX,Math.min(this.x + this.deltaX,this.maxX));
					this.y=Math.max(this.minY,Math.min(this.y + this.deltaY,this.maxY));
				}
				
			};
			scope.merger(obj, base, false);

			return obj;
		}
	});

}(this));




