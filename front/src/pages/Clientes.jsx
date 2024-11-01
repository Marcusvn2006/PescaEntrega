import { useState, useEffect } from "react";
import api from "../Services/api";
import "../App.css"; // Adicione um arquivo CSS para estilos personalizados

const Clientes = () => {
  const [clienteData, setClienteData] = useState({
    nome: "",
    cpf: "",
    email: "",
    telefone: "",
  });
  const [isFormVisible, setFormVisible] = useState(false);
  const [clientesList, setClientesList] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    const fetchClientes = async () => {
      try {
        const response = await api.get("/Clientes");
        setClientesList(response.data);
      } catch (error) {
        console.error("Erro ao buscar clientes:", error.response ? error.response.data : error.message);
      }
    };

    fetchClientes();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setClienteData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (isEditing) {
        await api.put(`/Clientes/${editingId}`, clienteData);
        setIsEditing(false);
        setEditingId(null);
      } else {
        await api.post("/Clientes", clienteData);
      }

      setClienteData({ nome: "", cpf: "", email: "", telefone: "" });
      setFormVisible(false);
      const response = await api.get("/Clientes");
      setClientesList(response.data);
    } catch (error) {
      console.error("Erro ao salvar cliente:", error.response ? error.response.data : error.message);
    }
  };

  const toggleForm = () => {
    setFormVisible(!isFormVisible);
    setIsEditing(false);
    setEditingId(null);
    setClienteData({ nome: "", cpf: "", email: "", telefone: "" });
  };

  const handleEdit = (cliente) => {
    setClienteData(cliente);
    setIsEditing(true);
    setEditingId(cliente.id);
    setFormVisible(true);
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/Clientes/${id}`);
      setClientesList(clientesList.filter((cliente) => cliente.id !== id));
    } catch (error) {
      console.error("Erro ao excluir cliente:", error.response ? error.response.data : error.message);
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4 text-primary">Gerenciamento de Clientes</h2>
      
      <button onClick={toggleForm} className="btn btn-info btn-sm mb-3">
        {isFormVisible ? "Fechar Formulário" : "Novo Cliente"}
      </button>

      {isFormVisible && (
        <form onSubmit={handleSubmit} className="bg-light p-4 rounded shadow-sm mb-4">
          <div className="mb-3">
            <label className="form-label">Nome:</label>
            <input
              type="text"
              name="nome"
              value={clienteData.nome}
              onChange={handleChange}
              required
              className="form-control"
              placeholder="Digite o nome do cliente"
            />
          </div>

          <div className="mb-3">
            <label className="form-label">CPF:</label>
            <input
              type="text"
              name="cpf"
              value={clienteData.cpf}
              onChange={handleChange}
              required
              className="form-control"
              placeholder="Digite o CPF do cliente"
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Email:</label>
            <input
              type="email"
              name="email"
              value={clienteData.email}
              onChange={handleChange}
              required
              className="form-control"
              placeholder="Digite o email do cliente"
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Telefone:</label>
            <input
              type="tel"
              name="telefone"
              value={clienteData.telefone}
              onChange={handleChange}
              required
              className="form-control"
              placeholder="Digite o telefone do cliente"
            />
          </div>

          <button type="submit" className="btn btn-success w-100">
            {isEditing ? "Atualizar Cliente" : "Salvar Cliente"}
          </button>
        </form>
      )}

      <h3 className="text-center mt-4 text-secondary">Lista de Clientes</h3>
      {clientesList.length > 0 ? (
        <table className="table table-striped table-hover mt-3">
          <thead className="table-dark">
            <tr>
              <th scope="col">Nome</th>
              <th scope="col">CPF</th>
              <th scope="col">Email</th>
              <th scope="col">Telefone</th>
              <th scope="col">Ações</th>
            </tr>
          </thead>
          <tbody>
            {clientesList.map((cliente) => (
              <tr key={cliente.id} className="table-row">
                <td>{cliente.nome}</td>
                <td>{cliente.cpf}</td>
                <td>{cliente.email}</td>
                <td>{cliente.telefone}</td>
                <td>
                  <button
                    onClick={() => handleEdit(cliente)}
                    className="btn btn-warning btn-sm me-2"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(cliente.id)}
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
        <p className="text-center mt-3">Nenhum cliente cadastrado.</p>
      )}
    </div>
  );
};

export default Clientes;
