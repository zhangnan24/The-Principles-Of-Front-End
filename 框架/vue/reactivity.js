let total = 0;
let product = { price: 5, quantity: 2 };

// 用来存储不同对象的depsMap
const targetMap = new WeakMap();

// 收集effect
function track(target, key) {
  let depsMap = targetMap.get(target);
  if (!depsMap) {
    targetMap.set(target, (depsMap = new Map))
  }

  let dep = depsMap.get(key);
  if (!dep) {
    depsMap.set(key, (dep = new Set()));
  }

  dep.add(effect);
}

// 重新运行effect
function trigger(target, key) {
  const depsMap = targetMap.get(target)
  if (!depsMap) return;

  const dep = depsMap.get(key)
  if (dep) {
    dep.forEach((effect) => effect());
  }
}

function effect() {
  total = product.price * product.quantity;
  console.warn('run effect, now total is', total)
}

// 先把quantity的effect收集起来
track(product, 'quantity') 

effect() // 10

// 改变quantity
product.quantity = 3

// 触发对应的effect存储盒，把盒子里的effect重新跑一遍
trigger(product, 'quantity') // 15
