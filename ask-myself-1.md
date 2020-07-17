# ask myself

### 请描述ajax, 及用js实现ajax请求
> answer: `ajax` (全名 asynchronous javascript and xml)是一个`描述基于用脚本操纵HTTP请求的Web应用架构`的术语
> js实现ajax请求分四个步骤：

    1. 创建一个`XMLHttpRequest`对象，当然如果要兼容ie6的话(ActiveXObject)
    2. 通过open()方法指定一个请求
    3. 如果是`POST`请求的话，是要设置请求头的(setRequestHeader)。注意了,设置请求头这一步骤，是要在open之后，send之前，否则会报错, 当然你也可以不设置, 它会自动根据`send`里面的代码添加对应的头部
    4. 监听`readstatechange`事件，获取请求响应
    5. send()发送请求,如果是`POST`请求，可以传参数对象

```js
// 简单实现ajax请求
function ajax(params){
    var params = {
        url: params.url || '',
        type: params.type || 'GET',
        query: params.query || {},
        async: params.async || true,
        contentType: params.contentType || 'application/x-www-form-urlencoded',
        success: params.success,
        fail: params.fail,
        complete: params.complete
    };

    // 判断浏览器是否支持XMLHttpRequest
    if(window.XMLHttpRequest=== undefined){
        window.XMLHttpRequest = function(){
            return new ActiveXObject();
        }
    }

    // 1
    var request = new XMLHttpRequest();
    
    if(params.type.toUpperCase()=='GET' && params.query){
        var serializeStr = serializeQuery(params.query);
        params.url += '?'+serializeStr;
    }

    // 2
    request.open(params.type,params.url,params.async);

    // 3
    if(params.type.toUpperCase()=='POST'){
        request.setRequestHeader('Content-Type',params.contentType);
    }

    // 4
    request.onreadystatechange = function(){
        if(request.readyState!==4) return;
        if(request.status==200){

            typeof params.success === 'function' && params.success(request.responseText);
        }else{
            typeof params.fail === 'function' && params.fail(request.statusText);
        }
        typeof params.complete === 'function' && params.complete();

    }

    // 5
    if(params.type.toUpperCase() =='POST'){
        request.send(params.query)
    }else{
        request.send();
    }

}

function serializeQuery(query){
    var serializearr = [];
    for(var k in query){
        if(!query.hasOwnProperty(k)) continue;
        if(typeof query[k] === 'function') continue;
        var name = encodeURIComponent(k);
        var value = encodeURIComponent(query[k]);
        serializearr.push(name+'='+value);
    }
    return serializearr.join('&');
}

```

### ajax请求中的ContentType有哪些值，有什么不同？
> answer: 客户端通过`ContentType`告诉服务器实际发送的数据类型，可以根据该类型进行不同的处理
> `ContentType`由三部分组成(media-type,charset,boundary)。现在例举一些比较常见的media-type:

    1. text/plain: 纯文本，文件扩展名.txt
    2. text/html：HTML文本，文件扩展名.htm和.html
    3. application/x-www-form-urlencoded: 用于form表单提交(POST), 会把数据转成key1=val1&key2=val2的形式，并且通过URL(encodeURIComponent)转换
    4. multipart/form-data: 上传文件或者带有文件的复杂表单数据的时候，需要用到该类型 ，它会给boundary设置一个复杂的字符
    5. application/json：告诉服务器传输的是序列化后的json数据，需要手动序列化数据

### encodeURIComponent的作用？
> answer: 是对统一资源标识符(URI)的组成部分进行编码的方法，转义除了字母，数字，( ) . ! ~ * ' - _ 之外的所有字符。

> why use? 一般来说，URL只能用英文字母，数字及一些字符组成，特殊字符比如汉字是不能直接使用的，必须编码。
> 如果没有手动编码，那么浏览器就会插手，但浏览器根据版本，系统，场景等情况下编码是不一样的，为了避免混乱，就必须手动用js进行编码

