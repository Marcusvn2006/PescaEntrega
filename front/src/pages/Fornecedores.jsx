import { useState, useEffect } from "react";
import api from "../Services/api";

const Fornecedores = () => {
  const [fornecedorData, setFornecedorData] = useState({
    nomeEmpresa: "",
    cnpj: "",
    endereco: "",
    telefone: "",
    email: "",
    tipoProdutosFornecidos: "",
    regiaoAtuacao: "",
  });
  
  const [fornecedoresList, setFornecedoresList] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [isFormVisible, setFormVisible] = useState(false);

  useEffect(() => {
    const fetchFornecedores = async () => {
      try {
        const response = await api.get("/Fornecedors");
        setFornecedoresList(response.data);
      } catch (error) {
        console.error("Erro ao buscar fornecedores:", error.response ? error.response.data : error.message);
      }
    };

    fetchFornecedores();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFornecedorData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await api.put(`/Fornecedors/${editingId}`, fornecedorData);
        setIsEditing(false);
        setEditingId(null);
      } else {
        await api.post("/Fornecedors", fornecedorData);
      }

      setFornecedorData({
        nomeEmpresa: "",
        cnpj: "",
        endereco: "",
        telefone: "",
        email: "",
        tipoProdutosFornecidos: "",
        regiaoAtuacao: "",
      });
      setFormVisible(false);

      const response = await api.get("/Fornecedors");
      setFornecedoresList(response.data);
    } catch (error) {
      console.error("Erro ao salvar fornecedor:", error.response ? error.response.data : error.message);
    }
  };

  const toggleForm = () => {
    setFormVisible(!isFormVisible);
    setIsEditing(false);
    setEditingId(null);
    setFornecedorData({
      nomeEmpresa: "",
      cnpj: "",
      endereco: "",
      telefone: "",
      email: "",
      tipoProdutosFornecidos: "",
      regiaoAtuacao: "",
    });
  };

  const handleEdit = (fornecedor) => {
    setFornecedorData(fornecedor);
    setIsEditing(true);
    setEditingId(fornecedor.id);
    setFormVisible(true);
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/Fornecedors/${id}`);
      setFornecedoresList(fornecedoresList.filter((fornecedor) => fornecedor.id !== id));
    } catch (error) {
      console.error("Erro ao excluir fornecedor:", error.response ? error.response.data : error.message);
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">Gerenciamento de Fornecedores</h2>
      
      <button onClick={toggleForm} className="btn btn-primary w-100 mb-3">
        {isFormVisible ? "Fechar Formulário" : "Novo Fornecedor"}
      </button>

      {isFormVisible && (
        <form onSubmit={handleSubmit} className="bg-light p-4 rounded shadow-sm mb-4">
          <div className="mb-3">
            <label className="form-label">Nome da Empresa:</label>
            <input
              type="text"
              name="nomeEmpresa"
              value={fornecedorData.nomeEmpresa}
              onChange={handleChange}
              required
              className="form-control"
              placeholder="Digite o nome da empresa"
            />
          </div>

          <div className="mb-3">
            <label className="form-label">CNPJ:</label>
            <input
              type="text"
              name="cnpj"
              value={fornecedorData.cnpj}
              onChange={handleChange}
              required
              className="form-control"
              placeholder="Digite o CNPJ do fornecedor"
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Endereço:</label>
            <input
              type="text"
              name="endereco"
              value={fornecedorData.endereco}
              onChange={handleChange}
              required
              className="form-control"
              placeholder="Digite o endereço do fornecedor"
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Telefone:</label>
            <input
              type="tel"
              name="telefone"
              value={fornecedorData.telefone}
              onChange={handleChange}
              required
              className="form-control"
              placeholder="Digite o telefone do fornecedor"
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Email:</label>
            <input
              type="email"
              name="email"
              value={fornecedorData.email}
              onChange={handleChange}
              required
              className="form-control"
              placeholder="Digite o email do fornecedor"
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Tipo de Produtos Fornecidos:</label>
            <input
              type="text"
              name="tipoProdutosFornecidos"
              value={fornecedorData.tipoProdutosFornecidos}
              onChange={handleChange}
              required
              className="form-control"
              placeholder="Digite o tipo de produtos fornecidos"
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Região de Atuação:</label>
            <input
              type="text"
              name="regiaoAtuacao"
              value={fornecedorData.regiaoAtuacao}
              onChange={handleChange}
              required
              className="form-control"
              placeholder="Digite a região de atuação"
            />
          </div>

          <button type="submit" className="btn btn-success w-100">
            {isEditing ? "Atualizar Fornecedor" : "Salvar Fornecedor"}
          </button>
        </form>
      )}

      <h3 className="text-center mt-4">Lista de Fornecedores</h3>
      {fornecedoresList.length > 0 ? (
        <table className="table table-striped table-bordered mt-3">
          <thead className="table-dark">
            <tr>
              <th scope="col">Nome da Empresa</th>
              <th scope="col">CNPJ</th>
              <th scope="col">Endereço</th>
              <th scope="col">Telefone</th>
              <th scope="col">Email</th>
              <th scope="col">Tipo de Produtos</th>
              <th scope="col">Região de Atuação</th>
              <th scope="col">Ações</th>
            </tr>
          </thead>
          <tbody>
            {fornecedoresList.map((fornecedor) => (
              <tr key={fornecedor.id}>
                <td>{fornecedor.nomeEmpresa}</td>
                <td>{fornecedor.cnpj}</td>
                <td>{fornecedor.endereco}</td>
                <td>{fornecedor.telefone}</td>
                <td>{fornecedor.email}</td>
                <td>{fornecedor.tipoProdutosFornecidos}</td>
                <td>{fornecedor.regiaoAtuacao}</td>
                <td>
                  <button
                    onClick={() => handleEdit(fornecedor)}
                    className="btn btn-warning btn-sm me-2"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(fornecedor.id)}
                    className="btn btn-danger btn-sm"
                  >
                    Excluir
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="text-center mt-3">Nenhum fornecedor cadastrado.</p>
      )}
    </div>
  );
};

export default Fornecedores;
