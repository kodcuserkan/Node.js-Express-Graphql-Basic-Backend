const findWord = (word, str) => {
  return word.split(', ').some(function(w){return w === str})
}

module.exports = {
  findWord
}