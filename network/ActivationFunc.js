define(
	function(require,exports){
		var sigmoid = {
			func:function(x){
				return 1/(1+Math.exp(-x));
			},
			derivativeFunc:function(x){
				var  y = 1/(1+Math.exp(-x));
				return y*(1-y);
			},
			derivativeFuncEx:function(x,y){
				return y*(1-y);
			}
		}
		
		exports.sigmoid = sigmoid;
	}
)
