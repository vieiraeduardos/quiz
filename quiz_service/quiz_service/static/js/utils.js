/*utils.js*/

/*Convertendo nível de inteiro para uma palavra adequada*/
function convertLevel(level) {
  if(level == 0) {
    return "Fácil";
  } else if(level == 1) {
    return "Média";
  } else {
    return "Díficil";
  }
}
