/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./app/index.js":
/*!**********************!*\
  !*** ./app/index.js ***!
  \**********************/
/***/ (() => {

eval("//класс игрока\nclass Player {\n  constructor(name, color, textColor) {\n    this.name = name\n    this.color = color\n    this.textColor = textColor || '#ddd'\n  }\n}\n\ncellClickHandler = () => {\n  console.log('this')\n}\n\nA = new Player('A', 'red')\nB = new Player('B', 'orange')\nC = new Player('C', 'yellow', '#555')\nD = new Player('D', 'green')\nE = new Player('E', 'blue')\nF = new Player('F', 'magenta')\nG = new Player('G', 'pink', '#555')\nH = new Player('H', 'cyan', '#555')\n\nplayers = [A, B, C, D, E, F, G, H]\n\n//разметка поля игры\nconst template = [\n  [5, 3, A, 3, 5, 3, B, 3, 5],\n  [3, 5, 3, 3, 5, 3, 3, 5, 3],\n  [H, 3, 5, 3, 5, 3, 5, 3, C],\n  [3, 3, 3, 8, 11, 8, 3, 3, 3],\n  [5, 5, 5, 11, 15, 11, 5, 5, 5],\n  [3, 3, 3, 8, 11, 8, 3, 3, 3],\n  [G, 3, 5, 3, 5, 3, 5, 3, D],\n  [3, 5, 3, 3, 5, 3, 3, 5, 3],\n  [5, 3, F, 3, 5, 3, E, 3, 5]\n]\n//разметка правил захвата клеток\nconst rulesTemplate = [\n  [0, A, A, A, 0, B, B, B, 0],\n  [H, 0, A, A, 0, B, B, 0, C],\n  [H, H, 0, A, 0, B, 0, C, C],\n  [H, H, H, 0, 0, 0, C, C, C],\n  [0, 0, 0, 0, 0, 0, 0, 0, 0],\n  [G, G, G, 0, 0, 0, D, D, D],\n  [G, G, 0, F, 0, E, 0, D, D],\n  [G, 0, F, F, 0, E, E, 0, D],\n  [0, F, F, F, 0, E, E, E, 0]\n]\n//цвета разных значений\ncolors = {3: ['#eee'], 5: ['#ccc'], 8: ['#aaa'], 11: ['#888', '#ddd'], 15: ['#666', '#ddd']}\n\nconst buildTemplate = (template) => {\n\n  //html ячейка\n  const cell = (options) => { // option = {value, color, bg, border, nonPlayable}\n    element = document.createElement('div')\n\n    //классы\n    classes = ['cell']\n      options.base !== false ? classes.push('base') : null\n      options.hatching ? classes.push('hatching') : null\n      options.nonPlayable ? classes.push('non-playable') : null\n    element.classList.add(...classes);\n\n    //атрибуты\n    element.setAttribute('capture', options.base ? options.base : '-1')\n\n    //стиль\n    element.setAttribute('style', `\n      color: ${options.color || '#555'};\n      background: ${options.bg};\n      border: ${options.border};\n      ${options.hatching ? `--hatching-color: ${options.hatching};` : ''}\n    `)\n\n    //значение\n    element.textContent = options.value\n\n    //обработчик нажатий\n    element.onclick = cellClickHandler\n\n    return element\n    \n    /*\n      <div class=\"cell \"\n        capture=\"${options.base ? options.base : '-1'}\"\n        style=\"\n          color: ${options.color || '#555'};\n          background: ${options.bg};\n          border: ${options.border};\n          ${options.hatching ? `--hatching-color: ${options.hatching};` : ''}\n      \">\n          ${options.value}\n      </div>\n    */\n  }\n\n  rowsTemplate = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'J'] //шаблон имен строк\n\n  columns = template.length //столбцы\n  rows = template[0].length //строки\n\n  field = document.getElementById('field')\n  field.append(cell({value: '', border: 'none', nonPlayable: true})) // 0-клетка\n\n  for (let i = 1; i < columns+1; i++) {\n    field.append(cell({value: i, nonPlayable: true})) //номер столбца\n  }\n  for (let i = 1; i < columns+1; i++) {\n    field.append(cell({value: rowsTemplate[i-1], nonPlayable: true})) //номер строки\n\n    for (let k = 1; k < rows+1; k++) {\n\n      options = {}\n      if (typeof template[i-1][k-1] === 'number') { //если клетка\n        options.base = false\n        options.value = template[i-1][k-1]\n        options.bg = colors[options.value][0]\n        options.color = colors[options.value][1]\n      } else { // если база\n        options.base = players.indexOf(template[i-1][k-1])\n        options.value = template[i-1][k-1].name\n        options.bg = template[i-1][k-1].color\n        options.color = template[i-1][k-1].textColor\n      }\n\n      //правил захвата клеток\n      if (rulesTemplate[i-1][k-1] !== 0) {\n        options.hatching = rulesTemplate[i-1][k-1].color\n      }\n\n      field.append(cell(options))\n    }\n  }\n}\n\nshowPlayers = (players) => {\n  html = '<table border=1 cellpadding=5 id=\"score\">'\n  for (let i = 0; i < players.length; i++) {\n    html += `\n      <tr>\n        <td style=\"color: ${players[i].textColor};\" bgcolor=\"${players[i].color}\">${players[i].name}</td>\n        <td id=\"player-${players[i].name}\">0</td>\n      </tr>\n    `\n  }\n  html += '</table>'\n  return html\n}\n\nbuildTemplate(template)\n\ndocument.getElementById('main').innerHTML += showPlayers(players)\n\n//# sourceURL=webpack://cw-zahvatchiki/./app/index.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = {};
/******/ 	__webpack_modules__["./app/index.js"]();
/******/ 	
/******/ })()
;