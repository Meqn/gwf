const util = () => {
  let arr = [1,2,3,4,5,6]
  arr.map(v => {
    return v * v
  })
  const obj = {
    name: 'Jhon',
    age: 20
  }
  const person = Object.assign({}, obj, {name: 'Males'})
  const { name, age } = person
  console.log(name + ' age: ' + age)
  console.log('util.js ...')
}