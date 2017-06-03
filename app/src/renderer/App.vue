<template>
  <div class="calc">
    <form class="form" @submit.prevent="calc">
      <input ref="formula" type="input" class="formula" v-model="formula">
      <div class="result" v-text="result"
        :style="{color: result ? 'inherit' : 'transparent'}">
        </div>
    </form>
    <div class="error" v-if="errorMessage">
      <small v-text="errorMessage"></small>
    </div>
  </div>
</template>

<script>
import math from 'mathjs';
import debounce from 'lodash/debounce';
import cond from 'lodash/cond';
import matches from 'lodash/matches';

math.config({
  number: 'BigNumber',
  precision: 8
});

const defConst = {
  goldenRatio: 1.618,
  gr: 1.618,
  silverRatio: 2.414,
  sr: 2.414
};

export default {
  data() {
    return {
      formula: '',
      result: '',
      errorMessage: '',
      _historyIndex: -1,
      histories: [],
    };
  },
  methods: {
    calc() {
      if (!this.formula) {
        return;
      }

      try {
        const result = math.eval(this.formula);

        if (typeof result === 'number') {
          this.result = result;
        } else {
          if (result.e < 0 && result.d.length === 1) {
            result.d.unshift(0);
          }
          if (typeof result.d[1] !== 'undefined') {
            result.d[1] = String(result.d[1]).replace(/0*$/, '');
          }
          this.result = result.d.join('.');
        }
        this.$electron.clipboard.writeText('' + this.result);
        this.histories.unshift(this.formula);
        this.$data._historyIndex = -1;
        this.formula = '';
      } catch (err) {
        this.errorMessage = err.message;
        this.result = '';
      }
    },
    prev() {
      const history = this.histories[this.$data._historyIndex + 1];
      if (history) {
        this.$data._historyIndex++;
        this.formula = history;
      }
    },
    next() {
      const history = this.histories[this.$data._historyIndex - 1];
      if (history) {
        this.$data._historyIndex--;
        this.formula = history;
      } else if (this.formula !== '') {
        this.$data._historyIndex--;
        this.formula = '';
      }
    },
    clear() {
      this.formula = '';
    }
  },
  watch: {
    formula: debounce(function () {
      if (this.errorMessage) {
        this.errorMessage = '';
      }
    }, 100)
  },
  mounted() {
    this.$refs.formula.focus();

    this.$electron.ipcRenderer.send('get-const:req');
    this.$electron.ipcRenderer.on('get-const:res', (ev, data) => {
      Object.keys(data).forEach(key => {
        if (Array.isArray(data[key])) {
          data[key] = new Function(...data[key]);
        }
      });
      math.import(Object.assign({}, defConst, data));
    });

    const handleShortcut = cond([
      [matches({key: 'p', ctrlKey: true}), () => this.prev()],
      [matches({key: 'n', ctrlKey: true}), () => this.next()],
      [matches({key: 'l', ctrlKey: true}), () => this.clear()],
    ]);

    document.addEventListener('keydown', ev => {
      if (ev.ctrlKey) {
        ev.preventDefault();
      }
      handleShortcut(ev);
    });
  }
}
</script>

<style>
  @import url(https://fonts.googleapis.com/css?family=Lato:300);

  body {
    align-items: center;
    display: flex;
    font-family: Lato, Helvetica, sans-serif;
    margin: 0;
    height: 100vh;
    background: #282c34;
    color: #d7dae0;
  }

  input {
    box-sizing: border-box;
    background: inherit;
    color: inherit;
  }

  ol {
    list-style: none;
    padding: 0;
    margin: 0;
  }
</style>

<style scoped>
  .calc {
    width: 100%;
  }

  .history-wrapper {
    line-height: .5;
    position: absolute;
    width: 100%;
    top: 1em;
    box-sizing: border-box;
    padding: 0 2.2em;
    font-size: .85em;
  }

  .history {
    width: 100%;
    height: 4.5em;
    overflow: scroll;
  }

  .form {
    display: flex;
    width: 100%;
    align-items: center;
    font-size: 1.25em;
  }

  .formula {
    border: none;
    padding: 1em;
    flex: auto;
    outline: none;
    font-size: inherit;
    letter-spacing: inherit;
  }

  .result {
    max-width: 21%;
    min-width: 21%;
    flex: auto;
    text-align: center;
    color: #fff;
    overflow: hidden;
    text-overflow: ellipsis;
    padding-right: 1.5em;
  }

  .error {
    position: absolute;
    top: 1.2em;
    transform: translateY(-.9em);
    font-size: .9em;
    margin-left: -1em;
    color: #fff;
    background: #ef5f44;
    padding: .1em .3em .1em 2.35em;
    border-radius: 2px;
  }
</style>
