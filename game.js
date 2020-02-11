// 1.生成表格
// 2.创建雷
// 3.把雷的坐标生成好

class MineSweeping {
  constructor(row, col, thunderNumber) {
    this.row = row; // 多少行
    this.col = col; // 多少列
    this.thunderNumber = thunderNumber; // 雷的个数
    this.formerThunderNumber = thunderNumber; // 原来的雷的个数 
    this.thunderDom = document.querySelector("span"); // 还剩多少颗雷的dom
    this.parent = document.querySelector("table"); // 父元素
    this.allframe = []; // 每个格子的坐标 x,y；
    this.thunderFrame = []; // 每个雷的坐标；
    this.allDom = []; // 每个格子的dom坐标
    this.iswin = true; // 用来判断游戏是否胜利，如果最后为true，证明都找对了，如果有一个不对，则失败
  }
  init() {
    this.createTrTd();
    this.thunderNumberChange();
    this.createThunder();
    this.minesLocation();
    this.conputedNumber();
    // this.render();
  }
  /**
   *  剩余雷数
   */
  thunderNumberChange() {
    this.thunderDom.innerText = this.thunderNumber;
  }
  /**
   *  创建雷
   */
  createThunder() {
    let arr = [];
    for (let i = 0; i < this.row; i++) {
      for (let j = 0; j < this.col; j++) {
        arr.push({
          x: i,
          y: j
        });
      }
    }
    this.thunderFrame = arr.sort(() => Math.random() - 0.5).splice(0, this.thunderNumber);
  }
  /**
   * 生成表格
   */
  createTrTd() {
    this.parent.oncontextmenu = (e) => {
      e.preventDefault()
    };
    this.parent.innerHTML = ""; // 把原来的清空
    this.thunderNumber = this.formerThunderNumber; // 雷的个数还原
    var that = this;
    for (let i = 0; i < this.row; i++) {
      const tr = document.createElement("tr");
      this.allDom[i] = [];
      this.allframe[i] = [];
      for (let j = 0; j < this.col; j++) {
        const td = document.createElement("td");
        this.allDom[i][j] = td;
        td.xAndY = [i, j]; // 每个td的x和y坐标
        td.onmousedown = function (e) {
          that.play(e, this);
        };
        this.allframe[i][j] = {
          x: i,
          y: j,
          type: 'number',
          value: 0
        };
        tr.appendChild(td);
      }
      this.parent.appendChild(tr);
    }
  }
  /**
   * 锁定雷的位置
   */
  minesLocation() {
    this.allframe.forEach((item, index) => {
      item.forEach((arr, arrIndex) => {
        if (this.thunderFrame.findIndex(mine => arr.x === mine.x && arr.y === mine.y) !== -1) {
          this.allframe[index][arrIndex].type = "mine";
          delete this.allframe[index][arrIndex].value;
          this.getAround(this.allframe[index][arrIndex]);
        }
      })
    })
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
  /**
   * 计算雷旁边的value值
   */
  conputedNumber() {
    for (let i = 0; i < this.row; i++) {
      for (let j = 0; j < this.col; j++) {
        if (this.allframe[i][j].type === "mine") {
          const arround = this.getAround(this.allframe[i][j]);
          arround.forEach((arr, index) => {
            this.allframe[arr[0]][arr[1]].value += 1;
          })
        }
      }
    }
  }
  // 渲染界面
  render() {
    const classArr = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight']; // 每个文字的样式
    this.allframe.forEach((item, index) => {
      item.forEach((arr, arrindex) => {
        if (arr.type === "number") {
          this.allDom[arr.x][arr.y].className = classArr[arr.value];
          if (arr.value === 0) return;
          this.allDom[arr.x][arr.y].innerHTML = arr.value;
        } else if (arr.type === "mine") {
          this.allDom[arr.x][arr.y].className = "mine";
        }
      })
    })
  }
  /**
   * 
   * @param {*} e 点击event对象
   * @param {*} self 点击的dom元素
   */
  play(e, self) {
    var that = this;
    if (e.button === 0) { // 如果是左键
      if (self.className) return;
      const x = self.xAndY[0]; //x坐标
      const y = self.xAndY[1]; //y坐标
      const value = this.allframe[x][y].value;
      if (!Number.isNaN(value) && value >= 0) { // 有数字的话就要显示数字 如果数字是0不显示
        if (value === 0) {
          this.allDom[x][y].className = MineSweeping.classArr[value];
          _diffuse(this.allframe[x][y]);
          return;
        }
        this.allDom[x][y].innerText = value;
        this.allDom[x][y].className = MineSweeping.classArr[value];
      } else { // 是雷
        this.allDom[x][y].className = "mine";
        this.iswin = false;
        this.gameOver();
      }

      function _diffuse(point) { //扩散算法 
        var around = that.getAround(point); // 找到 0 四周的坐标
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
    } else { // 右键要插旗
      if (self.className && self.className !== "flag") return; // 翻过牌 和 不是插旗的不能点
      if (this.thunderNumber <= 0 && self.className !== "flag") return; // 如果剩余雷数 小于等于0了 也不能点
      self.className === "flag" ? self.className = "" : self.className = "flag";
      self.className === "flag" ? this.thunderNumberChange(--this.thunderNumber) : this.thunderNumberChange(++this.thunderNumber);
      this.allframe[self.xAndY[0]][self.xAndY[1]].type !== "mine" ? this.iswin = false : this.iswin = true; // 如果插旗有一个不是正确的雷 贼为false
      setTimeout(()=>{
        if (this.thunderNumber === 0 && this.iswin) {
          this.gameWin()
        };
      },0)
    }
  }
  gameOver() {
    if (!this.iswin) {
      this.render();
      alert("你输了,3秒之后会重新开始");
      setTimeout(() => {
        this.init();
      }, 3000);
    }
  }
  gameWin() {
    alert("你赢了,3秒之后会重新开始");
    this.render();
    setTimeout(() => {
      this.init();
    }, 3000);
  }
}
MineSweeping.classArr = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight'];
MineSweeping.leval = [[8,8,8],[12,12,20],[16,16,20]];
var btns = document.querySelector(".btns");
btns.onclick = function(e){
  if(e.target.innerText === "初级"){
    const mineSweeping = new MineSweeping(...MineSweeping.leval[0]);
    mineSweeping.init();
  }else if(e.target.innerText === "中级"){
    const mineSweeping = new MineSweeping(...MineSweeping.leval[1]);
    mineSweeping.init();
  }else if(e.target.innerText === "高级"){
    const mineSweeping = new MineSweeping(...MineSweeping.leval[2]);
    mineSweeping.init();
  }
}
const mineSweeping = new MineSweeping(...MineSweeping.leval[0]);
mineSweeping.init();

