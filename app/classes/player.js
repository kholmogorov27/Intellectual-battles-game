//класс игрока
export default class Player {
  constructor(name, color, textColor) {
    this.name = name
    this.color = color
    this.textColor = textColor || '#ddd'
  }
}