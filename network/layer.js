'use strict';
define(
	function(require,exports){
		var randomGenerator = require('randomGenerator');
		var uniformRand = randomGenerator.uniformRandomGenerator(0,1);
		var sigmoid = require('ActivationFunc').sigmoid;
		function Layer(neuronCount,inputCount,rand,activationFunc){
			this.nCount = neuronCount||1;
			this.iCount = inputCount||1;
			this.values = new Array(this.nCount);
			this.threshold = new Array(this.nCount);
			this.rand = rand|| uniformRand;
			this.activationFunc = activationFunc|| sigmoid.func;
			this.weights = new Array(this.nCount);
		}
		Layer.prototype = {
			init:function(){
				//
				for(var i = 0;i<this.nCount;i++){
					var arr=[];
					for(var j = 0;j <this.iCount;j++){
						arr.push(this.rand());
					}
					this.weights[i]=arr;
					this.threshold[i] = 0;
				}
				//return this;
			},
			calculate:function(input){
				for(var i = 0;i<this.nCount;i++){
					this.values[i] = this.activationFunc(this.__getWx__(i,input));
				}
			},
			__getWx__ : function(index,input){
				var sum = 0;
				var curNeuronWeight = this.weights[index];
				for(var i = 0;i<this.iCount;i++){
					sum += input[i]*curNeuronWeight[i];
				}
				return sum+this.threshold[index];
			},
		}
		exports.Layer = Layer;
	}
	  
);
