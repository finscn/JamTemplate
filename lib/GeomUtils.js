
// GeomUtils
// 
;(function(scope, undefined){

	scope.merger( scope ,{

		checkAABBCollide : function( aabb1, aabb2){

			return  aabb1[0]<=aabb2[2] 
					&& aabb1[1]<=aabb2[3] 
					&& aabb2[0]<=aabb1[2] 
					&& aabb2[1]<=aabb1[3] ;
		},

		checkPolyCollide : function(poly1, poly2) {
			var len1 = poly1.length,
				len2 = poly2.length;

			var p,q,v;

			var inverted=false;
			while(true){
				p=poly1[len1 - 1];
				var px = p[0];
				var py = p[1];
				for (var i = 0; i < len1; i++) {
					q=poly1[i];
					var qx = q[0];
					var qy = q[1];
					var nx = qy - py;
					var ny = px - qx;

					var NdotP = nx * px + ny * py;
					var allOutside = true;
					for (var j = 0; j < len2; j++) {
						v=poly2[j];
						var vx = v[0];
						var vy = v[1];
						var det = nx * vx + ny * vy - NdotP;
						if (det<0) {
							allOutside = false;
							break;
						}
					}

					if (allOutside){
						return false;
					}

					px = qx;
					py = qy;
				}
				if (len2<2){
					return true;
				}
				if (inverted){
					break;
				}
				len1^=len2;
				len2^=len1;
				len1^=len2;
				p=poly1;
				poly1=poly2;
				poly2=p;
				inverted=true;
			};

			return true;
		},

		checkPolyCircleCollide : function(poly, cx, cy, radius) {
			var len = poly.length;
			var rr = radius * radius;
			var closestPoint, minPCdotPC = Infinity;
			var p = poly[len - 1], 
				px = p[0], py = p[1];
			for (var i = 0; i < len; i++) {
				var q = poly[i], 
					qx = q[0], qy = q[1];
				var nx = qy - py, ny = px - qx;
				var pcx = cx - px, pcy = cy - py;
				var PCdotN = pcx * nx + pcy * ny;
				if (PCdotN >= 0) {
					var NdotN = nx * nx + ny * ny;
					if (PCdotN * PCdotN >= rr * NdotN)
						return false;
				}
				var PCdotPC = pcx * pcx + pcy * pcy;
				if (PCdotPC <= rr){
					return true;
				}else if (PCdotPC <= minPCdotPC) {
					minPCdotPC = PCdotPC;
					closestPoint = p;
				}

				px = qx;
				py = qy;
			}
			var nx = closestPoint[0] - cx, 
				ny = closestPoint[1] - cy;
			var rhs = Math.sqrt(nx * nx + ny * ny) * radius;

			var CdotN = cx * nx + cy * ny;
			for (var i = 0; i < len; i++) {
				var p = poly[i], px = p[0], py = p[1];
				var CPdotN = px * nx + py * ny - CdotN;
				if (CPdotN < rhs)
					return true;
			}

			return false;
		},
		checkPointInPoly : function (x, y, poly) {
			var len = poly.length;
			var p = poly[len - 1], px = p[0] , py = p[1];
			var found = 0;

			for (var i = 0; i < len; i++) {
				var q = poly[i], qx = q[0], qy = q[1];

				var minX, maxX;
				if (px < qx) {
					minX = px;
					maxX = qx;
				}else {
					minX = qx;
					maxX = px;
				}

				if (x >= minX && x <= maxX) {
					var det = (qy - py) * (x-px)+ (px - qx) * (y-py);
					if (det >= 0) {
						return false;
					}
					if (found == 1){
						return true;
					}
					found++;
				}

				px = qx;
				py = qy;
			}

			return false;
		},
		
		// entity :  {
		// 		collideable : property , boolean
		// 		getAABB : function , array
		// 		isCollidedWith : function, boolean
		// 		onCollided : function , boolean
		// }
		checkEntitiesCollide : function(enties, gridSize, gridCol) {	

			var grid = {};
			for( var e = 0; e < enties.length; e++ ) {
				var entiyA = enties[e];
				
				if (!entiyA.collideable){
					continue;
				}

				var aabb1=entiyA.getAABB();
				var	colMin = Math.floor( aabb1[0]/gridSize ) ,
					rowMin = Math.floor( aabb1[1]/gridSize ) ,
					colMax = Math.floor( aabb1[2]/gridSize ) ,
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
									&& entiyA.isCollidedWith(entiyB) ) {
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

		blockByRect : function( aabb, dx, dy, rectAABB){
		
			var x1,y1,x2,y2;
			if ( (x1=aabb[0]+dx)>rectAABB[2] 
				|| (y1=aabb[1]+dy)>rectAABB[3] 
				|| rectAABB[0]>(x2=aabb[2]+dx)
				|| rectAABB[1]>(y2=aabb[3]+dy) ){
				return false;
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

			return [dx,dy];
		},

		moveRect : function( aabb, dx, dy, rectAABB){

			var x1,y1,x2,y2;
			if ( (x1=aabb[0]+dx)>rectAABB[2] 
				|| (y1=aabb[1]+dy)>rectAABB[3] 
				|| rectAABB[0]>(x2=aabb[2]+dx)
				|| rectAABB[1]>(y2=aabb[3]+dy) ){
				return false;
			}

			if (aabb[2]<rectAABB[0] && x2>=rectAABB[0]){
				dx=x2-rectAABB[0]+1;

			}else if (aabb[0]>=rectAABB[2] && x1<rectAABB[2]){
				dx=x1-rectAABB[2]-1;
			}
			if (aabb[3]<rectAABB[1] && y2>=rectAABB[1]){
				dy=y2-rectAABB[1]+1;

			}else if (aabb[1]>rectAABB[3] && y1<=rectAABB[3]){
				dy=y1-rectAABB[3]-1;

			}

			return [dx,dy];
		}

	});

}(this));