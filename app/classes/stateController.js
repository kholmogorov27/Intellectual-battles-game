export default class StateController extends Array {
  //начальное состояние, функция-апдейтер
  constructor(startState, updater) {
    super()
    this.startState = startState
    this.push(structuredClone(this.startState))
    this.updater = updater
    this.element = document.getElementById('history')
    this.addIntoTheElement(0)
    this._head = 0
    this.head = 0

    document.querySelector('#historyButtons > .prev').addEventListener('click', event => {
      if (this.head > 0) {
        this.updater(structuredClone(this[this.head]), structuredClone(this[this.head-1]))
        this.head--
      }
    })

    document.querySelector('#historyButtons > .next').addEventListener('click', event => {
      if (this.head < this.length-1) {
        this.updater(structuredClone(this[this.head]), structuredClone(this[this.head+1]))
        this.head++
      }
    })

    document.getElementById('historyButtons').style.display = 'block'
  }

  //нынешнее состояние
  get current() {
    return structuredClone(this[this.head])
  }

  set head(value) {
    this.element.childNodes[this._head].classList.remove('head')
    this.element.childNodes[value].classList.add('head')
    this._head = value
  }

  get head() {
    return this._head
  }

  addState(newState) {
    while (this.length > this.head+1) {
      this.pop()
      this.element.lastChild.remove()
    }
    this.push(structuredClone(newState))
    //вызов апдейтера
    this.updater(structuredClone(this[this.head]), newState)
    this.addIntoTheElement(this.head+1)
    this.head++
  }

  addIntoTheElement(index) {
    let elem = document.createElement('div')
    elem.textContent = index
    elem.classList.add('state')
    elem.addEventListener('click', event => {
      this.updater(structuredClone(this[this.head]), structuredClone(this[index]))
      this.head = index
    })
    
    this.element.append(elem)
  }
}