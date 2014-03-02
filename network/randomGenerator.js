'use strict';
define(

	function(require,exports){
		var uniformRandomGenerator = function(min,max){
			return function(){
				return Math.random()*(max-min)+min;
			}
		}
		
		var normalRand = function(u,t){
			//u center,t 
			return function(){
				//TODO generate random num by normal distribution
			}
		}
		exports.uniformRandomGenerator = uniformRandomGenerator;
	}
);