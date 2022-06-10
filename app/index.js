import Field from "./classes/field";
import GameOptions from "./classes/gameOptions";

//игроки
window.players = {}
//позиции игроков
window.playersPositions = {} // <имя игрока>: <индекс ячейки>
//заготовки игроков
window.playersOptions = [['A', 'red'], ['B', 'orange'], ['C', 'yellow', '#555'], ['D', 'green'], ['E', 'blue'], ['F', 'magenta'], ['G', 'pink', '#555'], ['H', 'cyan', '#555']]
    
//разметка наименований строк
const rowsTemplate = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'J'] //шаблон имен строк
//цвета разных значений
window.colorsPattern = {3: ['#eee'], 5: ['#ccc'], 8: ['#aaa'], 11: ['#888', '#ddd'], 15: ['#666', '#ddd']}

window.onload = async () => {
  const gameOptions = new GameOptions()
  await gameOptions.setOptions()
  const field = new Field(gameOptions.template, gameOptions.rulesTemplate, rowsTemplate, Number(gameOptions.values[4]))
}