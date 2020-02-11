#扫雷游戏
**下载后双击game.html就可以玩啦**
![](/img/saolei.png);

**很简单的小游戏，比较有意思的就是扫雷里面的扩散算法**
下面放上代码。。
```
function _diffuse(point) { //扩散算法 
  var around = that.getAround(point); // 找到 0 四周的坐标 -》》这个函数请看下面，作用是找到上下左右的格子
  for (let arr of around) {
    let value = that.allframe[arr[0]][arr[1]].value;
    if (value === 0) { // 如果点击的是0，继续扩散
      if (!that.allDom[arr[0]][arr[1]].seek) { // 已经找过的坐标就不要招了，不然会爆栈
        that.allDom[arr[0]][arr[1]].seek = true;
        that.allDom[arr[0]][arr[1]].innerHTML = "";
        that.allDom[arr[0]][arr[1]].className = MineSweeping.classArr[value];
        _diffuse(that.allframe[arr[0]][arr[1]]); // 递归
      }
    } else { // 不是0则显示对应的数字
      that.allDom[arr[0]][arr[1]].innerHTML = value;
      that.allDom[arr[0]][arr[1]].className = MineSweeping.classArr[value];
    }
  }
}

/**
   * 给一个点，拿到周围8个点的坐标
   * @param {*} obj 
   */
  getAround(obj) {
    var around = [];
    for (let i = obj.x - 1; i <= obj.x + 1; i++) {
      for (let j = obj.y - 1; j <= obj.y + 1; j++) {
        // 1. 坐标不能小于0 
        // 2.不能大于行数 和 列数 
        // 3.自己的坐标不需要
        if ((i < 0 || j < 0) || (i > this.row - 1 || j > this.col - 1) || (i === obj.x && j === obj.y)) {
          continue
        };
        around.push([i, j]);
      }
    }
    return around;
  }
```

