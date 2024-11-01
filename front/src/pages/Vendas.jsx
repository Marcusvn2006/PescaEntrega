import { useState, useEffect } from "react";
import api from "../Services/api";

const Clientes = () => {
  const [vendaData, setVendaData] = useState({
    dataEmissao: "",
    valorTotal: 0,
    clienteId: "",
  });
  const [clientesList, setClientesList] = useState([]);
  const [isFormVisible, setFormVisible] = useState(false);
  const [vendasList, setVendasList] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    const fetchClientes = async () => {
      try {
        const response = await api.get("/Clientes");
        setClientesList(response.data);
      } catch (error) {
        console.error("Erro ao buscar clientes:", error);
      }
    };

    const fetchVendas = async () => {
      try {
        const response = await api.get("/Vendas");
        setVendasList(response.data);
      } catch (error) {
        console.error("Erro ao buscar vendas:", error);
      }
    };

    fetchClientes();
    fetchVendas();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setVendaData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (isEditing) {
        await api.put(`/Vendas/${editingId}`, vendaData);
        setIsEditing(false);
        setEditingId(null);
      } else {
        await api.post("/Vendas", vendaData);
      }

      setVendaData({ dataEmissao: "", valorTotal: 0, clienteId: "" });
      setFormVisible(false);
      const response = await api.get("/Vendas");
      setVendasList(response.data);
    } catch (error) {
      console.error("Erro ao salvar venda:", error);
    }
  };

  const toggleForm = () => {
    setFormVisible(!isFormVisible);
    setIsEditing(false);
    setEditingId(null);
    setVendaData({ dataEmissao: "", valorTotal: 0, clienteId: "" });
  };

  const handleEdit = (venda) => {
    setVendaData(venda);
    setIsEditing(true);
    setEditingId(venda.id);
    setFormVisible(true);
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/Vendas/${id}`);
      setVendasList(vendasList.filter((venda) => venda.id !== id));
    } catch (error) {
      console.error("Erro ao excluir venda:", error);
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">Gerenciamento de Vendas</h2>

      <button onClick={toggleForm} className="btn btn-primary w-100 mb-3">
        {isFormVisible ? "Fechar Formulário" : "Nova Venda"}
      </button>

      {isFormVisible && (
        <form onSubmit={handleSubmit} className="bg-light p-4 rounded shadow-sm mb-4">
          <div className="mb-3">
            <label className="form-label">Data de Emissão:</label>
            <input
              type="datetime-local"
              name="dataEmissao"
              value={vendaData.dataEmissao}
              onChange={handleChange}
              required
              className="form-control"
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Valor Total:</label>
            <input
              type="number"
              name="valorTotal"
              value={vendaData.valorTotal}
              onChange={handleChange}
              required
              className="form-control"
              placeholder="Digite o valor total"
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Cliente:</label>
            <select
              name="clienteId"
              value={vendaData.clienteId}
              onChange={handleChange}
              required
              className="form-select"
            >
              <option value="">Selecione um Cliente</option>
              {clientesList.map((cliente) => (
                <option key={cliente.id} value={cliente.id}>
                  {cliente.nome}
                </option>
              ))}
            </select>
          </div>

          <button type="submit" className="btn btn-success w-100">
            {isEditing ? "Atualizar Venda" : "Salvar Venda"}
          </button>
        </form>
      )}

      <h3 className="text-center mt-4">Lista de Vendas</h3>
      {vendasList.length > 0 ? (
        <table className="table table-striped table-bordered mt-3">
          <thead className="table-dark">
            <tr>
              <th scope="col">Data de Emissão</th>
              <th scope="col">Valor Total</th>
              <th scope="col">Cliente</th>
              <th scope="col">Ações</th>
            </tr>
          </thead>
          <tbody>
            {vendasList.map((venda) => (
              <tr key={venda.id}>
                <td>{new Date(venda.dataEmissao).toLocaleString()}</td>
                <td>R$ {venda.valorTotal.toFixed(2)}</td>
                <td>{clientesList.find((c) => c.id === venda.clienteId)?.nome}</td>
                <td>
                  <button
                    onClick={() => handleEdit(venda)}
                    className="btn btn-warning btn-sm me-2"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(venda.id)}
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
        <p className="text-center mt-3">Nenhuma venda cadastrada.</p>
      )}
    </div>
  );
};

export default Clientes;
