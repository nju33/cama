<h1><img src="https://github.com/nju33/cama/blob/master/app/icons/icon.iconset/icon_32x32@2x.png?raw=true" width=30>&nbsp;Cama</h1>

Text calculator app using [MathJS](https://github.com/josdejong/mathjs)

![Cama screenshot](https://github.com/nju33/cama/blob/master/screenshot.gif?raw=true)

## How to use?

This is almost MathJS itself, so please see the [MathJS document page](http://mathjs.org/docs/index.html).

## Extension

This app has its own extension as below.

- `goldenRatio` `gr` = 1.618
- `silverRatio` `sr` = 2.414

You can also make `$HOME/.config/cama/import.json` and set the original constant.
Like this

```json
{
  "foo": 100,
  "func": ["num", "return num"]
}
```

Those specified by the array are passed to `Function`. In other words, it becomes a function declaration.

```js
new Function('num', 'return num');
// num => { return num };
```

You will be able to use it as follows.

```js
foo + 10 // 110
func(10) // 10
```

## Shortcuts

### Global

`CommandOrControl+Alt+/` => Display and focus.

### Window

`Control+p` => If there is, select the previous formula  
`Control+n` => If there is, select one calculation formula  
`Control+l` => Delete all input values  

## Download

From the [release page](https://github.com/nju33/cama/releases/latest)

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:9080
npm run dev

# build electron app for production
npm run build

# run webpack in production
npm run pack
```
More information can be found [here](https://simulatedgreg.gitbooks.io/electron-vue/content/docs/npm_scripts.html).

---

This project was generated from [electron-vue](https://github.com/SimulatedGREG/electron-vue) using [vue-cli](https://github.com/vuejs/vue-cli). Documentation about this project can be found [here](https://simulatedgreg.gitbooks.io/electron-vue/content/index.html).

## License

MIT