> 参考: [MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/encodeURIComponent)
[关于URL编码](http://www.ruanyifeng.com/blog/2010/02/url_encoding.html)  

### node的require和es6的import有什么区别？
> answer: 
1. require是node的一个私有全局方法，而import是es6的一个标准规范。
2. node使用module.exports导出，require引入。es6使用export导出，import来引入。
3. es6的import写法可以很复杂，不仅可以使用`对象解构赋值`,还可以使用`as, *`等关键字;
node的写法就可以很简单，module.exports导出什么，require进来的就是什么。
4. import必须写在文件的开头，而require没有这个要求
5. import是编译时的，require是运行时的
> 参考：[Node中没搞明白require和import，你会被坑的很惨](https://imweb.io/topic/582293894067ce9726778be9)

### es5的继承有哪几种方式？
> answer: 
1. 构造函数继承。缺点是没有共享方法，浪费内存,并且拿不到父类的prototype对象
```js

function Parent(){
    this.names=['parent'];
    this.add = function(name){
        this.names.push(name);
    }
}


function Child(){
    Parent.call(this);
}

var child1 = new Child();
var child2 = new Child();
child1.add('child1');
console.log(child1.names); //["parent", "child1"]
console.log(child2.names); //["parent"]
console.log(child1.add === child2.add); //false

```

2. 原型继承。缺点是属性也被共享了
```js

function Parent(){
    this.names=['parent'];
    this.add = function(name){
        this.names.push(name);
    }
}

function Child(){
    
}

Child.prototype = new Parent();

var child1 = new Child();
var child2 = new Child();
child1.add('child1');
console.log(child1.names); //["parent", "child1"]
console.log(child2.names); //["parent", "child1"]
console.log(child1.add === child2.add); //true

```

3. 组合继承。缺点是父类调用多次，开销比较大，而且子类的属性存在两份
```js

function Parent(){
    this.names=['parent'];
    this.add = function(name){
        this.names.push(name);
    }
}

Parent.prototype.add2 = function(name){
        this.names.push(name);
    }

function Child(){
    Parent.call(this);
}

Child.prototype = new Parent();

var child1 = new Child();
var child2 = new Child();
child1.add('child1');
console.log(child1.names); //["parent", "child1"]
console.log(child2.names); //["parent", "child1"]
console.log(child1.add === child2.add); //false
console.log(child1.add2 === child2.add2); //true

```

4. 寄生继承, 相对比较完美
```js
function Parent(){
    this.names=['parent'];
    this.add = function(name){
        this.names.push(name);
    }
}

Parent.prototype.add2 = function(name){
        this.names.push(name);
    }

function Child(){
    Parent.call(this);
}

var Fn = new Function();
Fn.prototype = Parent.prototype;

Child.prototype = new Fn();

var child1 = new Child();
var child2 = new Child();
child1.add('child1');
console.log(child1.names); //["parent", "child1"]
console.log(child2.names); //["parent", "child1"]
console.log(child1.add === child2.add); //false
console.log(child1.add2 === child2.add2); //true

```
> 参考： [JS继承实现的几种方式及其优缺点](https://segmentfault.com/a/1190000011151188)
[Javascript面向对象编程（二）：构造函数的继承](http://www.ruanyifeng.com/blog/2010/05/object-oriented_javascript_inheritance.html)

### package.json中的dependencies和devDependencies的区别
> answer:
1. 当`npm`安装依赖的时候, 顶层的package会安装自身的`dependencies`和`devDependencies`, 还有子package
的`dependencies`, 但就是不会安装子级的`devDependencies`。
2. 当用node打包的时候, `dependencies`会被打包进去, 而`devDependencies`不会。所以当用到跟业务有关的插件, 
都应该放在`dependencies`, 而环境，编译类的插件放在`devDependencies`。

> 参考：[聊聊 node.js 中各种 dependency](https://juejin.im/entry/58ad025f8fd9c50067ffd41d)

### for..in.. 和 for..of.. 有什么区别？
> answer: 
1. for..in..: 可以遍历数组和对象。里面可以使用`break, continue`。
当遍历数组的时候，获取的是数组的下标; 当遍历对象的时候，获取的是属性的键名。
另外，当遍历对象的时候，还能获取原型上的属性和方法(前提是它们可遍历的,在es6的class中，只有constructor里面的方法属性可以遍历到)

2. for..of..: 只能遍历迭代器(iterator),它可以使用的范围包括`数组、Set 和 Map 结构、某些类似数组的对象（比如arguments对象、DOM NodeList 对象）、 Generator，以及字符串`。
当遍历的时候，获取的不是下标(键名)，而是键值。

> 参考： 
[Js中for in 和for of的区别](https://juejin.im/post/5aea83c86fb9a07aae15013b)
[for...of 循环](http://es6.ruanyifeng.com/?search=for+of&x=0&y=0#docs/iterator#for---of-%E5%BE%AA%E7%8E%AF)

### 实现一个call函数
> answer: 关键在于如何改变this的指向，具体看代码:
```js
Function.prototype._call = function(){
    if(!(this instanceof Function)) throw new Error('只有函数才能用_call!!!');
    var context = arguments[0] || window || global;
    context._fn = this;
    var args = [].slice.call(arguments,1);
    return context._fn(...args);

}

```

### 实现一个apply函数
> answer: 和call差不多，注意参数传递的方式不同
```js
Function.prototype._apply = function(){
    if(!(this instanceof Function)) throw new Error('只有函数才能用_apply!!!');
    var context = arguments[0] || window || global;
    context._fn = this;
    return context._fn(...arguments[1]|| null);
}

```

### 实现一个bind函数
> answer: 首先要了解bind跟call,apply有什么不同的地方：
1. .bind()后，会返回一个新的函数，不会立即执行
2. 可以实现参数柯里化
3. bind绑定返回的函数，如果执行了new操作，要把原型指向绑定前的那个函数

```js

Function.prototype._bind = function(){
    if(typeof this !== 'Function') throw new Error('只有函数才能用_bind!!!');
    var context = arguments[0] || window || global;
    var fn = new Function();
    var fToBind = this;
    var args = [].slice.call(arguments,1);
    var fBind = function(){
        return fToBind.apply(
            // 如果this已经是fBind的实例，就解除bind的效果
            this instanceof fBind? this: fToBind,
            args.concat([].slice.call(arguments)) //实现柯里化
        )
    }

    if(this.prototype){
        fn.prototype = this.prototype;
    }
    fBind.prototype = new fn(); //用寄生继承的方式，保持原来的原型链
    return fBind;
}

```

### 认识 http, tcp, udp协议
> answer: 首先我们要知道，网络是分为七层的：物理层，数据链路层，网络层，传输层，会话层，表示层，应用层。
http: 是应用层的一个协议，表示从web浏览器传输超文本到本地浏览器的传送协议。
tcp: 是传输层的一个协议，是面向连接的，即通信前需要和对方建立连接，如我们常见的三次握手：
    1. A主机向B主机发起请求建立连接的数据包
    2. B主机向A主机发送同意和请求同步的数据包
    3. A主机向B主机发送确认同步的数据包
udp: 跟tcp一样，是传输层的协议，不过是面向非连接的，即通信前不必与对方建立连接。udp适用于一次传输少数据，对
可靠性要求不高的环境。
http 是在 tcp协议上进行传输的，每一个http请求/响应都会建立一个新的tcp连接。


### 实现一个new函数
> answer: 首先要清除new进行了哪些处理：
1. 创建一个新对象obj
2. 把obj.__proto__指向构造函数的prototype
3. 执行构造函数
4. 返回obj

```js

function _new(){
    var context = arguments[0];
    var args = [].prototype.slice.call(arguments,1);
    var obj = Object.create(context.prototype);
    var rs = context.apply(obj,args);
    return rs instanceof Object? rs: obj;
}
```

### 常见的排序算法
> answer: 介绍一下冒泡排序，选择排序，快速排序，插入排序和希尔排序。
1. 冒泡排序：特点，每一次循环都会对前后元素进行交换，最后都能确定一个元素的位置。时间复杂度O(n2)。
```js
function bubbleSort(arr){
	let len = arr.length;
	let flat = false;
	for(let i=0;i<len;i++){
		if(flat) break;
		for(let k=0;k<len-i-1;k++){
			if(arr[k]>arr[k+1]){
				let temp = arr[k];
				arr[k] = arr[k+1];
				arr[k+1] = temp;
				flat = false;
			}else{
				flat = true;
			}
		}
	}
	return arr;
};

```

2. 选择排序：每次循环都在没排序的位置开始寻找最小的数值。时间复杂度O(n2)，非常稳定，无论什么数组都是这个时间复杂度。
```js
function selectionSort(arr){
	let len = arr.length;
	let minIndex = 0;
	for(let i=0;i<len;i++){
		minIndex = i;
		for(let k=i+1;k<len;k++){
			if(arr[k]<arr[minIndex]){
				minIndex = k;
			}
		}
		let temp = arr[i];
		arr[i] = arr[minIndex];
		arr[minIndex] = temp;
	}
	return arr;
};

```

3. 快速排序：利用分而治之思想的典型例子，把一个数组分成左右两边进行递归排序。时间复杂度O(n logn)。
```js
function quickSort(arr){
	if(arr.length<2){return arr}
	let middle = arr.shift(); //这个不能忘记，否则会无限循环
	let left=[],right=[];
	for(let i=0;i<arr.length;i++){
		if(arr[i]<middle){
			left.push(arr[i])
		}else{
			right.push(arr[i])
		}
	};
	return quickSort(left).concat([middle],quickSort(right));
	
};

```

4. 插入排序：跟我们平时整理扑克牌一样，每次都把一张牌插入到已经排好序的牌中的适合位置。只是，在算法实现中，要插到对应的位置，该位置后的元素都要往后移动一格。

```js
function insertSort(arr){
	let len = arr.length;
	let temp ;
	let k;
	for(let i=0;i<len;i++){
		k=i;
		while(k>0&&arr[k]<arr[k-1]){ //这里可以不用中间变量来交换数据
			temp = arr[k];
			arr[k] = arr[k-1];
			arr[k-1] = temp;
			k--;
		}
	}
	return arr;
};

function insertSort(arr){
	let len = arr.length;
	let current ;
	let preIndex;

	for(let i=0;i<len;i++){
		preIndex = i-1;
        current = arr[i]
		while(preIndex>0&&arr[preIndex]>current){ 
			
			arr[preIndex+1] = arr[preIndex];
            preIndex--;
		}
        arr[preIndex+1] = current;
	}
	return arr;
};

```

5. 希尔排序: 插入排序的升级版，使数组中任意间隔为h的元素都是有序的。时间复杂度O(n logn)。
```js

function shell(arr){
	var len = arr.length;
	var h=1, w=3; //分组的常数因子，该值可以是>=1&&<len的数字，当数据足够大的时候，无论该值是多少，都不会对性能造成多大的影响
	while(h<Math.floor(len/w)){
		h = h*w+1;
	};
	while(h>=1){
		for(let i=h;i<len;i++){
			let k = i;
			while(k>=h&&arr[k]<arr[k-h]){
				let temp = arr[k];
				arr[k] = arr[k-h];
				arr[k-h] = temp;
				k = k -h;
			}
		}
		h = Math.floor(h/w);
	}

	return arr;
};


```

> 参考：[JS家的排序算法](https://www.cnblogs.com/liululin/p/5897059.html)

### 了解一下typeof，如何写一个完善的typeof?
> answer: typeof 返回对象的类型，只能返回以下类型：'undefined','object','boolean','number','string',
'symbol','function'。所以它的缺点很明显，就是不能区分[], Null和其它一些复杂对象，因为它们都返回'object'。
如果要完善一个typeof，可以结合Object.prototype.toString来实现。

```js
function typeOf(o){
    var _toString = Object.prototype.toString;
    var _types = {
        'undefined':'undefined',
        'string':'string',
        'number':'number',
        'boolean':'boolean',
        'symbol':'symbol',
        '[object Function]': 'function',
        '[object Array]': 'array',
        '[object Date]' : 'date',
        '[object RegExp]':'regExp',
        '[object Error]': 'error'
    };
    return _types[typeof o] || _types[_toString.call(o)] || (o?'object':'null');
}

```


### 重绘和回流了解一下？
> 首先了解浏览器的渲染过程：
1. 解析html, 生成dom树
2. 解析css, 生成cssom树
3. 将dom树和cssom树结合，生成渲染树(render tree)
4. 回流(layout): 根据生成的渲染树，进行回流，等到节点的几何信息(位置，大小)
5. 重绘(painting): 根据渲染树和回流得到的几何信息，得到节点的绝对信息
6. 显示(display): 将像素发送给GPU，显示在页面上

> 回流：计算节点在视图(viewport)的准确位置和大小。当节点的几何信息或者布局变化时，会发生回流。

>重绘： 把可见节点的样式和几何信息结合起来转成屏幕上的实际像素。当节点的几何信息或者样式改变，但不影响布局变化时，会发生重绘。

> 回流一定会触发重绘，但反过来不成立。

> 优化：
1. 减少使用修改样式属性的次数，比如使用cssText，或者用class来修改样式
2. 当需要批量修改dom的时候，可以使之脱离文档流，修改完后带回文档流。
3. 使用css3硬件加速，可以让一些css动画不引起重绘回流。

> 脱离文档流的方法：
1. 隐藏元素(display:none)，修改完重新显示
2. 使用document.fragment创建一个子树，再插入文档流
3. 将原始的元素拷贝到一个脱离文档流的节点中，修改完后，替换原始的元素

> 参考：[【开发必看】你真的了解回流和重绘吗？](https://www.cnblogs.com/qcloud1001/p/10265985.html)

### nginx代理和反代理
>正向代理：隐藏真实的请求客户端，服务端不知道真实的客户端是谁，客户端请求的服务都被代理服务器代替来请求，某些可惜上网工具就是典型的正向代理

> 反向代理：隐藏真实的服务端。当我们请求www.baidu.com的时候，背后可能有成千上万台五福桥为我们服务，但具体是哪一台，我们是不需要知道的，只知道反向代理的服务器是谁就可以了。www.baidu.com就是我们的反向代理服务器

>两者的区别：前者用于客户端，后者用于服务器端

### webpack按需加载
webpack本身支持按需加载的，开启只需要下面几步：
1. 修改webpack.config.js，在output里面添加`chunkFilename`字段配置

2. 代码中的import需要按需使用。如果在文件开通就一股脑的使用import引入文件，是无法使用webpack的按需加载功能的，需要以`import().then()`这种形式动态加载。比如在vue项目中，我们会对vue-router的组件进行动态import。

3. 对于第三方组件库使用按需加载(以vue框架为例)，需要配合第三方插件`babel-plugin-component`,前提是第三方组件库有做按需加载的处理。

### 如何理解闭包
> 理解闭包，可以从作用域和作用域链来理解
> 作用域：就是规定了变量的访问范围。可以分为3种作用域：全局，函数，块作用域。
> 作用域链： 由于代码通常都是圈套的，当作用域圈套在一起时，就形成了`作用域链`，它的访问规则是从里到外。

> 闭包的特点就是 函数能够在定义的作用域以外的地方执行并且访问里面的变量。这就导致一个问题，定义的变量没有及时地被垃圾回收，如果遇到一些循环的操作，可能会导致内存泄漏。

> 闭包的用途：
1. 解决for循环时var定义的变量被共享的bug
2. 实现模块化. 内部定义的函数变量，通过return 来暴露
3. 与类结合，模拟私有变量
4. 实现柯里化和偏函数

> *需要注意的是，js的作用域遵循词法作用域模型，变量的作用域在书写的时候就确定下来了，不会动态改变。但实质上也是有方法可以修改词法作用域：`eval`,`with`





