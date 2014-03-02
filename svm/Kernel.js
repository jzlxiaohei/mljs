define(
		function(require,exports){
			
			var kernel = {
				linear:function(){
					return function(vi,vj){
						var length = vi.length;
						var sum = 0.0;
						for(var i = 0;i<length;i++){
							sum += vi[i]*vj[i];
						}
						return sum;
					}
				},
				polyn:function(p){
					return function(vi,vj,p){
						var length = vi.length;
						var sum = 0.0;
						for(var i = 0;i<length;i++){
							sum += vi[i]*v[j];
						}
						return Math.pow(sum+1,p);
					}
				},
				Gaussian:function(sigma){
					return function(){
						var length = vi.length;
						var sum =0;
						for(var i = 0;i<length;i++){
							var dif = vi[i]-vj[i];
							sum+=dif*dif;
						}
						return Math.exp(-s*0.5*sigma*sigma);
					}
				}
			}
			
			
			exports.kernel = kernel;
		}
)