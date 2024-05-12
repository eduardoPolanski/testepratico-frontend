import React, { useState, useEffect } from "react";
import CustomerService from "../../service/customerService";
import { GetCustomerSchema } from "../../types/customers";
import Select from "react-select";
import RouterService from "../../service/routerService";
import IconClose from "../IconClose";

interface Props {
  showModal: boolean;
  onCloseModal: () => void;
  onAddRouter: () => void;
}

const AddRouterModal: React.FC<Props> = ({
  showModal,
  onCloseModal,
  onAddRouter,
}) => {
  const [formData, setFormData] = useState({
    addressIp: "",
    addressIpv6: "",
    brand: "",
    model: "",

    customerIds: [] as string[],
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [customers, setCustomers] = useState<GetCustomerSchema[]>([]);
  const customerService = new CustomerService();
  const routeService = new RouterService();

  // Função para buscar os clientes da API
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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleCustomerIdsChange = (selectedOptions: any) => {
    const selectedIds = selectedOptions.map((option: any) => option.value);
    setFormData((prevFormData) => ({
      ...prevFormData,
      customerIds: selectedIds,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      setIsLoading(true);
      setError(null);

      const { status, data } = await routeService.createRouter(formData);

      if (status === 200) {
        setFormData({
          addressIp: "",
          addressIpv6: "",
          brand: "",
          model: "",
          customerIds: [],
        });
        onCloseModal();
        alert("Roteador cadastrado com sucesso!");
        onAddRouter();
      } else if (status === 400) {
        setError(
          data.message || "Erro ao cadastrar roteador. Tente novamente."
        );
      } else if (status === 409) {
        setError(data.message || "Roteador já existe.");
      }
    } catch (error) {
      setError("Erro ao cadastrar roteador. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      {showModal && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div
            id="select-menu-portal"
            className="flex items-center justify-center min-h-screen"
          >
            <div className="fixed inset-0 bg-black opacity-50"></div>
            <div className="relative bg-white rounded-lg px-4 pt-5 pb-4 overflow-hidden shadow-xl sm:max-w-lg sm:w-full sm:p-6">
              <div className="absolute top-0 right-0 pt-2 pr-4">
                <button
                  onClick={onCloseModal}
                  className="text-gray-400 hover:text-gray-500 focus:outline-none"
                >
                  <span className="sr-only">Fechar</span>
                  <IconClose />
                </button>
              </div>
              <div className="sm:flex sm:items-start">
                <div className="w-full mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                  <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                    Adicionar Roteador
                  </h3>
                  {error && <div className="text-red-500">{error}</div>}
                  <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label
                          htmlFor="brand"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Marca
                        </label>
                        <input
                          type="text"
                          name="brand"
                          id="brand"
                          className="mt-1 bg-gray-200 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md px-2"
                          value={formData.brand}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="model"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Modelo
                        </label>
                        <input
                          type="text"
                          name="model"
                          id="model"
                          className="mt-1 bg-gray-200 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md px-2"
                          value={formData.model}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="addressIp"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Endereço IP
                        </label>
                        <input
                          type="text"
                          name="addressIp"
                          id="addressIp"
                          className="mt-1 bg-gray-200 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md px-2"
                          value={formData.addressIp}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="addressIpv6"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Endereço IPv6
                        </label>
                        <input
                          type="text"
                          name="addressIpv6"
                          id="addressIpv6"
                          className="mt-1 bg-gray-200 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md px-2"
                          value={formData.addressIpv6}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>
                    <div className="mt-2">
                      <label
                        htmlFor="customerIds"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Clientes Associados
                      </label>
                      <Select
                        isMulti
                        name="customerIds"
                        options={customers.map((customer) => ({
                          value: customer.id,
                          label: customer.fullName,
                        }))}
                        placeholder="Selecione os clientes"
                        onChange={handleCustomerIdsChange}
                        className="basic-multi-select rounded-xl"
                        classNamePrefix="select"
                        menuPlacement="auto"
                        menuShouldScrollIntoView={false}
                        menuPosition={"fixed"}
                        styles={{
                          control: (baseStyles, state) => ({
                            ...baseStyles,
                            borderRadius: "10px",
                            borderColor: state.isFocused
                              ? "#2563EB"
                              : baseStyles.borderColor,
                          }),
                        }}
                        menuPortalTarget={document.getElementById(
                          "select-menu-portal"
                        )}
                      />
                    </div>
                    <div className="flex justify-end gap-x-2 mt-4">
                      <button
                        className="inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 
                           bg-red-500 text-base font-medium text-white hover:bg-red-700 focus:outline-none 
                          focus:ring-2 focus:ring-offset-2 sm:text-sm"
                        disabled={isLoading}
                        onClick={onCloseModal}
                      >
                        Fechar
                      </button>
                      <button
                        type="submit"
                        className="inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 
                          bg-green-600 text-base font-medium text-white hover:bg-green-700
                          focus:outline-none focus:ring-2 focus:ring-offset-2 sm:text-sm"
                        disabled={isLoading}
                      >
                        {isLoading ? "Cadastrando..." : "Cadastrar"}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddRouterModal;
