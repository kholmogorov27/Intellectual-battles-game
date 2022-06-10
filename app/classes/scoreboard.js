export default class Scores {
  constructor(players) {
    this.element = document.createElement('table')
    //id
    this.element.id = 'score'
    //атрибуты
    this.element.setAttribute('border', '1')
    this.element.setAttribute('cellpadding', '5')
    
    //хук-элементы
    this.hooks = {}
    for (let player in window.players) {
      this.hooks[player] = {
        score: 0,
        element: document.createElement('td')
      }

      let tr = document.createElement('tr')
      let firstColumn = document.createElement('td')
      
      firstColumn.setAttribute('style', `color: ${window.players[player].textColor}; background: ${window.players[player].color};`)
      firstColumn.textContent = player
      
      //сборка строки
      tr.append(firstColumn)
      tr.append(this.hooks[player].element)
      
      //вставка в таблицу
      this.element.append(tr)
    }
  }

  update(state, template) {
    for (const player in this.hooks) {
      this.hooks[player].score = 0
    }

    for (let i = 0; i < state.capture.length; i++) {
      for (let k = 0; k < state.capture[i].length; k++) {
        if (typeof state.capture[i][k] !== 'number') {
          this.hooks[state.capture[i][k]].score += template[i][k]
        }
      }
    }

    for (const player in this.hooks) {
      this.hooks[player].element.textContent = this.hooks[player].score
    }
  }
}