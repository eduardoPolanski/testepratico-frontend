import React, { useState } from "react";
import { GetCustomerSchema } from "../../types/customers";
import CustomerService from "../../service/customerService";
import { set, setErrorMap } from "zod";

interface DeleteModalProps {
  showModal: boolean;
  onCloseModal: () => void;
  customer: GetCustomerSchema | null;
  onDeleteCustomer: () => void; // Função para chamar quando o cliente for excluído com sucesso
}

const DeleteCustomerModal: React.FC<DeleteModalProps> = ({
  showModal,
  onCloseModal,
  customer,
  onDeleteCustomer,
}) => {
  const customerService = new CustomerService();
  const [error, setError] = useState<string | null>(null);

  const handleDeleteCustomer = async () => {
    if (customer) {
      try {
        const { status, data } = await customerService.deleteCustomer(
          customer.id
        );
        if (status === 204) {
          onDeleteCustomer();
          alert("Cliente excluído com sucesso!");
          onCloseModal();
          setError(null);
        } else if (status === 400) {
          alert(data.message);
          setError(data.message);
        } else if (status === 409) {
          alert(data.message);
          setError(data.message);
        }
      } catch (error) {
        alert("Erro ao excluir cliente. Tente novamente.");
      }
    }
  };
  return (
    <div
      className={`modal ${
        showModal ? "block" : "hidden"
      } fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center z-50`}
    >
      <div className="modal-content bg-white p-8 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Confirmação de Exclusão</h2>
        {error && <div className="text-red-500">{error}</div>}
        <p>
          Tem certeza que deseja excluir o cliente{" "}
          <span className="font-semibold">{customer?.fullName}</span>?
        </p>
        <p className="text-sm text-gray-500 mt-2">
          Esta ação não pode ser desfeita.
        </p>
        <div className="flex justify-end mt-8">
          <button
            onClick={onCloseModal}
            className="mr-4 bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded-md"
          >
            Cancelar
          </button>
          <button
            onClick={handleDeleteCustomer}
            className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-md"
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteCustomerModal;
