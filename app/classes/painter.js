export default class Painter {
  constructor(element, action) {
    this.element = element
    this.selected = null
    this.action = action

    this.element.childNodes.forEach(node => {
      node.addEventListener('click', event => {
        if (event.target.getAttribute('base') === 'false') { //если не база
          if (this.selected) { //если выбранная база существует
            this.action(event, this.selected)
          }
        } else { //если база
          this.selected = event.target //выбрать базу
        }
      })
    })
  }
}