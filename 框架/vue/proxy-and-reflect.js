let originalProduct = { price: 5, quantity: 2 };

// 用来存储不同对象的depsMap
const targetMap = new WeakMap();

// 收集effect
function track(target, key) {
  let depsMap = targetMap.get(target);
  if (!depsMap) {
    targetMap.set(target, (depsMap = new Map()));
  }

  let dep = depsMap.get(key);
  if (!dep) {
    depsMap.set(key, (dep = new Set()));
  }

  dep.add(effect);
}

// 重新运行effect
function trigger(target, key) {
  const depsMap = targetMap.get(target);
  if (!depsMap) return;

  const dep = depsMap.get(key);
  if (dep) {
    dep.forEach((effect) => effect());
  }
}

// reactive函数实现，传入一个对象，返回一个proxy代理对象
function reactive(target) {
  const handler = {
    get(target, key, receiver) {
      track(target, key); 
      return Reflect.get(target, key, receiver);
    },

    set(target, key, value, receiver) {
      const oldVal = target[key];
      const newVal = Reflect.set(target, key, value, receiver);
      if (oldVal !== newVal) {
        trigger(target, key);
      }
    },
  };

  return new Proxy(target, handler);
}

// 现在可以试一下成果了
let newProduct = reactive(originalProduct);
let total = 0;
let effect = () => {
    total = newProduct.price * newProduct.quantity
    console.warn('run effect, now total is', total)
};

// 初始化计算一次effect
effect() // run effect, now total is 10

// 随便改一下这个对象的值
newProduct.price = 8

// trigger自动跑 
// run effect, now total is 18
