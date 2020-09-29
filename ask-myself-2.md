# ask myself (框架篇)

### vue的生命周期
> answer: vue的生命周期分为`8`个阶段
1. `beforeCreate`: vue实例已经初始化了，但数据观测和event/watcher 还没有调用。
说白了，这个阶段$data和$el都无法访问
2. `created`: 相比上一阶段，此时$data可以访问了，但$el还没有挂载
3. `beforeMount`: 在挂载前调用，相关的`render`函数会首次调用。在src引进的项目中，$el可以访问，但数据还没有
渲染(显示占位符); 在vue-cli的项目中，此时的$el还不能访问。
4. `mounted`: 挂载完成，el会被新创建的vm.$el替换。注意，此时不会保证所有的子组件都会渲染完成。(可调用vm.$nextTick)
5. `beforeUpdate`: 数据更新前调用，只有关联视图的数据变化了，才能触发该阶段。此时改变的值还可以再次修改，还可以访问修改前的DOM。
6. `updated`: 避免在该阶段修改数据，会进入无限循环。注意, 此时不会保证所有的子组件都被重绘。(可调用vm.$nextTick)
7. `beforeDestroy`: 实例销毁之前调用。在这一步，实例仍然完全可用。
8. `destroyed`: Vue 实例销毁后调用。调用后，Vue 实例指示的所有东西都会解绑定，所有的事件监听器会被移除，所有的子实例也会被销毁。
参考：[选项 / 生命周期钩子](https://cn.vuejs.org/v2/api/#%E9%80%89%E9%A1%B9-%E7%94%9F%E5%91%BD%E5%91%A8%E6%9C%9F%E9%92%A9%E5%AD%90)

### mpvue的生命周期
> answer: 
1. 页面的生命周期顺序：beforeCreate -> created ->(onLoad/onLauch) -> onShow -> onReady 
-> beforeMount -> mounted ...(其他的生命周期不分顺序)
2. 组件的生命周期顺序：beforeCreate -> created ->onLoad -> onReady 
-> beforeMount -> mounted ...(其他的生命周期不分顺序)


> 注意：
1. 当小程序加载完后，会执行当前页面和其他页面的beforeCreate和created阶段(组件除外)
2. 在当前页面点击后退，会执行onUnload事件，再次重新进来，会执行onLoad及以后的生命周期(组件也一样)，但之前的数据不会自动清空，所以要小心
3. mpvue的生命周期的vue部分基本和原生的vue一致，不过没有了$el,反而多了一个$mp

### 聊聊vue的响应式系统
> answer: vue的响应式主要分成3个部分，数据劫持(observer), 订阅监听(watcher), 依赖收集(dev)。
当初始化数据的时候，对数据用defineProperty进行劫持，在get()属性中，对订阅到的监听(watcher)进行收集，
然后在set()属性中进行触发，把修改后的值分发到watcher中，对应的watcher收到改变后的值(newValue)后，通过
patch()方法对vdom进行diff运算，最后对原生dom进行修改。到这里，通过修改model就到改变view,那反过来呢？
通过 Dom Listeners(dom事件监听)触发事件来改变数据。注意，通过view能够修改model并不能说明vue的数据是
双向绑定的，事实上，vue依然是单向绑定的。即m->v的过程是自动化的，我们不能干预的，但v->m是需要我们手动修改的。

### 聊聊vdom
> answer: vdom就是用自定义的对象来模拟真实dom结构。众所周知，dom操作是非常昂贵的，而且在大多数情况下，数据
的微小改动，我们都习惯无脑的批量更新dom, 而vdom则解决这种情况，它通过对比新旧的对象树，找出差异再去修改dom,可以很好的减少无用的dom操作。另一方面，由于vdom封装了对dom的操作，可以让我们更好的关注业务逻辑，可维护性也大大提高。其次，由于vdom是虚拟的dom对象，可以为跨平台提供很好的便利。

### vue中watch和computed的区别和应用场景？
> answer: 区别：
1. computed定义的变量不能跟data里面的重名，否则会报错；watch是监听data里面的某个数据
2. computed具有缓存，页面重新渲染的时候，如果值不变会立即返回而不需要再次执行；
3. computed是计算属性值，需要有return; watch是一个监听动作，可以不用返回return;
应用：
基于computed的特点，一般适用于模板渲染中，替代直接在模板写复杂的逻辑；watch一般适用于监听数据变化后处理一些业务逻辑。
> 参考：[计算属性 VS 侦听属性](https://ustbhuangyi.github.io/vue-analysis/reactive/computed-watcher.html#computed)
[Vue的computed和watch的细节全面分析](https://segmentfault.com/a/1190000012948175?utm_source=tag-newest)

### mvc和mvvm的区别？
> answer: 
mvc: model层用来存储业务的数据，一旦数据发生变化便通知相关的视图(view); view层负责显示视图，里面充斥着大量的dom操作; controller层是model和view之间的桥梁，通过controller让model发生变化并通知view更新视图。
mvc的缺点是view和controller没有解耦，因为它们之间是使用策略模式的，需要在view中传入controller的实例来实现特定的响应。

mvvm: model层更加纯粹，只关心数据本身，视图更新的通知交给了vm层处理; view层也改变很大，用模板加数据插值来渲染dom, 不需要对原生dom做操作; viewModle层采用了数据绑定，model和view之间的数据同步就由vm层的数据绑定进行处理了。随便说一下，不同的mvvm框架的数据绑定方式是不一样的：vue(数据劫持); react(发布-订阅); angular(脏值检查)
> 参考：[浅析前端开发中的 MVC/MVP/MVVM 模式](https://juejin.im/post/593021272f301e0058273468)

### wepback热更新原理
1. 通过webpack-dev-server 启动本地服务器，然后再建立一个websocket连接，这样就可以连接本地服务器和浏览器的双向通信。
2. 通过webpack-dev-middleware 监听文件变化，当文件变化时，触发编译，编译结束后就通过websocket给浏览器发送通知
3. 浏览器端用websocket注册了2个监听事件： hash事件(用于更新最后一次打包的hash值)；ok事件(进行热更新检查)
4. 热更新检查的时候，使用node的eventEmitter实例，发送一个`webpackHotUpdate`消息给 webpack 处理热更新。
5. webpack监听到`webpackHostUpdate`事件后，调用webpack.hot.check()进行检查，然后通过JSONP的方式，请求要热更新的文件(以hot-update.js结尾的js文件)
6. 最终使用hotApplay进行模块替换。分几步走：1. 删除过期的模块；2. 把新的模块添加到modules中; 3. 通过webpack_require 执行相关模块的代码


