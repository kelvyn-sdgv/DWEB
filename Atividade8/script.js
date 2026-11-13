
// PÓS-CENA - Pesquisa de 45 pessoas
// JavaScript puro: arrays, funções, if/else, for e DOM.

const limite = 45;
let respostas = [];

// Recupera respostas, caso a página tenha sido atualizada.
try {
    let salvas = JSON.parse(localStorage.getItem("posCenaRespostas"));
    if (Array.isArray(salvas)) {
        respostas = salvas.filter(function (r) {
            return Number.isInteger(r.idade) && r.idade >= 1 && r.idade <= 120 &&
                ["feminino", "masculino", "outros"].includes(r.sexo) &&
                [1, 2, 3, 4].includes(r.opiniao);
        }).slice(0, limite);
    }
} catch (erro) {
    respostas = [];
}

function salvarRespostas() {
    try {
        localStorage.setItem("posCenaRespostas", JSON.stringify(respostas));
    } catch (erro) {
        // A pesquisa funciona mesmo se o navegador bloquear o armazenamento.
    }
}

function escrever(id, texto) {
    document.getElementById(id).textContent = texto;
}

function atualizarTela() {
    let quantidade = respostas.length;
    let somaIdades = 0;
    let maiorIdade = 0;
    let menorIdade = 0;
    let mulheres = 0;
    let homens = 0;
    let outros = 0;
    let otimos = 0;
    let bons = 0;
    let regulares = 0;
    let pessimos = 0;

    // Calcula os resultados das respostas recebidas.
    for (let i = 0; i < quantidade; i++) {
        let pessoa = respostas[i];
        somaIdades += pessoa.idade;

        if (i === 0 || pessoa.idade > maiorIdade) {
            maiorIdade = pessoa.idade;
        }

        if (i === 0 || pessoa.idade < menorIdade) {
            menorIdade = pessoa.idade;
        }

        if (pessoa.sexo === "feminino") {
            mulheres++;
        } else if (pessoa.sexo === "masculino") {
            homens++;
        } else {
            outros++;
        }

        if (pessoa.opiniao === 4) {
            otimos++;
        } else if (pessoa.opiniao === 3) {
            bons++;
        } else if (pessoa.opiniao === 2) {
            regulares++;
        } else {
            pessimos++;
        }
    }

    escrever("progresso-texto", quantidade + " de 45 registradas");
    escrever("progresso-numero",
        String(quantidade).padStart(2, "0") + " / 45");

    document.getElementById("barra").style.width =
        (quantidade / limite * 100) + "%";

    if (quantidade > 0) {
        escrever("media",
            (somaIdades / quantidade).toFixed(1).replace(".", ","));

        escrever("maior", maiorIdade);
        escrever("menor", menorIdade);

        escrever("porcentagem",
            ((otimos + bons) / quantidade * 100)
                .toFixed(1).replace(".", ",") + "%");
    } else {
        escrever("media", "—");
        escrever("maior", "—");
        escrever("menor", "—");
        escrever("porcentagem", "—");
    }

    escrever("pessimos", pessimos);
    escrever("mulheres", mulheres);
    escrever("homens", homens);
    escrever("outros", outros);

    escrever("total-otimo", otimos);
    escrever("total-bom", bons);
    escrever("total-regular", regulares);
    escrever("total-pessimo", pessimos);

    // Atualiza os gráficos das avaliações.
    let total = quantidade || 1;

    document.getElementById("barra-otimo").style.width =
        (otimos / total * 100) + "%";

    document.getElementById("barra-bom").style.width =
        (bons / total * 100) + "%";

    document.getElementById("barra-regular").style.width =
        (regulares / total * 100) + "%";

    document.getElementById("barra-pessimo").style.width =
        (pessimos / total * 100) + "%";

    let concluida = quantidade === limite;

    escrever("pessoa-atual", concluida ?
        "45 / 45" :
        "PESSOA " + String(quantidade + 1).padStart(2, "0"));

    escrever("estado", concluida ? "CONCLUÍDA" : "EM ANDAMENTO");

    document.getElementById("registrar").disabled = concluida;
    document.getElementById("idade").disabled = concluida;
    document.getElementById("sexo").disabled = concluida;

    let notas = document.querySelectorAll('input[name="opiniao"]');

    for (let i = 0; i < notas.length; i++) {
        notas[i].disabled = concluida;
    }

    document.getElementById("desfazer").disabled = quantidade === 0;
    document.getElementById("reiniciar").disabled = quantidade === 0;

    if (concluida) {
        escrever("mensagem",
            "Fechou! As 45 avaliações foram registradas.");
    }
}

// Registra os dados de uma pessoa.
document.getElementById("formulario").addEventListener("submit", function (evento) {
    evento.preventDefault();

    if (respostas.length >= limite) {
        return;
    }

    let idade = Number(document.getElementById("idade").value);
    let sexo = document.getElementById("sexo").value;

    let marcada = document.querySelector('input[name="opiniao"]:checked');
    let opiniao = marcada ? Number(marcada.value) : 0;

    if (!Number.isInteger(idade) || idade < 1 || idade > 120 ||
        !["feminino", "masculino", "outros"].includes(sexo) ||
        opiniao < 1 || opiniao > 4) {

        escrever("mensagem",
            "Confira os três campos antes de registrar.");
        return;
    }

    respostas.push({
        idade: idade,
        sexo: sexo,
        opiniao: opiniao
    });

    salvarRespostas();
    document.getElementById("formulario").reset();
    atualizarTela();

    if (respostas.length < limite) {
        escrever("mensagem",
            "Resposta salva. Pode chamar a próxima pessoa.");

        document.getElementById("idade").focus();
    }
});

// Desfaz a última resposta.
document.getElementById("desfazer").addEventListener("click", function () {
    if (respostas.length === 0) {
        return;
    }

    respostas.pop();
    salvarRespostas();
    atualizarTela();

    escrever("mensagem", "Última resposta desfeita.");
});

// Reinicia toda a pesquisa.
document.getElementById("reiniciar").addEventListener("click", function () {
    if (respostas.length === 0) {
        return;
    }

    if (!confirm("Apagar todas as respostas e começar de novo?")) {
        return;
    }

    respostas = [];
    salvarRespostas();

    document.getElementById("formulario").reset();
    atualizarTela();

    escrever("mensagem", "Tudo zerado. Vamos de novo.");
});

// Exibe os resultados iniciais.
atualizarTela();
