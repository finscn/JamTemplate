
;(function(scope,undefined){
	
	var Animation=scope.Animation=function(cfg){
		scope.merger(this,cfg);
		this.init();
	}

	Animation.prototype = {

		constructor: Animation,

		frames: null,
		frameCount: -1,
		currentFrame: null,
		currentFrameIndex: -1,
		currentFramePlayed: -1,

		startFrameIndex : 0,
		
		baseX: 0,
		baseY: 0,

		loop: true,
		paused: false,

		img : null ,
		x : 0,
		y : 0,
		width : 0,
		height : 0,

		init: function() {
			this.frames = this.getFramesConfig() || this.frames || [];
			this.frameCount = this.frames.length;
			if (this.frameCount>0){
				var Me=this;
				var d=Me.duration/this.frameCount;
				this.frames.forEach(function(frame){
					frame.img=frame.img||Me.img;
					frame.x=frame.x||0;
					frame.y=frame.y||0;
					frame.w=frame.w||Me.width||frame.img.width;
					frame.h=frame.h||Me.height||frame.img.height;
					frame.d=frame.d||frame.d==0?frame.d:d;
				});			
				this.setFrame(0);
			}
		},

		getFramesConfig: function() {

		},

		setFrame: function(index) {
			this.currentFrameIndex = index;
			this.currentFrame = this.frames[index];
			this.currentFramePlayed = 0;
		},

		update: function(timeStep) {
			if (this.paused) {
				return false;
			}
			var last=this.currentFrameIndex;
			if (this.currentFramePlayed >= this.currentFrame.d) {
				if (this.currentFrameIndex == this.frameCount - 1) {
					if (this.loop) {
						this.currentFrameIndex = this.startFrameIndex;
					}
					this.onEnd(timeStep);
				} else {
					this.currentFrameIndex++;
				}
				this.setFrame(this.currentFrameIndex);

			} else {
				this.currentFramePlayed += timeStep;
			}
			return last!=this.currentFrameIndex;
		},

		onEnd: function(timeStep) {

		},
		
		render : function(context, timeStep){
			var f=this.currentFrame;
			var img=f.img || this.img;
			context.drawImage(img, f.x, f.y, f.w, f.h,  this.x, this.y, f.w, f.h);
		}
	};


}(this));
