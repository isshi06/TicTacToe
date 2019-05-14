// それぞれのマスを表すコンポーネント
Vue.component('mark-area', {
  props: ['cell', 'index'],
  methods: {
    draw: function () {
      this.$emit('mark');
    }
  },
  template: `<td v-on:click.once="draw" v-bind:id="index">{{ (cell === 1) ? "×" : (cell === 0) ? "○" : "" }}</td>`
})

// ゲームの決着がついた時に表示するモーダルウィンドウ
Vue.component('modal-panel', {
  props: ['result'],
  computed: {
    gameResult: function (){
      return (this.result === '1') ? "×の勝ち" : (this.result === '0') ? "○の勝ち" : "引き分け";
    }
  },
  template: `
  <transition name="modal">
    <div class="modal-mask">
      <div class="modal-wrapper">
        <div class="modal-container">
          <div class="modal-body">
            <p>{{ gameResult }}です。</p>
            <input type="button" value="OK" onclick="location.reload()">
          </div>
        </div>
      </div>
    </div>
  </transition>
  `
})

new Vue({
  el: '#app',
  methods: {
    /**
     * 盤面の更新を行う関数
     * @param {Number} stateIndex 更新するマスの行番号
     * @param {Number} cell 更新するマスの要素番号
     */
    mark: function (stateIndex, cell) {
      this.$set(this.states[stateIndex], cell, Number(this.turn));
      
      this.result = this.judge(this.states);
      this.turn   = Number(this.turn) ? '0' : '1';
      this.marker = this.turn ? '×' : '○';
    },
    /**
     * 勝敗判定を行う関数
     * @param  {Object} board 盤面の状態
     * @return {String}       勝者が○ならば'1'、×ならば'0'、引き分けなら'draw'
     */
    judge: function (board) {
      // 縦の判定
      for(var i=0; i < 3; i++){
        if(board[0][i] === board[1][i+3] && board[1][i+3] === board[2][i+6] && board[2][i+6] !== ''){
          return this.turn;
        }
      }
      // 横の判定
      for(var i=0; i < 3; i++){
        if(board[i][i*3] === board[i][i*3+1] && board[i][i*3+1] === board[i][i*3+2] && board[i][i*3+2] !== ''){
          return this.turn;
        }
      }
      // 斜めの判定
      if(board[0][0] === board[1][4] && board[1][4] === board[2][8] && board[2][8] !== ''){
        return this.turn;
      }else if(board[0][2] === board[1][4] && board[1][4] === board[2][6] && board[2][6] !== ''){
        return this.turn;
      }
      // 引き分け判定(空のマスがあるかどうか)
      for(var i=0; i < 3; i++){
        if(board[i][i*3] === '' || board[i][i*3+1] === '' || board[i][i*3+2] === '' ){
          return '';
        }
      }
      return 'draw';
    }
  },
  data: function() {
    return {
      states: {
        0:{0:'', 1:'', 2:''}, 
        1:{3:'', 4:'', 5:''}, 
        2:{6:'', 7:'', 8:''}
      },
      turn: '0',
      marker: '○',
      result: ''
    }
  }
})