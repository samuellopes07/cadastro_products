
const form = document.getElementById("formProduto");
const telaLista = document.getElementById("telaLista");
const titulo = document.getElementById("titulo");
const lista = document.getElementById("listaProdutos");
const codigo = document.getElementById("codigo");
const produto = document.getElementById("produto");
const descricao = document.getElementById("descricao");
const preco = document.getElementById("preco");
const foto = document.getElementById("foto");
const preview = document.getElementById("preview");
const indice = document.getElementById("indice");
const btnSalvar = document.getElementById("btnSalvar");

let produtos = JSON.parse(localStorage.getItem("produtos")) || [];

// Nomes e extensões das imagens
const imagens = {
    "bolo_cenoura": "bolo_cenoura.jpeg",
    "bolo_limão": "bolo_limão.jpg",
    "bolo_milho": "bolo_milho.jpeg",
    "brownie_2": "brownie_2.jpg",
    "brownie": "brownie.jpg"
};

// Caminho da imagem
function caminhoFoto(nome) {
    return "imagens/" + (imagens[nome] || nome);
}

// Gerar código
function gerarCodigo() {
    const caracteres = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let codigoNovo = "";

    for (let i = 0; i < 4; i++) {
        codigoNovo += caracteres[
            Math.floor(Math.random() * caracteres.length)
        ];
    }

    if (produtos.some(p => p.codigo === codigoNovo)) {
        return gerarCodigo();
    }

    return codigoNovo;
}

// Salvar produtos
function salvarLocal() {
    localStorage.setItem("produtos", JSON.stringify(produtos));
}

// Limpar formulário
function limparFormulario() {
    form.reset();
    indice.value = "";
    codigo.value = gerarCodigo();
    preview.style.display = "none";
    preview.src = "";
    titulo.textContent = "CADASTRO DE PRODUTOS";
    btnSalvar.textContent = "Cadastrar Produto";
}

// Mostrar cadastro
function mostrarCadastro() {
    form.hidden = false;
    telaLista.hidden = true;
    limparFormulario();
}

// Mostrar lista
function mostrarLista() {
    form.hidden = true;
    telaLista.hidden = false;
    listarProdutos();
}

// Listar produtos com fotos
function listarProdutos() {
    lista.innerHTML = "";

    produtos.forEach((p, i) => {
        const linha = document.createElement("tr");

        linha.innerHTML = `
            <td>${p.codigo}</td>

            <td>
                <img
                    src="${caminhoFoto(p.foto)}"
                    width="80"
                    height="80"
                    style="object-fit:cover; border-radius:8px;"
                    onerror="this.style.display='none'"
                >
            </td>

            <td>${p.produto}</td>
            <td>${p.descricao}</td>
            <td>R$ ${p.preco.toFixed(2).replace(".", ",")}</td>

            <td>
                <button class="editar"
                    onclick="editarProduto(${i})">
                    Editar
                </button>

                <button class="excluir"
                    onclick="excluirProduto(${i})">
                    Excluir
                </button>
            </td>
        `;

        lista.appendChild(linha);
    });
}

// Carregar prévia da foto
function carregarFoto() {
    if (foto.value.trim() === "") {
        preview.style.display = "none";
        preview.src = "";
        return;
    }

    preview.src = caminhoFoto(foto.value.trim());
    preview.style.display = "block";

    preview.onerror = () => {
        preview.style.display = "none";
    };
}

// Atualizar prévia ao digitar
foto.addEventListener("input", carregarFoto);

// Cadastrar ou alterar
form.addEventListener("submit", function(event) {
    event.preventDefault();

    const nome = produto.value.trim();
    const textoDescricao = descricao.value.trim();
    const valorTexto = preco.value.trim().replace(",", ".");
    const nomeFoto = foto.value.trim();
    const valor = Number(valorTexto);

    if (nome.length < 5) {
        alert("O nome do produto deve ter pelo menos 5 caracteres.");
        produto.focus();
        return;
    }

    if (textoDescricao === "" || nomeFoto === "") {
        alert("Nenhum campo pode ficar vazio.");
        return;
    }

    if (!/^[0-9]+(\.[0-9]{1,2})?$/.test(valorTexto) ||
        !Number.isFinite(valor)) {
        alert("O preço deve conter apenas números.");
        preco.focus();
        return;
    }

    const registro = {
        codigo: codigo.value,
        produto: nome,
        descricao: textoDescricao,
        preco: valor,
        foto: nomeFoto
    };

    if (indice.value === "") {
        produtos.push(registro);
        alert("Produto cadastrado!");
    } else {
        produtos[Number(indice.value)] = registro;
        alert("Produto alterado!");
    }

    salvarLocal();
    mostrarLista();
});

// Editar produto
function editarProduto(i) {
    const p = produtos[i];

    titulo.textContent = "ALTERAÇÃO DE PRODUTO";
    form.hidden = false;
    telaLista.hidden = true;

    codigo.value = p.codigo;
    produto.value = p.produto;
    descricao.value = p.descricao;
    preco.value = p.preco.toFixed(2);
    foto.value = p.foto;
    indice.value = i;

    btnSalvar.textContent = "Salvar alterações";
    carregarFoto();
}

// Excluir produto
function excluirProduto(i) {
    const p = produtos[i];

    const confirmar = confirm(
        "EXCLUSÃO DE PRODUTO\n\n" +
        "Código: " + p.codigo + "\n" +
        "Produto: " + p.produto + "\n" +
        "Descrição: " + p.descricao + "\n" +
        "Preço: R$ " + p.preco.toFixed(2).replace(".", ",") +
        "\n\nDeseja excluir este produto?"
    );

    if (confirmar) {
        produtos.splice(i, 1);
        salvarLocal();
        listarProdutos();
    }
}

// Botões
document.getElementById("btnCancelar")
    .addEventListener("click", mostrarLista);

document.getElementById("btnNovo")
    .addEventListener("click", mostrarCadastro);

// Inicialização
limparFormulario();
mostrarCadastro();
