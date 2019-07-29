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