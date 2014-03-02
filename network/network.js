'use strict';
define(
	
	function(require,exports){
		var Layer = require('layer');
		function Network(){
			this.layers=[];
		}
		
		Network.prototype = {
			addLayer:function(layer){
				this.layers.push(layer);
			},
			initLayers:function(){
				this.layerCount = this.layers.length;
				for(var i = 0;i<this.layerCount;i++){
					this.layers[i].init();
				}
				
			},
			calculate:function(input){
				var firstLayer = this.layers[0];
				firstLayer.calculate(input);
				for(var i = 1;i<this.layerCount;i++){
					var inputValues = this.layers[i-1].values;
					this.layers[i].calculate(inputValues);
				}
			},
			getOutput:function(){
				return this.layers[this.layerCount-1].values;
			}
		}
		exports.Network = Network;
	}
)