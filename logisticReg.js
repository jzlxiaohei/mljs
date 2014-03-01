+function(exports,undefined){
	/*
	* w[n_out][n_in] * x[n_in] +b = y[n_out];		
	*/
	var makeArray;
	if(typeof ArrayBuffer === 'undefined') {
		makeArray = function(n){
			var arr =  new Array(n);
			for(var i = 0;i<arr.length;i++){
				arr[i]=0;
			}
			return arr;
		}
    } else {
		makeArray = function(n){
			return new Float64Array(n);
		}
    }

	function Array2d(row,col){
		this.row = row;
		this.col = col;
		this.arr = new makeArray(row*col)
	}
	
	exports.makeArray = makeArray;
	exports.Array2d = Array2d;
	
	var fn = Array2d.prototype;
	fn.get = function(x,y){
		return this.arr[x+y*this.row];
	}
		
	fn.set = function(x,y,val){
		this.arr[y+x*this.row] = val;
	}
	fn.add =function(x,y,val){
		this.arr[y+x*this.row]+=val;
	}
}(window)

+function(exports,undefined){
	var Array2d = exports.Array2d;
	var exp = Math.exp;
	function LogisticRegression(N,n_in,n_out){
		this.N =N;
		this.n_in  = n_in;
		this.n_out = n_out;
		
		this.W = new Array2d(n_out,n_in);
		this.b = makeArray(n_out);
	}
	
	var fn = LogisticRegression.prototype;
	fn.train =function(xs,ys,lr){
		lr = lr||0.1;
		var n_out = this.n_out
			,n_in = this.n_in
			,N =this.N
			,W = this.W
			,b=this.b;
		h = makeArray(n_out);
		dy = makeArray(n_out);
		//h = w * x 
		for(var i = 0;i<n_out;i++){
			h[i]=0;
			for(var j = 0;j<n_in;j++){
				h[i]+=W.get(i,j)*xs[j]
			}
			h[i]+=b[i];
		}
		softmax(h);
		//update 'w' and 'b'
		for(var i = 0;i<n_out;i++){
			dy[i] = ys[i]-h[i];
			for(var j = 0;j<n_in;j++){
				W.add(i,j,lr * dy[i] * xs[j] / N);
			}
			b[i] += lr * dy[i] / N;
		}
	}
	
	fn.predict = function(xs){
		var n_out = this.n_out,
			n_in = this.n_in;
		var W =this.W
			,b =this.b;
		var ys = makeArray(n_out);
		for(var i = 0;i<n_out;i++){
			ys[i]=0;
			for(var j = 0;j<n_in;j++){
				ys[i]+=W.get(i,j)*xs[j];
			}
			ys[i]+=b[i];
		}
		softmax(ys);
		return ys;
	}
	
	function softmax(arr){
		var sum=0;
		for(var i = 0;i<arr.length;i++){
			arr[i] =exp(arr[i]);
			sum +=arr[i];
		}
		for(var i = 0;i<arr.length;i++){
			arr[i] /=sum;
		}
	}
	
	exports.LogisticRegression = LogisticRegression;
}(window);
