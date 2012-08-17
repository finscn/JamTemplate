
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
		
		this.rects=createRects(this);
						
	},

	update: function(timeStep) {
		this.rects.forEach(function(rect){
			rect.update(timeStep);
		});
		checkEntitiesCollide(this.rects,50, Math.ceil(this.game.viewWidth/50) );
	},

	render: function(context, timeStep) {
		this.rects.forEach(function(rect){
			rect.render(context,timeStep)
		});
	}
};



