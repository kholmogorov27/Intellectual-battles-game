import Cell from "./cell"
import Scoreboard from "./scoreboard"
import Painter from "./painter"
import StateController from "./stateController"
import Swal from "sweetalert2"

//класс игрового поля
export default class Field {
  constructor(template, rulesTemplate, rowsTemplate, time) {
    console.log(template, rulesTemplate, rowsTemplate, time)
    this.template = template
    this.rulesTemplate = rulesTemplate
    this.rowsTemplate = rowsTemplate
    this.time = time

    this.rows = this.template.length //строки
    this.columns = this.template[0].length //столбцы
    this.fieldContainer = document.getElementById('field')
    this.scoreboardContainer = document.getElementById('scoreboard')

    //клетки
    this.cells = []

    //функция апдейтер
    const update = (currentState, newState) => {
      for (let i = 0; i < this.rows; i++) {
        for (let k = 0; k < this.columns; k++) {
          if (currentState.defense[i][k] !== newState.defense[i][k]) {
            //измененик значения защиты
            let value = this.template[i][k]
            if (newState.defense[i][k] !== 0) {
              value = `${value}(${newState.defense[i][k]})`
            }
            this.cells[10*(i+1)+(k+1)].update({
              value: value
            })
          }
          if (currentState.capture[i][k] !== newState.capture[i][k]) {
            //перекраска клетки
            let name = newState.capture[i][k]
            this.cells[10*(i+1)+(k+1)].update({
              captured: name,
              repainted: typeof newState.capture[i][k] === 'string' ? window.players[name].color : false
            })
          }
          this.scoreboard.update(newState, this.template)
        }
      }
    }

    //контроллер состояний
    let startState = {
      capture: this.template.map(x => { //клонирование 2-ух мерного массива с обнулением
        return x.slice().map(x => x = -1)
      }),
      defense: this.template.map(x => { //клонирование 2-ух мерного массива с обнулением
        return x.slice().map(x => x = 0)
      })
    }
    this.state = new StateController(startState, update)

    //таблица счета
    this.scoreboard = new Scoreboard(window.players)
    this.scoreboard.update(startState, this.template)

    //создание поля
    this.build()

    let date = new Date()
    date.setMinutes(date.getMinutes() + this.time)
    let countDownDate = date.getTime()
    this.interval = setInterval(() => this.timer(countDownDate), 1000)
  }

  build = () => {
    // 0-клетка
    this.cells.push(new Cell({
      value: '', 
      border: 'none', 
      nonPlayable: true, 
      bg: 'white'
    }))

    for (let i = 1; i < this.columns+1; i++) {
      //номер столбца
      this.cells.push(new Cell({
        value: i, 
        nonPlayable: true,
        color: '#555',
        bg: 'white'
      }))
    }
    for (let i = 1; i < this.rows+1; i++) {
      //номер строки
      this.cells.push(new Cell({
        value: this.rowsTemplate[i-1], 
        nonPlayable: true,
        color: '#555',
        bg: 'white'
      }))

      //основной тэймплэйт
      for (let k = 1; k < this.columns+1; k++) {
        this.cells.push(new Cell({
          base: false,
          value: this.template[i-1][k-1]
        }))
      }
    }

    //базы
    for (let player in window.playersPositions) {
      this.cells[window.playersPositions[player] + this.template[0].length+1 + Math.floor(window.playersPositions[player]/this.template[0].length+1)] = new Cell({
        base: true,
        value: player,
        bg: window.players[player].color,
        color: window.players[player].textColor
      })
    }

    //игровые правила
    for (let i = 0; i < this.rows; i++) {
      for (let k = 0; k < this.columns; k++) {
        if (typeof this.rulesTemplate[i][k] !== 'number') {
          this.cells[10*(i+1)+(k+1)] = new Cell({
            base: false,
            value: this.template[i][k],
            hatching: window.players[this.rulesTemplate[i][k]].color
          })
        }
      }
    }

    //вставка элементов
    this.fieldContainer.append(...this.cells.map(cell => cell.element))
    this.scoreboardContainer.append(this.scoreboard.element)
    
    //
    this.painter = new Painter(this.fieldContainer, (event, selected) => {
      if (selected.getAttribute('captured') !== event.target.getAttribute('captured')) { //если разные клетки
        let index = [...event.target.parentNode.children].indexOf(event.target),
            i = Math.floor(index/(this.rows+1))-1,
            k = index%(this.columns+1)-1,
            newState = this.state.current
        // если для атакуемой клетки нет правил или правила соблюдены
        if (typeof this.rulesTemplate[i][k] !== 'string' || selected.getAttribute('captured') === this.rulesTemplate[i][k]) {
          newState.capture[i][k] = selected.getAttribute('captured')
          if (String(event.target.getAttribute('captured')) !== '-1') {
            newState.defense[i][k]++
          }
          this.state.addState(newState)
        } else {
            Swal.fire({
              position: 'center',
              icon: 'error',
              title: 'Невозможно захватить защищенную клетку',
              showConfirmButton: false,
              timer: 1000,
              backdrop: false
            })
        }
      }
    })
  }

  timer = (countDownDate) => {
    let now = new Date().getTime()
    let distance = countDownDate - now

    let hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    let minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
    let seconds = Math.floor((distance % (1000 * 60)) / 1000)

    document.getElementById("timer").innerHTML = `${hours} час. ${minutes} мин. ${seconds} сек.`

    if (distance < 0) {
      clearInterval(this.interval)
      document.getElementById("timer").innerHTML = "Время вышло"
    }
  }
}