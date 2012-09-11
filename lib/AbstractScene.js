;(function(scope, undefined) {

	scope.AbstractScene = {

		init: function(game) {
			throw new Error(" ** MUST ** Implement me. ");
		},

		update: function(timeStep) {
			throw new Error(" ** MUST ** Implement me. ");
		},

		render: function(context, timeStep) {
			throw new Error(" ** MUST ** Implement me. ");
		},


		handleInput: function(game) {
			throw new Error(" Implement or Remove me. ");
		},

		beforeRun: function(game) {
			throw new Error(" Implement or Remove me. ");
		},

		destroy: function(game) {
			throw new Error(" Implement or Remove me. ");
		}

	}

}(this));

