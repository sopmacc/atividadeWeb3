// Array com as prioridades disponiveis.
// Para criar uma nova (ex.: "Urgente"), basta acrescentar aqui.
const prioridades = ["Baixa", "Média", "Alta"];

// Classe Bootstrap de cada prioridade na badge.
// Prioridades sem cor definida aqui usam o padrao "bg-dark".
const coresPrioridade = {
    "Baixa": "bg-success",
    "Média": "bg-warning text-dark",
    "Alta": "bg-danger badge-piscando"
};

// Classe Bootstrap de cada status na badge.
const coresStatus = {
    "Aberto": "bg-primary",
    "Em atendimento": "bg-info text-dark",
    "Encerrado": "bg-secondary"
};

// Array com dados temporarios (somem ao atualizar a pagina).
const chamados = [
    {
        id: 1,
        titulo: "Computador não liga",
        descricao: "O computador não apresenta sinal de energia.",
        prioridade: "Alta",
        status: "Aberto"
    },
    {
        id: 2,
        titulo: "Senha bloqueada",
        descricao: "Usuário não consegue acessar o sistema.",
        prioridade: "Média",
        status: "Em atendimento"
    },
    {
        id: 3,
        titulo: "notebook não liga",
        descricao: "O computador não apresenta sinal de energia.",
        prioridade: "Alta",
        status: "Encerrado",
        solucao: "Foi realizada a troca do carregador do notebook."
    }
];

// Area da SPA que sera preenchida pelo JavaScript.
const app = document.getElementById("app");

// ----------------------------------------------------------------------
// FUNCOES AUXILIARES
// ----------------------------------------------------------------------

// Evita que texto digitado pelo usuario seja interpretado como HTML.
function escapar(texto) {
    const div = document.createElement("div");
    div.textContent = texto;
    return div.innerHTML;
}

// Gera a badge da prioridade.
function badgePrioridade(prioridade) {
    const classes = coresPrioridade[prioridade] || "bg-dark";
    return `<span class="badge ${classes}">${escapar(prioridade)}</span>`;
}

// Gera a badge do status.
function badgeStatus(status) {
    const classes = coresStatus[status] || "bg-dark";
    return `<span class="badge ${classes}">${escapar(status)}</span>`;
}

// Gera as <option> do select a partir do array de prioridades.
function opcoesPrioridade() {
    return prioridades
        .map(prioridade => `<option>${prioridade}</option>`)
        .join("");
}

// Procura um chamado pelo id.
function buscarChamado(id) {
    return chamados.find(chamado => chamado.id === id);
}

// ----------------------------------------------------------------------
// TELAS
// ----------------------------------------------------------------------

function mostrarDashboard() {

    // Todos os valores sao calculados a partir do array.
    const total = chamados.length;
    const abertos = chamados.filter(c => c.status === "Aberto").length;
    const emAtendimento = chamados.filter(c => c.status === "Em atendimento").length;
    const encerrados = chamados.filter(c => c.status === "Encerrado").length;
    const prioridadeAlta = chamados.filter(c => c.prioridade === "Alta").length;

    // Cada card do dashboard vira um item deste array.
    const cards = [
        { titulo: "Total de chamados", valor: total },
        { titulo: "Chamados abertos", valor: abertos },
        { titulo: "Chamados em atendimento", valor: emAtendimento },
        { titulo: "Chamados encerrados", valor: encerrados },
        { titulo: "Chamados de prioridade Alta", valor: prioridadeAlta }
    ];

    app.innerHTML = `
        <h1 class="mb-4">Dashboard</h1>

        <div class="row g-3">
            ${cards.map(card => `
                <div class="col-md-4">
                    <div class="card">
                        <div class="card-body">
                            <h2 class="h5">${card.titulo}</h2>
                            <p class="display-6">${card.valor}</p>
                        </div>
                    </div>
                </div>
            `).join("")}
        </div>
    `;
}

function mostrarChamados() {

    app.innerHTML = `
        <h1 class="mb-4">Chamados</h1>

        <div class="table-responsive">
            <table class="table table-striped align-middle">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Título</th>
                        <th>Prioridade</th>
                        <th>Status</th>
                        <th>Ações</th>
                    </tr>
                </thead>

                <tbody>
                    ${chamados.map(chamado => `
                        <tr>
                            <td>${chamado.id}</td>
                            <td>${escapar(chamado.titulo)}</td>
                            <td>${badgePrioridade(chamado.prioridade)}</td>
                            <td>${badgeStatus(chamado.status)}</td>
                            <td>
                                <button
                                    class="btn btn-sm btn-outline-primary"
                                    data-acao="visualizar"
                                    data-id="${chamado.id}">
                                    Visualizar
                                </button>

                                ${chamado.status !== "Encerrado" ? `
                                    <button
                                        class="btn btn-sm btn-outline-danger"
                                        data-acao="encerrar"
                                        data-id="${chamado.id}">
                                        Encerrar chamado
                                    </button>
                                ` : ""}
                            </td>
                        </tr>
                    `).join("")}
                </tbody>
            </table>
        </div>
    `;

    // Liga os eventos dos botoes de acao.
    app.querySelectorAll("[data-acao]").forEach(botao => {
        botao.addEventListener("click", () => {
            const id = Number(botao.dataset.id);

            if (botao.dataset.acao === "visualizar") {
                mostrarDetalhes(id);
            }

            if (botao.dataset.acao === "encerrar") {
                mostrarEncerrar(id);
            }
        });
    });
}

