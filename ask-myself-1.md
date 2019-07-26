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
        request.setRequestHeader('Content-Type',params.request);
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