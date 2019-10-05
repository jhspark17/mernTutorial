const validText = str => {
  console.log(str)
  return typeof str === "string" && str.trim().length > 0;
}

module.exports = validText;