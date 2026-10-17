alert("Isso é uma calculadora de média");

let nome = prompt("Digite o nome do aluno: ");

let n1 = parseFloat(prompt("Difite a primeira nota do aluno: "));
let n2 = parseFloat(prompt("Difite a segunda nota do aluno: "));
let n3 = parseFloat(prompt("Difite a terceira nota do aluno: "));
let n4 = parseFloat(prompt("Difite a quarta nota do aluno: "));

let media = ((n1 + n2 + n3 + n4) / 4);
media = media.toFixed(1);

alert("A média desse aluno é: " + media);
