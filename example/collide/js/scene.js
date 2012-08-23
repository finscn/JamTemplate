
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
		
		this.polys=createPolys(this);
						
	},

	update: function(timeStep) {
		this.polys.forEach(function(poly){
			poly.update(timeStep);
		});
		checkEntitiesCollide(this.polys,64, 20 );
	},

	render: function(context, timeStep) {
		this.polys.forEach(function(poly){
			poly.render(context,timeStep)
		});
	}
};



