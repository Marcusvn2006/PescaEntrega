import { useState, useEffect } from "react";
import api from "../Services/api";

const Produtos = () => {
  const [produtoData, setProdutoData] = useState({
    nome: "",
    descricao: "",
    preco: 0,
    quantidadeEstoque: 0,
    tipoProduto: "",
    categoriaPesca: "",
    fornecedorId: "",
  });

  const [fornecedoresList, setFornecedoresList] = useState([]);
  const [isFormVisible, setFormVisible] = useState(false);
  const [produtosList, setProdutosList] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    const fetchFornecedores = async () => {
      try {
        const response = await api.get("/Fornecedors"); // Endpoint para obter fornecedores
        setFornecedoresList(response.data);
      } catch (error) {
        console.error(
          "Erro ao buscar fornecedores:",
          error.response ? error.response.data : error.message
        );
      }
    };

    const fetchProdutos = async () => {
      try {
        const response = await api.get("/Produtos");
        setProdutosList(response.data);
      } catch (error) {
        console.error(
          "Erro ao buscar produtos:",
          error.response ? error.response.data : error.message
        );
      }
    };

    fetchFornecedores();
    fetchProdutos();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProdutoData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (isEditing) {
        await api.put(`/Produtos/${editingId}`, produtoData);
        setIsEditing(false);
        setEditingId(null);
      } else {
        await api.post("/Produtos", produtoData);
      }

      setProdutoData({
        nome: "",
        descricao: "",
        preco: 0,
        quantidadeEstoque: 0,
        tipoProduto: "",
        categoriaPesca: "",
        fornecedorId: "",
      });
      setFormVisible(false);
      const response = await api.get("/Produtos");
      setProdutosList(response.data);
    } catch (error) {
      console.error(
        "Erro ao salvar produto:",
        error.response ? error.response.data : error.message
      );
    }
  };

  const toggleForm = () => {
    setFormVisible(!isFormVisible);
    setIsEditing(false);
    setEditingId(null);
    setProdutoData({
      nome: "",
      descricao: "",
      preco: 0,
      quantidadeEstoque: 0,
      tipoProduto: "",
      categoriaPesca: "",
      fornecedorId: "",
    });
  };

  const handleEdit = (produto) => {
    setProdutoData(produto);
    setIsEditing(true);
    setEditingId(produto.id);
    setFormVisible(true);
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/Produtos/${id}`);
      setProdutosList(produtosList.filter((produto) => produto.id !== id));
    } catch (error) {
      console.error(
        "Erro ao excluir produto:",
        error.response ? error.response.data : error.message
      );
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">Gerenciamento de Produtos</h2>

      <button
        onClick={toggleForm}
        className="btn btn-primary w-50 mx-auto d-block mb-3"
      >
        {isFormVisible ? "Fechar Formulário" : "Novo Produto"}
      </button>

      {isFormVisible && (
        <form
          onSubmit={handleSubmit}
          className="bg-light p-4 rounded shadow-sm mb-4"
        >
          <div className="mb-3">
            <label className="form-label">Nome:</label>
            <input
              type="text"
              name="nome"
              value={produtoData.nome}
              onChange={handleChange}
              required
              className="form-control"
              placeholder="Digite o nome do produto"
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Descrição:</label>
            <textarea
              name="descricao"
              value={produtoData.descricao}
              onChange={handleChange}
              className="form-control"
              placeholder="Digite a descrição do produto"
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Preço:</label>
            <input
              type="number"
              name="preco"
              value={produtoData.preco}
              onChange={handleChange}
              required
              className="form-control"
              placeholder="Digite o preço do produto"
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Quantidade em Estoque:</label>
            <input
              type="number"
              name="quantidadeEstoque"
              value={produtoData.quantidadeEstoque}
              onChange={handleChange}
              required
              className="form-control"
              placeholder="Digite a quantidade em estoque"
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Tipo de Produto:</label>
            <input
              type="text"
              name="tipoProduto"
              value={produtoData.tipoProduto}
              onChange={handleChange}
              className="form-control"
              placeholder="Digite o tipo de produto"
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Categoria de Pesca:</label>
            <input
              type="text"
              name="categoriaPesca"
              value={produtoData.categoriaPesca}
              onChange={handleChange}
              className="form-control"
              placeholder="Digite a categoria de pesca"
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Fornecedor:</label>
            <select
              name="fornecedorId"
              value={produtoData.fornecedorId}
              onChange={handleChange}
              required
              className="form-select"
            >
              <option value="">Selecione um Fornecedor</option>
              {fornecedoresList.map((fornecedor) => (
                <option key={fornecedor.id} value={fornecedor.id}>
                  {fornecedor.nomeEmpresa}
                </option>
              ))}
            </select>
          </div>

          <button type="submit" className="btn btn-success w-100">
            {isEditing ? "Atualizar Produto" : "Salvar Produto"}
          </button>
        </form>
      )}

      <h3 className="text-center mt-4">Lista de Produtos</h3>
      {produtosList.length > 0 ? (
        <table className="table table-striped table-bordered mt-3">
          <thead className="table-dark">
            <tr>
              <th scope="col">Nome</th>
              <th scope="col">Descrição</th>
              <th scope="col">Preço</th>
              <th scope="col">Quantidade</th>
              <th scope="col">Tipo</th>
              <th scope="col">Categoria</th>
              <th scope="col">Fornecedor</th>
              <th scope="col">Ações</th>
            </tr>
          </thead>
          <tbody>
            {produtosList.map((produto) => (
              <tr key={produto.id}>
                <td>{produto.nome}</td>
                <td>{produto.descricao}</td>
                <td>R$ {produto.preco.toFixed(2)}</td>
                <td>{produto.quantidadeEstoque}</td>
                <td>{produto.tipoProduto}</td>
                <td>{produto.categoriaPesca}</td>
                <td>
                  {
                    fornecedoresList.find((f) => f.id === produto.fornecedorId)
                      ?.nomeEmpresa
                  }
                </td>
                <td>
                  <button
                    onClick={() => handleEdit(produto)}
                    className="btn btn-warning btn-sm me-2"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(produto.id)}
                    className="btn btn-danger btn-sm me-2"
                  >
                    Excluir
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="text-center mt-3">Nenhum produto cadastrado.</p>
      )}
    </div>
  );
};

export default Produtos;
