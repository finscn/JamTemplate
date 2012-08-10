
;(function(scope, undefined){

	var EntityTemplate=scope.EntityTemplate={};

	scope.merger( EntityTemplate ,{

		movable : function(obj){
			obj=obj||{};
			var base= {
				x : 0,
				y : 0 ,
				speedX : 0,
				speedY : 0,
				acceX : 0,
				acceY : 0,
				minX : 0,
				maxX : 0,
				minY : 0,
				maxY : 0,
				updateMovment : function(timeStep){

					this.lastX=this.x;
					this.lastY=this.y;
					this.lastSpeedX=this.speedX;
					this.lastSpeedY=this.speedY;

					var newSpeedX=this.speedX + this.acceX * timeStep;		
					var newSpeedY=this.speedY + this.acceY * timeStep;		
					
					var dx=(this.speedX + newSpeedX)/2 * timeStep;
					var dy=(this.speedY + newSpeedY)/2 * timeStep;

					var newX=Math.max(this.minX,Math.min(this.x + dx,this.maxX));
					var newY=Math.max(this.minY,Math.min(this.y+dy,this.maxY));
					
					this.speedY=newSpeedY;
					this.speedX=newSpeedX;
					this.x=newX;
					this.y=newY;
				}
			};
			scope.merger(obj, base, false);

			return obj;
		}
	});

}(this));




