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