function mostrarDetalhes(id) {

    const chamado = buscarChamado(id);

    if (!chamado) {
        mostrarChamados();
        return;
    }

    app.innerHTML = `
        <h1 class="mb-4">Detalhes do chamado #${chamado.id}</h1>

        <div class="card mb-3">
            <div class="card-body">
                <p><strong>Chamado:</strong> #${chamado.id}</p>
                <p><strong>Título:</strong> ${escapar(chamado.titulo)}</p>
                <p><strong>Descrição:</strong> ${escapar(chamado.descricao)}</p>
                <p><strong>Prioridade:</strong> ${badgePrioridade(chamado.prioridade)}</p>
                <p><strong>Status:</strong> ${badgeStatus(chamado.status)}</p>

                ${chamado.status === "Encerrado" ? `
                    <hr>
                    <p class="mb-0">
                        <strong>Solução realizada:</strong>
                        ${chamado.solucao ? escapar(chamado.solucao) : "Não informada."}
                    </p>
                ` : ""}
            </div>
        </div>

        <button class="btn btn-secondary" id="btnVoltar">Voltar</button>
    `;

    document.getElementById("btnVoltar").addEventListener("click", mostrarChamados);
}

function mostrarEncerrar(id) {

    const chamado = buscarChamado(id);

    // Chamado inexistente ou ja encerrado nao pode ser encerrado.
    if (!chamado || chamado.status === "Encerrado") {
        mostrarChamados();
        return;
    }

    app.innerHTML = `
        <h1 class="mb-4">Encerrar chamado #${chamado.id}</h1>

        <div class="card mb-3">
            <div class="card-body">
                <p><strong>Chamado:</strong> #${chamado.id}</p>
                <p><strong>Problema:</strong> ${escapar(chamado.titulo)}</p>
                <p><strong>Descrição:</strong> ${escapar(chamado.descricao)}</p>
                <p><strong>Prioridade:</strong> ${badgePrioridade(chamado.prioridade)}</p>
                <p class="mb-0"><strong>Status atual:</strong> ${badgeStatus(chamado.status)}</p>
            </div>
        </div>

        <form id="formEncerrar" novalidate>
            <div class="mb-3">
                <label class="form-label" for="solucao">O que foi feito?</label>
                <textarea class="form-control" id="solucao" rows="4"></textarea>
                <div class="invalid-feedback" id="erroSolucao">
                    O preenchimento deste campo é obrigatório.
                </div>
            </div>

            <button class="btn btn-danger" type="submit">Confirmar encerramento</button>
            <button class="btn btn-secondary" type="button" id="btnCancelar">Cancelar</button>
        </form>
    `;

    document.getElementById("btnCancelar").addEventListener("click", mostrarChamados);

    document.getElementById("formEncerrar").addEventListener("submit", evento => {
        evento.preventDefault();

        const campo = document.getElementById("solucao");
        const solucao = campo.value.trim();

        // Validacao: nao encerra sem informar o que foi feito.
        if (solucao === "") {
            campo.classList.add("is-invalid");
            campo.focus();
            return;
        }

        // Guarda a solucao no proprio objeto e muda o status.
        chamado.solucao = solucao;
        chamado.status = "Encerrado";

        mostrarChamados();
    });
}

function mostrarNovoChamado() {

    app.innerHTML = `
        <h1 class="mb-4">Novo chamado</h1>

        <form id="formChamado">
            <div class="mb-3">
                <label class="form-label" for="titulo">Título</label>
                <input class="form-control" id="titulo" required>
            </div>

            <div class="mb-3">
                <label class="form-label" for="descricao">Descrição</label>
                <textarea class="form-control" id="descricao" rows="4"></textarea>
            </div>

            <div class="mb-3">
                <label class="form-label" for="prioridade">Prioridade</label>

                <select class="form-select" id="prioridade" required>
                    <option value="">Selecione</option>
                    ${opcoesPrioridade()}
                </select>
            </div>

            <button class="btn btn-success" type="submit">Cadastrar</button>
        </form>
    `;

    document.getElementById("formChamado").addEventListener("submit", cadastrarChamado);
}

function cadastrarChamado(evento) {

    evento.preventDefault();

    chamados.push({
        id: chamados.length + 1,
        titulo: document.getElementById("titulo").value,
        descricao: document.getElementById("descricao").value,
        prioridade: document.getElementById("prioridade").value,
        status: "Aberto"
    });

    mostrarChamados();
}

// ----------------------------------------------------------------------
// NAVEGACAO
// ----------------------------------------------------------------------

document.querySelectorAll("[data-view]").forEach(link => {
    link.addEventListener("click", evento => {
        evento.preventDefault();

        const view = link.dataset.view;

        if (view === "dashboard") {
            mostrarDashboard();
        }

        if (view === "chamados") {
            mostrarChamados();
        }

        if (view === "novo") {
            mostrarNovoChamado();
        }
    });
});

// Primeira tela.
mostrarDashboard();
