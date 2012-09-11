
function SceneGrid(cfg){
	merger(this,cfg);
}

SceneGrid.prototype={

	cellSizeE : 7 ,
	columsE : 11 ,
	fix : 0.00001,
	init : function(){
		this.grid={};
		this.entityCells={};
		this.cellSize=Math.pow(2,this.cellSizeE);
		this.colums=Math.pow(2,this.columsE);

		this._entityBox=[];
	},

	addEntity : function(entity,x1,y1,x2,y2){
		var id=entity.id;
		var entityCells=this.entityCells[id]=this.entityCells[id]||[];
		var col1= x1>>this.cellSizeE,
			row1= y1>>this.cellSizeE;
		var col2= (x2-this.fix)>>this.cellSizeE,
			row2= (y2-this.fix)>>this.cellSizeE;
		for (var r=row1;r<=row2;r++){
			var index=(r<<this.columsE)+col1;
			for (var c=col1;c<=col2;c++,index++){
				var cell=this.grid[index]=this.grid[index]||{};
				cell[id]=entity;
				entityCells.push(index);
			}
		}
	},

	getEntityCells : function(id){
		return this.entityCells[id];
	},

	removeEntity : function(id){
		var entityCells=this.entityCells[id];
		for(var i=entityCells.length-1;i>=0;i--){
			var index=entityCells[i];
			delete this.grid[index][id];
		}
		delete this.entityCells[id];
	},

	getEntities : function(col,row){
		return this.grid[ (row<<this.columsE)+col];
	},
	getEntitiesByRect : function(x1,y1, x2,y2){
		var entities={};
		var col1= x1>>this.cellSizeE,
			row1= y1>>this.cellSizeE;
		var col2= (x2-this.fix)>>this.cellSizeE,
			row2= (y2-this.fix)>>this.cellSizeE;
		for (var r=row1;r<=row2;r++){
			var index=(r<<this.columsE)+col1;
			for (var c=col1;c<=col2;c++,index++){
				var cell=this.grid[index];
				for (var id in cell){
					entities[id]=cell[id];
				}
			}
		}	
		return entities;
	},
	getEntitiesByPx : function(x,y){
		var col = x>>this.cellSizeE ,
			row = y>>this.cellSizeE ;
		return this.grid[ (row<<this.columsE)+col];
	},

	getCellPos : function(x,y){
		return [ x>>this.cellSizeE , y>>this.cellSizeE ];
	},

	checkBlock : function(entity, dx, dy){
		
		var collInfo=this.collInfo={
			x : false,
			y : false,
			count : 0,
			checkedX : {},
			checkedY : {}

		}
		var _entityBox=entity.getHitBox();
		var box=this._entityBox;
		box[0]=_entityBox[0];
		box[1]=_entityBox[1];
		box[2]=_entityBox[2];
		box[3]=_entityBox[3];

		if( dy!=0 ) {
			var d=this.checkBlockY(box, dx, dy, collInfo)	;
			if (d!=dy){
				dy=d;
				collInfo.y=true;
			}
			box[1]+=dy;
			box[3]+=dy;
		}
		collInfo.dy=dy;

		if( dx!=0 ) {
			var d=this.checkBlockX(box, dx, dy, collInfo);
			if (d!=dx){
				dx=d;
				collInfo.x=true;
			}
			// box[0]+=dx;
			// box[2]+=dx;
		}
		collInfo.dx=dx;


		// console.log(collInfo.count);
		
		return collInfo;
	},

	checkBlockX : function(entityBox, dx,dy, collInfo){
		var step=dx > 0?1:-1;
		var x1=step==1?entityBox[2]-this.fix:entityBox[0],
			x2=x1+dx;
		var y1=entityBox[1],
			y2=entityBox[3]-this.fix;

		var col1= x1>>this.cellSizeE,
			col2= x2>>this.cellSizeE,
			row1= y1>>this.cellSizeE,
			row2= y2>>this.cellSizeE;

		var checked=collInfo.checkedX;
		for (var r=row1;r<=row2;r++){
			var index=(r<<this.columsE)+col1;
			for (var c=col1;c!=col2+step;c+=step,index+=step){
				var cell=this.grid[index];
				for (var id in cell){
					if (!checked[id]){
						var block=cell[id];
						checked[id]=block;
						var blockBox=block.getHitBox();
						if (checkWillCollide(entityBox,dx,0,blockBox)){
							dx=checkBlockX( entityBox, dx, blockBox );
						}

					}
				}
			}
		}	
		return dx;

	},
	checkBlockY : function(entityBox, dx,dy, collInfo){
		var step=dy > 0?1:-1;
		var x1=entityBox[0],
			x2=entityBox[2]-this.fix;
		var y1=step==1?entityBox[3]-this.fix:entityBox[1],
			y2=y1+dy;

		var col1= x1>>this.cellSizeE,
			col2= x2>>this.cellSizeE,
			row1= y1>>this.cellSizeE,
			row2= y2>>this.cellSizeE;


		var checked=collInfo.checkedY;
		for (var r=row1;r!=row2+step;r+=step){
			var index=(r<<this.columsE)+col1;
			for (var c=col1;c<=col2;c++,index++){
				var cell=this.grid[index];
				for (var id in cell){
					if (!checked[id]){
						var block=cell[id];
						checked[id]=block;
						var blockBox=block.getHitBox();
						if (checkWillCollide(entityBox,0,dy,blockBox)){
							dy=checkBlockY( entityBox, dy, blockBox );
							// console.log(111,dy)
						}else{
							// console.log(entityBox[3],dy,blockBox[1])
							// console.log(222,dy)
						}
					}
				}
			}
		}	
		return dy;

	}


}