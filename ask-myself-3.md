# React

## react 生命周期
15版本的周期：

constructor() 初始化
componentWillReceiveProps() 父组件修改组件的props时会调用
shouldComponentUpdate() 组件更新时调用
componentWillMount() 初始化渲染时调用
componentWillUpdate() 组件更新时调用
componentDidUpdate() 组件更新后调用
componentDidMount() 初始化渲染后调用
render() 渲染函数
componentWillUnmount() 组件卸载时调用

<img src="https://raw.githubusercontent.com/greatWeber/Ask-questions-every-day/master/images/20201117203136.jpg" alt="banner" width="600px">

要点解释：
1. constructor, componentWillMount, componentDidMount 方法只会在挂载阶段调用一次
2. render方法不会去操作真实的DOM ，它的职能是`把需要渲染的内容返回来`。真正的渲染工作是由ReactDOM.render执行的
3. componentWillMount 会在 render 方法前执行；componentDidMount发会在渲染结束后触发
4. componentReceiveProps 并不是由props得变化触发的，而是由父组件的更新触发的
5. shouldComponentUpdate 的返回值，会决定react组件是否进行re-render(重渲染)，我们可以通过手动调用shouldComponentUpdate来优化性能
6. 组件被销毁的两个原因：组件在父组件中被移除了；组件设置了key值，父组件在render的时候，发现key值跟上次的不一样，组件就会被销毁

16版的生命周期：

constructor()
getDerivedStateFromProps() 初始化/更新时调用
componentDidMount() 
shouldComponentUpdate() 组件更新时调用
getSnapshotBeforeUpdate() 组件更新前调用
componentDidUpdate() 
componentWillUnmount()

要点解释：
1. 新增的getDerivedStateFromProps，用来替代componentWillReceiveProps.它只有一个用途：`使用props来派生/更新state`.如果不是出于这个目的使用，都是不符合规范的
2. 在16.4及以后的版本中，任何因素触发的组件更新流程(包括由this.setState和forceUpdate触发的更新)都会触发getDerivedStateFromProps; 16.3版本只有父组件的更新会出触发该生命周期
3. getDerivedStateFromProps是一个静态方法，内部无法访问this.并且需要返回一个对象结构的值，react会根据返回值来定向更新组件的state.
4. getSnapshotBeforeUpdate 的返回值会作为第三个参数给到componentDidUpdate.它的执行时机是在render之后，真实dom更新之前。getSnapshotBeforeUpdate 需要跟componentDidUpdate配合使用来替代 componentWillUpdate

总结：
1. react 16版本 使用了Fiber架构，异步渲染的机制下，使得render 阶段是允许暂停，终止和重启的，这就导致render 阶段的生命周期是有可能内重复执行的
2. 16版本打算废除了 `componentWillMount; componentWillUpdate;componentWillReceiveProps`这三个生命周期，首先它们都是render阶段的，有可能重复触发，其次确保了Fiber机制下数据和视图的安全性，同时也确保了生命周期的方法行为更加纯粹，可控，可预测
