

// Part 1
;(function(scope, undefined){

	var noop=scope.noop=function(){};

	var merger=scope.merger=function(receiver, supplier, override) {
		for (var key in supplier) {
			if (override !== false || !(key in receiver)) {
				receiver[key] =supplier[key];
			}
		}
		return receiver;
	}

	var fragment =document.createDocumentFragment();
	var div =document.createElement("div");
	fragment.appendChild(div);
	scope.getFragmentDom=function(){
		return div;
	};

	scope.css={};
	scope.detectCssAttribute=function(attrList,style){
			style=style||scope.getFragmentDom().style;
			var normalName=attrList[0];
			for(var i=0;i<attrList.length;i++){
				if (attrList[i] in style){
					scope.css[normalName]=attrList[i];
					break ;
				}
			}	
		};
	var css4Detect=[
		["transform", "webkitTransform", "MozTransform", "msTransform", "OTransform", "msTransform"],
		["transformOrigin", "webkitTransformOrigin", "MozTransformOrigin", "msTransformOrigin", "OTransformOrigin", "msTransformOrigin"],
		["perspective", "webkitPerspective", "MozPerspective", "msPerspective", "OPerspective","msPerspective"]
	];
	var style=scope.getFragmentDom().style;
	css4Detect.forEach(function(item,idx){
			scope.detectCssAttribute(item, style);
		});
	scope.supportTransform=!!scope.css.transform ;
	scope.supportTransform3D=!!scope.css.perspective ;


	window.devicePixelRatio=window.devicePixelRatio||1;

	scope.merger( scope ,{

		$id : function(id){
			return document.getElementById(id);
		},

		$q : function(q){
			return document.querySelector(q);
		},
		$qs : function(q){
			return document.querySelectorAll(q);
		},
		hideAddressBar : function(once){ 
			setTimeout(function(){ 
				window.scrollTo(0, 1);
				if (!once){
					scope.hideAddressBar(once);
				}
			}, 1);			
		},

		setViewportScale : function(scale,scalable){
			scale=scale||1; // ?  1/window.devicePixelRatio ;

			var meta=document.createElement("meta");
			meta.setAttribute("name","viewport");
			var content=[
				"width=device-width", 
				"height=device-height",
				"user-scalable="+(scalable?"yes":"no"),
				"minimum-scale="+scale, 
				"maximum-scale="+scale,
				"initial-scale="+scale
			];
			meta.setAttribute("content", content.join(", "));
			document.head.appendChild(meta);
		},

		createDom : function (tag , property){
			var dom=document.createElement(tag);
			if (property!=null){
				scope.setDomProperty(dom, property);
			}
			return dom;	
		},

		setDomProperty : function(dom,property){
			var p=property.parent;
			delete property.parent;
			var domStyle=dom.style;
			for ( var key in property) {
				if (key== "style"){
					scope.merger(domStyle, property[key]);
				}else{
					dom[key] =property[key];
				}
			}
			if (p) {
				p=scope.$id(p);
				if (p!=null){
					p.appendChild(dom);
				}
			};

		},

		setDomStyle : function(dom,style){
			scope.setDomProperty(dom, { style : style });
		},
		
		translateDom : (function(){
				if (scope.supportTransform3D){
					return function(dom,x,y){
							dom.style[scope.css.transform]="translate3d("+ x+"px,"+y+"px,0px)";
						};
				}
				if (scope.supportTransform){
					return function(dom,x,y){
							dom.style[scope.css.transform]="translate("+ x+"px,"+y+"px)";
						};
				}
				return function(dom,x,y){
						dom.style.left=x+"px";
						dom.style.top=y+"px";
					};
				
			})(),

		removeDom : function(dom) {
			if (dom.parentNode!=null){
				dom.parentNode.removeChild(dom);
			}else {
				var fragmentChild=scope.getFragmentDom();
				fragmentChild.appendChild(dom);
				fragmentChild.innerHTML="";
			}
		},

		isDom : function(obj){
			HTMLElement=HTMLElement||null;
			if (HTMLElement!=null){
				return obj instanceof HTMLElement	;
			}
			return obj &&  ("tagName" in obj) && ("parentNode" in obj);
		},

		resetAudio : function(audio){
			audio.currentTime=0;
		},
		getBrowserInfo : function(){

			var ua=window.navigator.userAgent.toLowerCase();
			var match =
					/(safari)[ \/]([\w.]+)/.exec( ua ) ||
					/(chrome)[ \/]([\w.]+)/.exec( ua ) ||
					/(webkit)[ \/]([\w.]+)/.exec( ua ) ||
					/(opera)(?:.*version)?[ \/]([\w.]+)/.exec( ua ) ||
					/(msie) ([\w.]+)/.exec( ua ) ||
					!/compatible/.test( ua ) && /(mozilla)(?:.*? rv:([\w.]+))?/.exec( ua ) || [];		
			
			var browser={};

			browser[ match[1] ]=true;
			
			browser.mobile=ua.indexOf("mobile")>0 || "ontouchstart" in document; 

			browser.retain=window.devicePixelRatio>1.5;

			browser.iPhone=/iphone/.test(ua);
			browser.iPad=/ipad/.test(ua);
			
			browser.iOS4=browser.iOS && ua.indexOf("os 4")>0;
			browser.iOS5=browser.iOS && ua.indexOf("os 5")>0;
			browser.iOS6=browser.iOS && ua.indexOf("os 6")>0;

			browser.viewport={
				width:window.innerWidth,
				height:window.innerHeight
			};
			browser.screen={
				width:window.screen.availWidth*window.devicePixelRatio, 
				height:window.screen.availHeight*window.devicePixelRatio
			};
				
			return browser;
		},

		showFPS : function(logger) {

			if (logger == null) {
				return;
			}
			logger.frameCount =0;

			var div =scope.$id("fpsBar");
			if (div == null) {
				var style ={
					backgroundColor: "rgba(0,0,0,0.5)",
					position: "absolute",
					left: "1px",
					top: "1px",
					color: "#fff",
					width: "100px",
					height: "30px",
					border: "solid 1px #ccc",
					fontSize: "22px",
					zIndex: 99999
				}
				div =scope.createDom("div",{
					parent : document.body ,
					style : style
				});

			}
			div.innerHTML="Waiting...";
			function _core() {
				div.innerHTML ="FPS:" + logger.frameCount;
				logger.frameCount =0;
			}
			setInterval(_core,  1000);
		}



	});

	scope.browser=scope.getBrowserInfo();

}(this));


