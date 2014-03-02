'use strict';
define(

	function(require,exports){
		var Network = require('network').Network;
		var Layer = require('layer').Layer;
		var sigmoidFunc = require('ActivationFunc').sigmoid;
		
		function BpLearning(inputCount,outputCount,hiddens,learningRate,activFunc){
			this.inputCount = inputCount;
			this.outputCount = outputCount;
			this.network = new Network();
			this.learningRate = learningRate||0.1;

			this.activFunc = activFunc|| sigmoidFunc;
			this.errsForPrevLayer = [];
			//no hidden layers
			if(!hiddens||hiddens.length==0){
				var firstLayer = createLayer(outputCount,inputCount);
				this.network.addLayer(firstLayer);
			}//at least one hidden layer
			else{
				var firstLayer = createLayer(hiddens[0],inputCount);
				this.network.addLayer(firstLayer);
				
				var prevLayer = firstLayer;
				for(var i = 1;i<hiddens.length;i++){
					var tempLayer = createLayer(hiddens[i],prevLayer.values.length);		
					this.network.addLayer(tempLayer);
					prevLayer = tempLayer;
				}
				
				var lastLayer = createLayer(outputCount,prevLayer.values.length);
				this.network.addLayer(lastLayer);
			}
			this.init();
			
		}
		
		BpLearning.prototype= {
			init:function(){
				this.network.initLayers();
				
				var layers = this.network.layers;
			},
			getOutput:function(){
				var layers = this.network.layers;
				var layerCount = layers.length;
				//update inputWeights of outputLyaer
				var outputLayer = layers[layerCount-1];
				return outputLayer.values;
			},
			runEpoch:function(inputs,outputs){
				
			},
			run:function(input,output){
				this.network.calculate(input);
				this.__update__(input,output);
			},
			__update__:function(inputs,targetOutput){
				var layers = this.network.layers;
				var layerCount = layers.length;
				//update inputWeights of outputLyaer
				var outputLayer = layers[layerCount-1];
				
				var prevValues = layerCount>1?layers[layerCount-2].values:inputs;
				var prevError=[];
				for(var i = 0;i<outputLayer.weights.length;i++){
					var values = outputLayer.values;
					var weightI = outputLayer.weights[i];
					var ok = values[i];
					var tk = targetOutput[i];
					var err = sigmoidFunc.derivativeFuncEx(0,ok)*(tk-ok);
					var prefix = err*this.learningRate;
					
					for(var j = 0;j<weightI.length;j++){
						var deltaW = prefix* prevValues[j] ;
						weightI[j] += deltaW//can do extra process: weightI[j]*=(1-2*learningRate*delayRate) to avoid overfit
					}
					outputLayer.threshold[i]+= prefix;
					prevError.push(err);
				}
				for(var i = layerCount-2;i>=0;i--){
					var curLayer = layers[i];
					var values = curLayer.values;
					var prevValues = i>0?layers[i-1].values:inputs;
					var tempErr = [];
					for(var j = 0;j<curLayer.weights.length;j++){
						var weightJ = curLayer.weights[j];
						var o = values[j];
						var err = sigmoidFunc.derivativeFuncEx(0,o)*
										updateErrorSum(prevError,layers[i+1].weights,j);
						var prefix = err*this.learningRate;
						for(var k = 0;k<weightJ.length;k++){
							var deltaW = prefix* prevValues[k] ;
							weightJ[k] +=deltaW;	
						}
						curLayer.threshold[j] +=prefix;
						tempErr.push(err);
					}
					prevError = tempErr;
				}
			}
		}
		
		
		function updateErrorSum(errItems,ws,index){
			var sum = 0;
			for(var i = 0;i<errItems.length;i++){
				sum+=ws[i][index]*errItems[i];
			}
			return sum;
		}
		
		
		function createLayer(neuronCount,inputCount,random,activationFunc){
			return new Layer(neuronCount,inputCount,random,activationFunc);
		}
		
		
		exports.BpLearning = BpLearning;
	}
)