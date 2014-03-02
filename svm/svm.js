'ues strict';
define(
		function(require,exports){
			//min 1/2 * sum(sum(aayy(x.x))) - sum(a)
			//s.t. sum(ay) = 0; for all a, 0<a<c
			var Kernel = require('Kernel').kernel;
			
			
			function Svm (C,kernel,tol,numPass,maxIter,allowdCache){
				this.C = C||1.0;
				
				this.tol = tol||1e-4;
				this.numPass = numPass||10;
				this.kernel = kernel||Kernel.linear();
				this.maxIter = maxIter||50000;
				this.allowdCache = allowdCache|| true;
			}
			var fn = Svm.prototype;
			fn.train = function(data,labels){
				this.data =data;
				this.labels = labels;
				var kernel = this.kernel;
				this.b = 0.0;
				var N = this.N = data.length;
				var D = this.D = data[0].length;
				var tol = this.tol;
				var C= this.C;
				this.alpha = new Array(N);
				for(var i=0;i<N;i++){
					this.alpha[i] = 0;
				}
				var iter = 0;
				var passes = 0;
				while(passes<this.numPass && iter<this.maxIter){
					var alphaChanged = 0;
					
					for(var i = 0;i<N;i++){
						var yi = labels[i];
						var Ei = this.getE(i); 
						if((yi*Ei< -tol&&this.alpha[i]<C)
								|| (yi*Ei>tol&&this.alpha[i]>0)){
							var j = i;
							while(j===i)
								j = Math.floor(Math.random()*N);
							var Ej = this.getE(j);
							
							var ai = this.alpha[i];
							var aj = this.alpha[j];
							
							var yj = labels[j];
							var L=0,H=C;
							if(yi===yj){
								L = Math.max(0,ai+aj-C);
								H = Math.min(C, ai+aj);
				            } else {
				            	L = Math.max(0, aj-ai);
				            	H = Math.min(C, C+aj-ai);
				            }
							if(Math.abs(L-H)<1e-4) continue;
							var kij = kernel(data[i],data[j]),
								kii = kernel(data[i],data[i]),
								kjj = kernel(data[j],data[j])
							var eta = 2*kij- kii- kjj;
							if(eta>=0)continue;
							
							var newaj =aj-yj*(Ei-Ej)/eta;
							if(newaj>H) newaj =H;
							if(newaj<L) newaj = L;
							if(Math.abs(aj-newaj)<1e-4)continue;
							this.alpha[j] = newaj;
							var newai = ai+yi*yj*(aj-newaj);
							this.alpha[i] = newai;
							var b1 =this.b-Ei-yi*(newai-ai)*kii
									-yj*(newaj-aj)*kij;
							var b2 = this.b-Ej-yj*(newaj-aj)*kjj
									-yi*(newai-ai)*kij;
							this.b = (b1+b2)*0.5;
							if(newai > 0 && newai < C) this.b= b1;
				            if(newaj > 0 && newaj < C) this.b= b2;
				            
				            alphaChanged++;
		 				}
					}
					iter++;
			        //console.log("iter number %d, alphaChanged = %d", iter, alphaChanged);
			        if(alphaChanged == 0) passes++;
			        else passes= 0;
				}
				this.w =new Array(this.D);
				for(var i = 0;i<this.D;i++){
					var sum = 0;
					for(var j =0;j<this.N;j++){
						sum+=this.alpha[j]*labels[j]*data[j][i];
					}
					this.w[i]=sum;
				}
				
			};
			
			fn.getE = function(i){
				var data = this.data;
				var result = this.b;
				for(var j = 0;j<this.N;j++){
					result +=this.alpha[j]*this.labels[j]*this.kernel(data[i],data[j]);
				}
				return result - this.labels[i];
			}
			fn.getParams = function(){
				
			}
			//cache kernel
	//		if(this.allowdCache){
	//			this.kernelTable = new Array(N);
	//			for(var i = 0;i<N;i++){
	//				this.kernelTable[i] = new Array(N);
	//				for(var j = 0;i<N;j++){
	//					this.kernelTable[i][j]= kernel(data[i],data[j]);
	//				}
	//			}
	//		}
			exports.Svm =Svm;
		}
);
