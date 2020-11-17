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

<img src="https://greatweber.github.io/Ask-questions-every-day/images/20201117203136.jpg" alt="banner" width="600px">

要点解释：
1. constructor, componentWillMount, componentDidMount 方法只会在挂载阶段调用一次
2. render方法不会去操作真实的DOM ，它的职能是`把需要渲染的内容返回来`。真正的渲染工作是由ReactDOM.render执行的
3. componentWillMount 会在 render 方法前执行；componentDidMount发会在渲染结束后触发
4. componentReceiveProps 并不是由props得变化触发的，而是由父组件的更新触发的
5. shouldComponentUpdate 的返回值，会决定react组件是否进行re-render(重渲染)，我们可以通过手动调用shouldComponentUpdate来优化性能
