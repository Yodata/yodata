import addToSet from './addToSet';

const addToPath = destPath => ({
  key: destPath,
  val: ({currentValue, value}) => addToSet(currentValue, value)
})

export default addToPath
