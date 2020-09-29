// deepClone
const deepClone = (obj,hash = new WeakMap())=>{
    if(obj instanceof RegExp) return new RegExp(obj);
    if(obj instanceof Date) return new Date(obj);
    if(typeof obj === 'function') return new Function('return '+obj.toString())();

    if(hash.has(obj)){
        return hash.get(obj)
    }
    let t = obj.constructor();
    hash.set(obj,t);
    for(let k in obj){
        if(obj.hasOwnProperty(k)){
            t[k] = deepClone(obj[k],hash)
        }
    }
    return t;
}

//vue自定义指令
Vue.directive('load',{
    inserted(el,binding){
        //todo...
        // 使用 window.IntersectionObserver; 或者 监听滚动事件+元素的getBoundingClientRect();
    },

    update(el,binding){},
    unbind(el,binding){},
});

//获取每个标签出现次数
let dom = [...document.getElementsByTagName('*')].map(item=>item.nodeName);
let domObj = dom.reduce((obj,a)=>{
    obj[a] = obj[a]?obj[a]+1:1;
    return obj;
},{});
// 排序拿到最多次数的标签
let arr = Object.entries(domObj);
arr.sort((a,b)=>b[1]-a[1]);

//  手写promise
class myPromise {
    constructor(func){
        this.status = 'pedding';
        this.value = null;
        this.resolvedTasks = [];
        this.rejectedTasks = [];
        this._resolve = this._resolve.bind(this);
        this._reject = this._reject.bind(this);
        try {
            func(this._resolve,this._reject);
        } catch (error) {
            this._reject(error);
        }
    }

    _resolve(value){
        setTimeout(()=>{
            this.status = 'fulfilled';
            this.value = value;
            this.resolvedTasks.forEach(t=>t(value));
        })
    }

    _reject(reason){
        setTimeout(()=>{
            this.status = 'reject';
            this.value = reason;
            this.rejectedTasks.forEach(t=>t(reason))
        })
    }

    then(onFulfilled,onRejected){
        return new myPromise((resolve,reject)=>{
            this.resolvedTasks.push((value)=>{
                try {
                    const res = onFulfilled(value);
                    if(res instanceof myPromise){
                        res.then(resolve,reject);
                    }else {
                        resolve(res);
                    }
                } catch (error) {
                    reject(error);
                }
            });

            this.rejectedTasks.push((value)=>{
                try {
                    const res = onRejected(value);
                    if(res instanceof myPromise){
                        res.then(resolve,reject);
                    }else{
                        reject(res);
                    }
                } catch (error) {
                    reject(error)
                }
            })
        })
    }

    catch(onRejected){
        return this.then(null,onRejected);
    }
}

// 节流
const trottle = (fn,time) =>{
    let flag = true;
    return ()=>{
        if(flag){
            flag = !flag;
            setTimeout(()=>{
                flag = !flag;
            },time);
            fn();
        }
    }
}

// 防抖
const debounce =(fn,time) => {
    let timer = null;
    return ()=>{
        clearTimeout(timer);
        timer = setTimeout(()=>{
            fn();
        },time)
    }
}

//  组合寄生继承
function create(proto){
   var F = new Function();
   F.prototype = proto;
   return new F();
}

function Parent(){};

function Child(){
    Parent.call(this);
}

Child.prototype = create(Parent.prototype);
Child.prototype.constructor = Child;

