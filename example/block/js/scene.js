
function createScene(index){
	
	var scene= new Scene({
		/* todo */
	});

	return scene;
}

function Scene(cfg){
	merger(this,cfg);
}

Scene.prototype={
	
	init: function(game) {
		this.game=game;
		
		this.blocks=createBlocks(this);

		this.player=createPlayer(this);
		this.player.init(this);
						
	},

	update: function(timeStep) {
		var player=this.player;
		player.update(timeStep);
		var delta;
		var aabb=player.aabb,
			dx=player.deltaX,
			dy=player.deltaY;
		this.blocks.forEach(function(block,idx){
			if (block.moveable){
				delta=moveRect(aabb, dx, dy, block.aabb);
				if (delta){
					block.x+=delta[0];
					block.y+=delta[1];
					block.updateAABB();
				}
			}else{
				delta=blockByRect(aabb, dx, dy, block.aabb);
				if (delta){
					player.deltaX=delta[0];
					player.deltaY=delta[1];
				}
			}
		});
		player.updatePosition();
		
	},

	render: function(context, timeStep) {
		this.blocks.forEach(function(block){
			block.render(context,timeStep)
		});
		this.player.render(context,timeStep);
	},

	handleInput : function(game){
		this.player.handleInput(game);
	}
};



