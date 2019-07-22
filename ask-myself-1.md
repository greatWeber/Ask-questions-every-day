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
> answer: 是对统一资源标识符(URI)的组成部分进行编码的方法，转义除了字母，数字，( ) . ! ~ * ' - _ 之外的所以字符。

> why use? 一般来说，URL只能用英文字母，数字及一些字符组成，特殊字符比如汉字是不能直接使用的，必须编码。

> 如果没有手动编码，那么浏览器就会插手，但浏览器根据版本，系统，场景等情况下编码是不一样的，为了避免混乱，就必须手动用js进行编码

> 参考: 

[MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/encodeURIComponent)


[关于URL编码](http://www.ruanyifeng.com/blog/2010/02/url_encoding.html)      