// Part 2
;(function(scope, undefined){

	scope.merger( scope ,{

		DEG_TO_RAD : Math.PI / 180,
		RAD_TO_DEG : 180 / Math.PI ,
		HALF_PI : Math.PI /2 ,
		DOUBLE_PI : Math.PI * 2 ,

		getRandom : function(lower, higher) {
			return Math.floor((higher - lower + 1) * Math.random()) + lower;
		},
		arrayShuffle : function (arr){
			for (var i=arr.length-1; i>0; i--) {
				var rnd =(Math.random()*(i))>>0;
				var temp=arr[i];
				arr[i] =arr[rnd];
				arr[rnd] =temp;
			}
			return arr;
		},

		arrayTo2d : function(array, cols){
				cols = cols||1;
				var array2d=[];
				var rows= Math.floor( (array.length+cols)/cols ) -1 ;
				var r=0,c=0,i=0;
				for ( r = 0; r < rows; r++) {
					array2d[r] = [];
					for ( c = 0; c < cols; c++) {
						array2d[r][c]=array[i++];
					}
				}
				return array2d;
		},

		cleanKetState : function(){
			for (var key in scope.KeyState){
				delete scope.KeyState[key];
			}
		},

		recordKeyState : function(onDown,onUp){
			window.addEventListener("keydown", function(event) {
				scope.KeyState[event.keyCode] = true;
				if (onDown){
					onDown(event);
				}
			}, true);

			window.addEventListener("keyup", function(event) {
				scope.KeyState[event.keyCode] = false;
				if (onUp){
					onUp(event);
				}
			}, true);
		},


		checkAABBCollide : function( aabb1, aabb2){

			return  aabb1[0]<=aabb2[2] && aabb1[1]<=aabb2[3] 
					&& aabb2[0]<=aabb1[2] && aabb2[1]<=aabb1[3] ;
		},

		checkEntitiesCollide : function(enties, gridCol, gridSize) {	
				// entity :  {
				// 		collideable : property , boolean
				// 		getAABB : function , array
				// 		isCollidedWith : function, boolean
				// 		onClooided : function , boolean
				// }
			var grid = {};
		    for( var e = 0; e < enties.length; e++ ) {
				var entiyA = enties[e];
				
				if (!entiyA.collideable){
					continue;
				}
				
				var aabb1=entiyA.getAABB();
				var	colMin = Math.floor( aabb1[0]/gridSize ) ,
					colMax = Math.floor( aabb1[1]/gridSize ) ,
					rowMin = Math.floor( aabb1[2]/gridSize ),
					rowMax = Math.floor( aabb1[3]/gridSize ) ;
				
				var checked = {};
				var startIdx=rowMin*gridCol+colMin;
				for( var row = rowMin; row <= rowMax; row++ ) {
					var idx=startIdx;
					for( var col = colMin; col <= colMax; col++ ) {
						var group=grid[idx];
						if( !group ) {
							grid[idx] = [entiyA];
						}else {
							for( var c = 0, len=group.length; c<len; c++ ) {
								var entiyB=group[c];
								var aabb2=entiyB.getAABB();

								if( !checked[entiyB.id] 
									// && scope.checkAABBCollide(aabb1,aabb2)
									&& entiyA.isCollidedWith(entiyB)
									 ) {
									entiyA.onCollided(entiyB);
									checked[entiyB.id] = true;
								}
							}
							group.push(entiyA);
						}
						idx++;
					}
					startIdx+=gridCol;
				}
			}
		},

		blockByRect : function( aabb, movement, rectAABB){

			var dx=movement.deltaX,
				dy=movement.deltaY;
				
			var x1,y1,x2,y2;
			if ( (x1=aabb[0]+dx)>rectAABB[2] 
				|| (y1=aabb[1]+dy)>rectAABB[3] 
				|| rectAABB[0]>(x2=aabb[2]+dx)
				|| rectAABB[1]>(y2=aabb[3]+dy) ){
				return movement;
			}

			if (aabb[2]<rectAABB[0] && x2>=rectAABB[0]){
				dx=rectAABB[0]-aabb[2]-1;

			}else if (aabb[0]>=rectAABB[2] && x1<rectAABB[2]){
				dx=rectAABB[2]-aabb[0]+1;

			}

			if (aabb[3]<rectAABB[1] && y2>=rectAABB[1]){
					dy=rectAABB[1]-aabb[3]-1;

			}else if (aabb[1]>rectAABB[3] && y1<=rectAABB[3]){
					dy=rectAABB[3]-aabb[1]+1;

			}

			movement.deltaX=dx;
			movement.deltaY=dy;

			return movement;
		}


	});

}(this));




