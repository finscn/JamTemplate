	
function createBlocks(scene){
	var datas=[
		[100,350,450,70],
		[350,200,90,150],
		[250,150,400,50],
	];
	var blocks=[];

	datas.forEach(function(data,idx){
		var block=new Block({
			moveable : idx==1,
			x : data[0],
			y : data[1],
			width : data[2],
			height : data[3]
		});
		block.init(scene);
		blocks.push(block);	
	})

	return blocks;
}

function Block(cfg){
	merger(this,cfg);
}

Block.prototype={
	deltaX : 0,
	deltaY : 0,
	init : function(){
		this.aabb=[];
		this.updateAABB();
	},

	updateAABB : function(){
		this.aabb[0] = this.x;
		this.aabb[1] = this.y;
		this.aabb[2] = this.x+this.width;
		this.aabb[3] = this.y+this.height;
	},
	render : function(context){
		if (this.moveable){
			context.strokeStyle="#0000ee";
		}else{
			context.strokeStyle="#000";
		}
		context.strokeRect(this.x,this.y,this.width,this.height);

	}
};


