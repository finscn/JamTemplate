
function DomSprite(cfg){
	merger(this, cfg);
}


DomSprite.prototype={
	
	constructor : DomSprite ,
	img : null,

	useTranslate : false ,
	useTransform3d : false ,
	parentDom : null ,
	zIndex : 10 ,

	originX : 0,
	originY : 0,

	domScale : null,
	domRotate : null,
	domMoveTo : null,

	rotation : 0,
	scaleX : 1,
	scaleY : 1,


	initDom : function(parent){
		this.parent=parent;
		this.dom=document.createElement("div");
		var style=this.dom.style;
		style.width=this.width+"px";
		style.height=this.height+"px";
		style.position="absolute";
		style.overflow="hidden";
		style.backgroundRepeat="no-repeat";
		style.zIndex=this.zIndex;
		style.left="0px";
		style.top="0px";	
		// for debug  
		style.border="1px solid red";

		this.parentDom.appendChild(this.dom);

		var d=this.useTransform3d;
		this.domScale=d?this._domScale3d:this._domScale2d;
		this.domRotate=d?this._domRotate3d:this._domRotate2d;
		if (this.useTranslate){
			this.domMoveTo=d?this._domMoveTo3d:this._domMoveTo2d;
		}else{
			this.domMoveTo=this._domMoveTo
		}
	},

	domShow : function(){
		this.dom.style.display="block";
	},
	domHide : function(){
		this.dom.style.display="none";
	},

	domTransform : function(offsetX, offsetY){

		if (this.domX===this.x 
				&& this.domY===this.y 
				&& this.domScaleX===this.scaleX 
				&& this.domScaleY===this.scaleY 
				&& this.domRotation===this.rotation 
			){
			return false;
		}

		var t=this.domMoveTo(this.x-offsetX,this.y-offsetY);
		var s=this.domScale(this.scaleX,this.scaleY);
		var r=this.domRotate(this.rotation);

		this.dom.style.webkitTransform=t+" "+s+" "+r;

		this.domX=this.x ;
		this.domY=this.y ;
		this.domScaleX=this.scaleX ;
		this.domScaleX=this.scaleX ;
		this.domRotation=this.rotation ;

	},

	_domScale2d : function(x,y){
		return "scale("+x+","+y+")";
	},
	_domScale3d : function(x,y){
		return "scale3d("+x+","+y+",1)";
	},
	_domRotate2d : function(rad){
		return "rotate("+rad+"rad)";
	},
	_domRotate3d : function(rad){
		return "rotate3d(0,0,1,"+rad+"rad)";
	},

	_domTranslate2d : function(x,y){
		return "translate("+(x-this.originX)+"px,"+(y-this.originY)+"px)";
	},

	_domTranslate3d : function(x,y){
		return "translate3d("+(x-this.originX)+"px,"+(y-this.originY)+"px,0px)";
	},

	_domMoveTo : function(x,y){
		if (this.domX!==x){
			this.dom.style.left=x-this.originX+"px";
		}
		if (this.domY!==y){
			this.dom.style.top=y-this.originY+"px";
		}
		return "";
	},

	renderDom : function(img,sx, sy,dw,dh,offsetX, offsetY){
		var style=this.dom.style;
		if (this.domWidth!==dw){
			style.width=dw+'px';
			this.domWidth=dw;
		}
		if (this.domHeight!==dh){
			style.height=dh+'px';
			this.domHeight=dh;
		}		

		var src=img.src;
		if (this.domSrc!==src){
			style.backgroundImage = 'url('+src+')';
			this.domSrc=src;
		}
		if (this.domImgX!==sx || this.domImgY!==sy){
			style.backgroundPosition = -sx+'px -'+sy+'px';
			this.domImgX=sx;
			this.domImgY=sy;
		}	

		this.domTransform(offsetX, offsetY);
	}


}

