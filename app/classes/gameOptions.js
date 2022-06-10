import Swal from 'sweetalert2'
import {Droppable} from '@shopify/draggable'
import Painter from "./painter";
import Player from "./player";

export default class GameOptions {
  constructor() {
    //разметка поля игры
    this.template = [
      [5, 3, 3, 3, 5, 3, 3, 3, 5],
      [3, 5, 3, 3, 5, 3, 3, 5, 3],
      [3, 3, 5, 3, 5, 3, 5, 3, 3],
      [3, 3, 3, 8, 11, 8, 3, 3, 3],
      [5, 5, 5, 11, 15, 11, 5, 5, 5],
      [3, 3, 3, 8, 11, 8, 3, 3, 3],
      [3, 3, 5, 3, 5, 3, 5, 3, 3],
      [3, 5, 3, 3, 5, 3, 3, 5, 3],
      [5, 3, 3, 3, 5, 3, 3, 3, 5]
    ]
    //разметка правил захвата клеток
    this.rulesTemplate = [
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0]
    ]
    this.size = this.template.length

    this.tamplateEditor = () => {
      this.zonesHTML = ''

      for (let i = 0; i < this.size*this.size; i++) {
        this.zonesHTML += `
          <div class="dropzone">
            <div class="cell-info">
              <input class="template-input" pattern="^[ 0-9]+$" type="number" value="${this.template[Math.floor(i/this.size)][i%this.size]}">
            </div>
          </div>`
      }

      return this.gridBuilder({
        mainContainer: 
          `<div id="grid" class="container"
            style="
              grid-template-columns: repeat(${this.template.length}, 1fr);
          ">${this.zonesHTML}</div>`
      })
    }
    this.tamplateEditorValidator = () => {
      let _template = this.template.map(x => {return x.slice()}) //клонирование 2-ух мерного массива
      let cells = document.querySelector('.container').querySelectorAll('.template-input')
      for (let i = 0; i < cells.length; i++) {
        let value = cells[i].value
        if (/\D/.test(value)) {
          return false
        }
        _template[Math.floor(i/this.size)][i%this.size] = Number(value)
      }
      this.template = _template
    }

    this.basePicker = () => {
      let zonesHTML = ''
      let playersHTML = ''

      window.players = {} //сброс информации о игроках
      window.playersPositions = {} //сброс информации о позиции игроков
      
      for (let i = 0; i < this.size*this.size; i++) {
        zonesHTML += `
          <div class="dropzone">
            <div class="cell-info">${this.template[Math.floor(i/this.size)][i%this.size]}</div>
          </div>`
      }

      for (let i = 0; i < Number(this.values[0]); i++) {
        window.players[window.playersOptions[i][0]] = (new Player(...window.playersOptions[i]))
        playersHTML += `
          <div class="dropzone draggable-dropzone--occupied">
            <div class="item" style="background: ${window.players[window.playersOptions[i][0]].color}; color: ${window.players[window.playersOptions[i][0]].textColor};">${window.players[window.playersOptions[i][0]].name}</div>
          </div>`
      }
      
      window.basePickerAfterCode = () => {
          window.droppable = new Droppable(document.querySelectorAll('.container'), {
            draggable: '.item',
            dropzone: '.dropzone'
          })
          document.getElementById('editOverlay').remove()
      }
      return this.gridBuilder({
          mainContainer: 
            `<div id="grid" class="container"
              style="
                grid-template-columns: repeat(${this.template.length}, 1fr);
            ">
              ${zonesHTML}
            </div>`,
          additionalContainer: 
            `<div class="container" 
              style="
                margin-top: 50px; 
                display: flex; 
                justify-content: center;
            ">
              ${playersHTML}
            </div>`,
          execute: {
            label: 'Редактировать',
            function: 'window.basePickerAfterCode()'
          }
        })
    }
    this.basePickerValidator = () => {
      let zones = document.querySelector('.container').querySelectorAll('.draggable-dropzone--occupied')
      if (Object.keys(window.players).length === zones.length) {
        zones.forEach(zone => {
          let index = [...zone.parentNode.children].indexOf(zone) //индекс ячейки
          window.playersPositions[zone.querySelector('.item').textContent] = index
        })
      } else {
        return false
      }
    }

