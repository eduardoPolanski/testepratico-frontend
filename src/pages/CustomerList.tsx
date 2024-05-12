import React, { useEffect, useState } from "react";
import CustomerService from "../service/customerService";
import { GetCustomerSchema } from "../types/customers";
import CustomerModal from "../components/CustomerModals/CustomerModal";
import SearchInput from "../components/SearchInput";
import AddCustomerModal from "../components/CustomerModals/AddCustomerModal";
import CustomerDeleteModal from "../components/CustomerModals/DeleteCustomerModal";
import CustomerUpdateModal from "../components/CustomerModals/UpdateCustomerModal";
import { formatCNPJ, formatCPF } from "../lib/utils";

const CustomerList: React.FC = () => {
  const [customers, setCustomers] = useState<GetCustomerSchema[]>([]);
  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [showAddCustomerModal, setShowAddCustomerModal] = useState(false);
  const [showDeleteCustomerModal, setShowDeleteCustomerModal] = useState(false);
  const [showUpdateCustomerModal, setShowUpdateCustomerModal] = useState(false);
  const [customer, setCustomer] = useState<GetCustomerSchema | null>(null);
  const [searchText, setSearchText] = useState<string>("");
  const customerService = new CustomerService();

  const openCustomerModal = (customer: GetCustomerSchema) => {
    setCustomer(customer);
    setShowCustomerModal(true);
  };

  const closeCustomerModal = () => {
    setShowCustomerModal(false);
  };

  const openAddCustomerModal = () => {
    setShowAddCustomerModal(true);
  };

  const closeAddCustomerModal = () => {
    setShowAddCustomerModal(false);
  };

  const openDeleteModal = (customer: GetCustomerSchema) => {
    setCustomer(customer);
    setShowDeleteCustomerModal(true);
  };

  const closeDeleteModal = () => {
    setShowDeleteCustomerModal(false);
  };

  const openUpdateModal = (customer: GetCustomerSchema) => {
    setCustomer(customer);
    setShowUpdateCustomerModal(true);
  };

  const closeUpdateModal = () => {
    setShowUpdateCustomerModal(false);
  };

  const getCustomers = async () => {
    try {
      const { data, status } = await customerService.getCustomer();
      if (status !== 200) {
        throw new Error("Falha ao buscar clientes");
      }
      setCustomers(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getCustomers();
  }, []);

  // Função para filtrar os clientes com base no texto da pesquisa
  const filteredCustomers =
    customers?.filter((customer) =>
      customer.fullName.toLowerCase().includes(searchText.toLowerCase())
    );
  return (
    <div className="">
      <div className="flex items-center justify-between py-2">
        <button
          className="inline-flex justify-center rounded-md border border-transparent shadow-sm px-2 sm:px-4 py-2 
          bg-green-600  font-medium text-white hover:bg-green-700 focus:outline-none 
         focus:ring-2 focus:ring-offset-2 text-sm"
          onClick={openAddCustomerModal}
        >
          Adicionar cliente
        </button>
        <SearchInput
          placeholder="Pesquisar clientes..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
      </div>
      <h1 className="text-2xl font-bold mb-4">Lista de Clientes</h1>
      <ul>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3  gap-4">
          {filteredCustomers?.length > 0 ? (
            filteredCustomers.map((customer) => (
              <div
                key={customer.id}
                className="flex flex-col justify-between border border-gray-300 p-4 rounded-md"
              >
                <div className="flex items-center gap-x-2 ">
                  {!customer.inactive ? (
                    <span
                      className="inline-flex h-max items-center rounded-xl bg-green-100/80 px-2 py-1 text-xs 
                    font-medium text-green-700 ring-1 ring-inset ring-green-600/20"
                    >
                      Ativo
                    </span>
                  ) : (
                    <span
                      className="inline-flex items-center rounded-md bg-red-100/bg-green-100/80 px-2 py-1 text-xs 
                    font-medium text-red-700 ring-1 ring-inset ring-red-600/10"
                    >
                      Inativo
                    </span>
                  )}
                  <h2 className="font-semibold text-2xl mb-2">
                    {customer.fullName}
                  </h2>
                </div>

                <p className="text-lg text-gray-600">
                  {customer.accountType === "PF" ? (
                    <span>CPF: {formatCPF(customer?.cpf)}</span>
                  ) : (
                    <span>CNPJ: {formatCNPJ(customer?.cnpj)}</span>
                  )}
                </p>

                <h1 className="text-lg font-semibold text-gray-800 mt-2">
                  Roteador
                </h1>
                {customer.router ? (
                  <div>
                    <p className="text-lg text-gray-600">
                      Marca: <span>{customer.router.brand}</span>
                    </p>
                    <p className="text-lg text-gray-600">
                      Modelo: <span>{customer.router.model}</span>
                    </p>
                  </div>
                ) : (
                  <p>Nenhum roteador cadastrado</p>
                )}

                <div className="flex justify-between items-center mt-4">
                  <button
                    className="inline-flex justify-center rounded-md border border-transparent shadow-sm px-2 sm:px-4 py-2 
                    bg-green-600  font-medium text-white hover:bg-green-700 focus:outline-none 
                   focus:ring-2 focus:ring-offset-2 text-sm"
                    onClick={() => openCustomerModal(customer)}
                  >
                    Ver mais
                  </button>
                  <div className="flex items-center gap-x-2">
                    <button
                      className="inline-flex justify-center rounded-md border border-transparent shadow-sm px-2 sm:px-4 py-2 
                      bg-blue-500  font-medium text-white hover:bg-blue-700 focus:outline-none 
                     focus:ring-2 focus:ring-offset-2 text-sm"
                      onClick={() => openUpdateModal(customer)}
                    >
                      Editar
                    </button>
                    <button
                      className="inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 
                      bg-red-500 font-medium text-white hover:bg-red-700 focus:outline-none 
                     focus:ring-2 focus:ring-offset-2 text-sm"
                      onClick={() => openDeleteModal(customer)}
                    >
                      Excluir
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div>Nenhum cliente cadastrado</div>
          )}
        </div>
      </ul>

      <CustomerModal
        showModal={showCustomerModal}
        onCloseModal={closeCustomerModal}
        customer={customer}
      />

      <AddCustomerModal
        showModal={showAddCustomerModal}
        onCloseModal={closeAddCustomerModal}
        onAddCustomer={() => {
          getCustomers();
          closeAddCustomerModal();
        }}
      />

      <CustomerDeleteModal
        showModal={showDeleteCustomerModal}
        onCloseModal={closeDeleteModal}
        customer={customer}
        onDeleteCustomer={() => {
          getCustomers();
          closeDeleteModal();
        }}
      />

      <CustomerUpdateModal
        showModal={showUpdateCustomerModal}
        customer={customer}
        onCloseModal={closeUpdateModal}
        onUpdateCustomer={() => {
          getCustomers();
          closeDeleteModal();
        }}
      />
    </div>
  );
};

export default CustomerList;
