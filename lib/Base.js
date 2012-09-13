

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
				if (once===false){
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
				"minimum-scale="+scale/(scalable?2:1), 
				"maximum-scale="+scale*(scalable?2:1),
				"initial-scale="+scale,
				"target-densitydpi=device-dpi"
			];
			meta.setAttribute("content", content.join(", "));
			document.head.appendChild(meta);
		},
		
		showWindowSize : function(){
			var bodyBounding=document.body.getBoundingClientRect();
			var size=[
				["inner",window.innerWidth, window.innerHeight],
				["screen",window.screen.width, window.screen.height],
				["avail",window.screen.availWidth, window.screen.availHeight],
				["client",document.body.clientWidth, document.body.clientHeight],
				["offset",document.body.offsetWidth, document.body.offsetHeight],
				["scroll",document.body.scrollWidth, document.body.scrollHeight],
				["Bounding",bodyBounding.width, bodyBounding.height]
			]
			console.log(size.join("--"))
			return size;
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
				p=scope.$id(p)||p;
				if (p!=null && p.appendChild){
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

		random : function(lower, higher) {
			return (higher - lower) * Math.random() + lower;
		},

		randomInt : function(lower, higher) {
			return ((higher - lower + 1) * Math.random() + lower)>>0;
		},

		arrayShuffle : function (arr){
			for (var i=arr.length-1; i>0; i--) {
				var rnd =(Math.random()*i)>>0;
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

		cleanKeyState : function(){
			for (var key in scope.KeyState){
				delete scope.KeyState[key];
			}
		},

		cloneSimple : function(obj){
			return JSON.parse(JSON.stringify(obj));
		},
		
		cloneDeep : function(obj){
			var target = {};
			for (var i in obj) {
				if (typeof(obj) === 'object') {
					target[i] = clone_deep(obj[i]);
				}else {
					target[i] = obj[i];
				}
			}
			return target;
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
		}

	});


(function() {
	var vendors = ['o', 'ms', 'moz', 'webkit', ];
	for(var i = vendors.length-1; i>=0 && !window.requestAnimationFrame; i--) {
		window.requestAnimationFrame = window[vendors[i]+'RequestAnimationFrame'];
		window.cancelAnimationFrame = window[vendors[i]+'CancelAnimationFrame']
								   || window[vendors[i]+'CancelRequestAnimationFrame'];
	}

 scope.supportRequestAnimationFrame=!!window.requestAnimationFrame;

	if (!scope.supportRequestAnimationFrame){
		 window.requestAnimationFrame = function(callback, element) {
				return window.setTimeout(callback ,16 );
			};
	}
 
	if (!window.cancelAnimationFrame){
		window.cancelAnimationFrame = window.clearTimeout
	}

}());


}(this));