    this.rulesEditor = () => {
      let zonesHTML = []

      //
      for (let i = 0; i < this.size*this.size; i++) {
        zonesHTML.push(`
          <div class="dropzone">
            <div class="cell-info" base="false" captured="-1">${this.template[Math.floor(i/this.size)][i%this.size]}</div>
          </div>`)
      }
      
      //
      for (let player in window.playersPositions) {
        zonesHTML[window.playersPositions[player]] = `
          <div class="dropzone">
            <div class="cell-info" base="true" captured="${player}" style="background: ${window.players[player].color}; color: ${window.players[player].textColor}; cursor: pointer;">${player}</div>
          </div>`
      }

      window.rulesEditorAfterCode = () => { 
        window.painter = new Painter(document.getElementById("grid"), (event, selected) => {
          let name = selected.getAttribute('captured')
          if (name === event.target.getAttribute('captured')) { //сброс покраски
            event.target.setAttribute('captured', '-1')
            event.target.style.removeProperty('--hatching-color')
            event.target.classList.remove('hatching')
          } else { //перекраска клетки
            event.target.setAttribute('captured', name)
            event.target.style.setProperty('--hatching-color', window.players[name].color)
            event.target.classList.add('hatching')
          }
        })

        document.getElementById('editOverlay').remove()
      }

      return this.gridBuilder({
        mainContainer: 
          `<div id="grid" class="container"
            style="
              grid-template-columns: repeat(${this.template.length}, 1fr);
          ">${zonesHTML.join('')}</div>`,
        execute: {
          label: 'Редактировать',
          function: 'rulesEditorAfterCode()'
        }
      })
    }
    this.rulesEditorValidator = () => {
      document.querySelector('.container').querySelectorAll('.cell-info[base="false"]:not([captured="-1"])').forEach(cell => {
        let index = [...cell.parentNode.parentNode.children].indexOf(cell.parentNode) //индекс ячейки
        this.rulesTemplate[Math.floor(index/this.rulesTemplate[0].length)][index%this.rulesTemplate.length] = cell.getAttribute('captured')
      })
      for (let player in window.playersPositions) {
        this.rulesTemplate[Math.floor(window.playersPositions[player]/this.rulesTemplate[0].length)][window.playersPositions[player]%this.rulesTemplate.length] = -1
      }
    }

    this.queue = {
      steps: ['1', '2', '3', '4', '5'],
      titles: ['Количество игроков', 'Редактирование шаблона', 'Расположение баз', 'Игровые правила', 'Игровое время'],
      inputs: ['range', '', '', '', 'range'],
      inputAttributes: [{min: 2, max: 8}, {}, {}, {}, {min: 1, max: 360}],
      html: ['', this.tamplateEditor, this.basePicker, this.rulesEditor, ''],
      preConfirm: ['', this.tamplateEditorValidator, this.basePickerValidator, this.rulesEditorValidator, '']
    }
    this.swalQueue = Swal.mixin({
      confirmButtonText: 'Далее',
      cancelButtonText: 'Назад',
      progressSteps: this.queue .steps,
      reverseButtons: true,
      allowOutsideClick: false
    })

    this.values = [2, null, null, null, 60]
  }

  setOptions = async () => {
    for (this.step = 0; this.step < this.queue.steps.length;) {
      this.result = await this.swalQueue.fire({
        title: this.queue.titles[this.step],
        input: this.queue.inputs[this.step],
        inputAttributes: this.queue.inputAttributes[this.step],
        inputValue:this.values[this.step],
        html: this.queue.html[this.step] ? this.queue.html[this.step]() : '',
        preConfirm: this.queue.preConfirm[this.step],
        showCancelButton: this.step > 0,
        currentProgressStep: this.step
      })
  
      if (this.result.value) {
        this.values[this.step] = this.result.value
        this.step++
      } else if (this.result.dismiss === Swal.DismissReason.cancel) {
        this.step--
      } else {
        break
      }
    }
  }

  gridBuilder = (options) => {
    return `
      <div style="user-select: none">
        <div style="position: relative;">
          ${options.mainContainer || 'Что-то пошло не так...'}
          ${options.execute ? 
            `<div 
              id="editOverlay" 
              class="overlay"
            >
              <div 
                class="button" 
                onclick="${options.execute.function}"
              >
                ${options.execute.label}
              </div>
            </div>` : ''}
        </div>
        ${options.additionalContainer || ''}
      </div>
    `
  }
}