//класс ячейки игрового поля
export default class Cell { // option = {value, color, bg, border, nonPlayable}
  constructor(options) {
    this.options = options

    //главный элемент
    this.element = document.createElement('div')
    this.options.base = this.options.base === true ? true : false
    this.options.captured = this.options.base ? this.options.value : '-1'
    this.update()
  }

  update(options) {
    //дополнение опций
    this.options = {...this.options, ...(options || {})}

    //классы
    this.element.classList = 'cell'
    if (this.options.nonPlayable) {
      this.element.classList.add('non-playable')
    }

    //атрибуты
    this.element.setAttribute('base', this.options.base)
    this.element.setAttribute('captured', this.options.captured)

    //стиль
    let color = this.getColor(this.options.value, window.colorsPattern)
    console.log(color, this.options.value, window.colorsPattern)
    this.element.setAttribute('style', `
      color: ${this.options.color || (color[1] || '#555')};
      background: ${this.options.bg || (color[0] || '#eee')};
      border: ${this.options.border};
    `)
    
    if (this.options.hatching) {
      this.element.classList.add('hatching')
      this.element.style.setProperty('--hatching-color', this.options.hatching)
      this.element.style.color = '#555'
    }

    //перекраска
    if (this.options.repainted) {
      this.element.classList.add('repainted')
      this.element.style.setProperty('--repainted', this.options.repainted)
      this.element.style.color = this.getPlayerTextColor(this.options.repainted)
    }

    //значение
    this.element.textContent = this.options.value
  }

  getColor(value, colors) {
    let pairs = Object.entries(colors)
    pairs.sort((a, b) => {
      return b[0] - a[0]
    })
    let color = pairs[0][1]
    for (let i = 1; i < pairs.length; i++) {
      if (pairs[i][0] >= value) {
        color = pairs[i][1]
      } else {
        break
      }
    }
    return color
  }

  getPlayerTextColor(color) {
    for (let i = 0; i < window.playersOptions.length; i++) {
      if (window.playersOptions[i][1] === color) {
        return window.playersOptions[i][2] || '#ddd'
      }
    }
    return '#ddd'
  }
}