'use strict';
define(

	function(require,exports){
		var Network = require('network').Network;
		var Layer = require('layer').Layer;
		var sigmoidFunc = require('ActivationFunc').sigmoid;
		
		
		
		function BpLearning(inputCount,outputCount,hiddens,learningRate,activFunc,momentum){
			this.inputCount = inputCount;
			this.outputCount = outputCount;
			this.network = new Network();
			this.momentum = momentum|| 0 ;
			this.learningRate = learningRate||0.1;
			this.prevDeltaW = undefined;
			this.updateErrors = undefined;
			this.activFunc = activFunc|| sigmoidFunc;
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

		}
		
		BpLearning.prototype= {
			init:function(){
				this.network.initLayers();
				
				var layers = this.network.layers;
				this.prevDeltaW = new Array(layers.length);
				for(var i=0;i<layers.length;i++){
					var curWeights = layers[i].weights;
					this.prevDeltaW[i] = new Array(curWeights.length);
					for(var j =0;j<curWeights.length;j++){
						this.prevDeltaW[i][j] = new Array(curWeights[j].length);
						for(var k = 0;k<curWeights[j].length;k++){
							this.prevDeltaW[i][j][k]=0;
						}
					}	
				}
		
				this.updateErrors = new Array(layers.length);
				for(var i = 0;i<this.updateErrors.length;i++){
					var innerL = layers[i].length;
					var curArr = this.updateErrors[i] = new Array(innerL);
					for(var j =0;j<innerL;j++){
						curArr[j](0);
					}
				}
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
				this.update(input,output);
			},
			update:function(inputs,targetOutput){
				this.__updateOutputLayer__(inputs,targetOutput);
				
				this.__updateOtherLayer__();
			},
			__updateOutputLayer__ :function(inputs,targetOutput){
				var layers = this.network.layers;
				var layerCount = layers.length;
				//update inputWeights of outputLyaer
				var outputLayer = layers[layerCount-1];
				
				var outLayerUpdateError = this.updateErrors[layerCount-1];
				if(layerCount>1){
					var preValues = layers[layerCount-2].values;
				}else{
					var preValues = inputs; 
				}
				var preWeigths = this.prevDeltaW[layerCount-1];
				for(var i = 0;i<outputLayer.weights.length;i++){
					var values = outputLayer.values;
					var weightI = outputLayer.weights[i];
					var ok = values[i];
					var tk = targetOutput[i];
					var learningRate = this.learningRate;
					var momentum = this.momentum;
					var err = tk-ok;
					var prefix = sigmoidFunc.derivativeFuncEx(0,ok)*err*learningRate;
					outLayerUpdateError[i] = tk-ok;
					
					for(var j = 0;j<weightI.length;j++){
						var subfix =this.momentum*preWeigths[i][j];
						var deltaW = prefix* preValues[j] ;//+ subfix
						weightI[j] += deltaW + subfix;
						
						outputLayer.threshold[i]+= prefix + subfix;
						preWeigths[i][j] = deltaW;
					}
				}
				
			},
			__updateOtherLayer__:function(){
				return ;
				var layers = this.network.layers;
				var layerCount = layers.length;
				
				for(var i = layerCount-2;i>=1;i--){
					
				}
			}
			
		}
		
		function upateParams(error,prevValue,learningRate,momentum){
			
		}
		
		function createLayer(neuronCount,inputCount,random){

//			random = random || function(){
//				return 1;
//			}
//			return new Layer(neuronCount,inputCount,random);
		
			return new Layer(neuronCount,inputCount,random);
		}
		//TODO delete
		function calcError(vec1,vec2){
			var error=0;
			var tempE=0;
			for(var i = 0;i<vec1.length;i++){
				tempE = vec1[i]-vec2[i];
				error+=tempE*tempE;
			}
			return error/2;
		}
		
		exports.BpLearning = BpLearning;
	}
)