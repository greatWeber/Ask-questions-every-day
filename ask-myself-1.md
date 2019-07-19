# ask myself

### 请描述ajax, 及用js实现ajax请求
> answer: `ajax` (全名 asynchronous javascript and xml)是一个`描述基于用脚本操纵HTTP请求的Web应用架构`的术语
> js实现ajax请求分四个步骤：
    1. 创建一个`XMLHttpRequest`对象，当然如果要兼容ie6的话(ActiveXObject)
    2. 通过open()方法指定一个请求
    3. 如果是`POST`请求的话，是要设置请求头的(setRequestHeader)。注意了,设置请求头这一步骤，是要在open之后，send之前，否则会报错
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