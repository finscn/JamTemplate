
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
		this.blocks.forEach(function(block){
			blockByRect(player.aabb, player, block.aabb);
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



