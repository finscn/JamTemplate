

;(function(scope,undefined){
	
	var ProcessQ=scope.ProcessQ=function(cfg){
		for (var key in cfg){
			this[key]=cfg[key]
		}
		var Me=this;
		this.callRun = function(){
			Me.run();
		};
		this.timer={};
	};
	ProcessQ.types={};

	ProcessQ.prototype={
		
		constructor : ProcessQ,

		interval : 20,

		ignorError : true ,
		defaultDelay : 0 ,

		defaultItemIsFinished : function (){
			return true;
		},

		init : function(){
			this.resultPool={};

			var items = this.items ||[];
			this.items=[];
			this.itemCount=0;
			this.totalWeight=0;

			for (var i=0,len=items.length;i<len;i++){
				var item=items[i];
				this.addItem(item);
			}

			if (this.onInit!=null){
				this.onInit();
			}
		},	
		onInit : null,


		addItem : function(item){
			if (!item.id){
				item.id="id_"+(this.items.length+1);
			}
			if (item.type){
				item=new ProcessQ.types[item.type](item);
			}
			item.delay=isNaN(item.delay)?this.defaultDelay:Number(item.delay);
			item.weight=isNaN(item.weight)||item.weight===0?1:Number(item.weight);
			item.isFinished=item.isFinished||this.defaultItemIsFinished;
			this.totalWeight+=item.weight;
			this.items.push(item);
			this.itemCount++;
		},

		start : function(){
			this.paused=false;
			this.itemIndex=0;
			this.finishedWeight=0;
			this.finishedCount=0;
			this.timerStart();
			this.activeItem(0);
			this.run();
		},

		timerStart : function(){
			var timer=this.timer;
			timer.current= Date.now();
			timer.start= timer.last= timer.current;
			timer.delta= 0;
			timer.duration= 0;
		},

		timerTick : function(){
			var timer=this.timer;
			timer.last = timer.current;
			timer.current=Date.now();
			timer.delta = timer.current - timer.last;
			timer.duration+=timer.delta;
		},

		run : function(){
			this.mainLoop=setTimeout( this.callRun, this.interval );
			this.timerTick();
			var timeStep=this.timer.delta;
			if (this.paused && this.onPausing!=null ){
				this.onPausing(timeStep);
				return;
			}
			if (!this.currentItem){
				this.finish();
				return;
			}
			this.update(timeStep);
		},

		finish : function(){
			clearTimeout(this.mainLoop);
			if (this.onFinish!=null){
				this.onFinish(this);
			}
		},
		onFinish : null,

		next : function(timeStep) {
			this.activeItem(++this.itemIndex);
		},

		getItem : function(index){
			return this.items[index];
		},

		activeItem : function(index) {
			this.itemIndex = index;
			this.currentItem=this.getItem(index);
			if (this.currentItem){
				this.currentItem._delay=this.currentItem.delay;
				if (this.currentItem._delay==0){
					this.currentItem.start(this);
					this.currentItem._started=true;
				}
			}
		},
		
		update : function(timeStep){
			if (timeStep<1){
				return;
			}
			if (this.currentItem._delay>=this.interval){
				this.currentItem._delay-=timeStep;
			}else if(!this.currentItem._started){
				this.currentItem.start(this);
				this.currentItem._started=true;
			}

			if ( this.currentItem._started ){
				
				if (this.currentItem.isFinished(this) ) {
					this.onItemFinish(this.currentItem);

					this.finishedWeight+=this.currentItem.weight;
					this.next(timeStep);


				}else if ( this.currentItem.isError 
						&& this.currentItem.isError(this) ) {
					
					this.onItemError(this.currentItem,this);

					if (this.ignorError){
						this.finishedWeight+=this.currentItem.weight;
						this.next(timeStep);
					}
				}
			}

			if (this.currentItem){
				if (this.currentItem.onProgressing){
					this.currentItem.onProgressing(timeStep,this);
				}
			}
			this.onProgressing(timeStep,this);
		},

		onItemFinish : function(item,queue){
			if (item.onFinish){
				item.onFinish(queue);
			}
			if (item.getResult){
				var rs=item.getResult();
				this.resultPool[item.id]=rs;
			}
			this.finishedCount++;
		},
		onItemError : function(item,queue){
			if (item.onError){
				item.onError(item.errorEvent, queue);
			}
			item.errorEvent=null;
		},

		onProgressing : function(timeStep,queue){

		}

	};


	var ImageLoader =function(cfg){
		for (var key in cfg){
			this[key]=cfg[key]
		}	
	}
	ProcessQ.types["img"]=ImageLoader;

	ImageLoader.prototype={
		async : false ,
		constructor : ImageLoader,
		id : null ,
		start : function(queue){
			var img=this.img=new Image();
			this.finished=this.async;
			var Me=this;
			function onload(event) {
				Me.finished=true;
				this.removeEventListener("load", onload);
			}
			function onerror(event) {
				Me.finished=false;
				Me.errorEvent=event;
				this.removeEventListener("error", onerror);
			}

			img.addEventListener("load", onload);
			img.addEventListener("error", onerror);
			img.src=this.src;
		},

		getResult : function(){
			return this.img;
		},

		onFinish : function(queue){

		},

		isFinished : function(queue){
			return this.finished;
		},

		isError : function(queue){
			return this.errorEvent;
		}

	}


	var AudioLoader =function(cfg){
		for (var key in cfg){
			this[key]=cfg[key]
		}
	};

	AudioLoader.formats={
		mp3 : 'audio/mpeg',
		ogg : 'audio/ogg; codecs=vorbis',
	};
	ProcessQ.types["audio"]=AudioLoader;


	(function(){

		var test = new Audio();
		for( var ext in AudioLoader.formats ) {
			if ( test.canPlayType(AudioLoader.formats[ext]) ) {
				AudioLoader.supportFormat = ext;
				break;
			}
		}
	}());

	AudioLoader.prototype={
		constructor : AudioLoader,
		id : null ,
		async : false ,
		start : function(queue){
			var audio=this.audio=new Audio();
			this.finished=this.async;
			var Me=this;
			function onload(event) {
				Me.finished=true;
				this.removeEventListener("canplaythrough", onload);
			}
			function onerror(event) {
				Me.finished=false;
				Me.errorEvent=event;
				this.removeEventListener("error", onerror);
			}

			audio.addEventListener("canplaythrough", onload);
			audio.addEventListener("error", onerror);

			//TODO : check has ext-filename
			audio.src = this.src+"."+AudioLoader.supportFormat;
			audio.preload = true;
			audio.autobuffer = true;
			audio.load();
		},

		getResult : function(){
			return this.audio;
		},

		isFinished : function(queue){
			return this.finished;
		},
		isError : function(queue){
			return this.errorEvent;
		}

	};


}(this));



