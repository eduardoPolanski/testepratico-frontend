// Importe useState para controlar os clientes selecionados
import React, { useState, useEffect } from "react";
import RouterService from "../../service/routerService";

import Select from "react-select";
import { GetRoutersSchema, UpdateRoutersSchema } from "../../types/router";
import CustomerService from "../../service/customerService";
import { GetCustomerSchema } from "../../types/customers";
import IconClose from "../IconClose";

interface Props {
  showModal: boolean;
  onCloseModal: () => void;
  onUpdateRouter: () => void;
  router: GetRoutersSchema;
}

const UpdateRouterModal: React.FC<Props> = ({
  showModal,
  onCloseModal,
  onUpdateRouter,
  router,
}) => {
  const [formData, setFormData] = useState<Partial<UpdateRoutersSchema>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [customers, setCustomers] = useState<GetCustomerSchema[]>([]);
  const [selectedCustomers, setSelectedCustomers] = useState<
    { value: string; label: string }[]
  >([]);
  const customerService = new CustomerService();
  const routerService = new RouterService();

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

  useEffect(() => {
    setFormData(router);
    setSelectedCustomers(
      (router?.customer || []).map((customer) => ({
        value: String(customer.id),
        label: customer.fullName,
      }))
    ); // Defina os clientes selecionados inicialmente
  }, [router]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleCustomerChange = (selectedOptions: any) => {
    setSelectedCustomers(selectedOptions);
    setFormData((prevFormData) => ({
      ...prevFormData,
      customer: selectedOptions.map(
        (option: { value: string; label: string }) => ({
          id: option.value,
          fullName: option.label,
        })
      ),
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      setIsLoading(true);
      setError(null);

      const { status, data } = await routerService.updateRouter(
        formData,
        router.id
      );

      if (status === 204) {
        onCloseModal();
        alert("Roteador atualizado com sucesso!");
        onUpdateRouter();
      } else if (status === 400) {
        setError(
          data.message || "Erro ao atualizar roteador. Tente novamente."
        );
      } else if (status === 409) {
        alert(data.message);
        setError(data.message);
      }
    } catch (error) {
      setError("Erro ao atualizar roteador. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      {showModal && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen">
            <div className="fixed inset-0 bg-black opacity-50"></div>
            <div className="relative bg-white rounded-lg px-4 pt-5 pb-4 overflow-hidden shadow-xl sm:max-w-lg sm:w-full sm:p-6">
              <div className="absolute top-0 right-0 pt-2 pr-4">
                <button
                  onClick={onCloseModal}
                  className="text-gray-400 hover:text-gray-500 focus:outline-none"
                >
                  <IconClose />
                </button>
              </div>
              <div className="sm:flex sm:items-start">
                <div className="w-full mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                  <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                    Editar Roteador
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
                          value={formData?.brand || ""}
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
                          value={formData?.model || ""}
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
                          value={formData?.addressIp || ""}
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
                          value={formData?.addressIpv6 || ""}
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
                          value: String(customer.id),
                          label: customer.fullName,
                        }))}
                        value={selectedCustomers}
                        onChange={handleCustomerChange} // Lidar com alterações de seleção
                        placeholder="Selecione os clientes"
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
                      />
                    </div>
                    <div className="flex ">
                      <label className="flex items-center mt-6">
                        <input
                          type="checkbox"
                          name="status"
                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                          checked={!formData?.inactive}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              inactive: !formData?.inactive,
                            })
                          }
                        />
                        <span className="ml-2 text-sm text-gray-600">
                          {!formData?.inactive ? "Ativo" : "Inativo"}
                        </span>
                      </label>
                    </div>
                    <div className="flex justify-end gap-x-2 mt-4">
                      <button
                        className="inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 
                           bg-red-500 text-base font-medium text-white hover:bg-red-700 focus:outline-none 
                          focus:ring-2 focus:ring-offset-2 sm:text-sm"
                        disabled={isLoading}
                        onClick={onCloseModal}
                      >
                        Cancelar
                      </button>
                      <button
                        type="submit"
                        className="inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 
                          bg-green-600 text-base font-medium text-white hover:bg-green-700
                          focus:outline-none focus:ring-2 focus:ring-offset-2 sm:text-sm"
                        disabled={isLoading}
                      >
                        {isLoading ? "Salvando..." : "Salvar"}
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

export default UpdateRouterModal;
