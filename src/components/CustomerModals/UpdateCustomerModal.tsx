import React, { useEffect, useState } from "react";
import CustomerService from "../../service/customerService";
import { GetCustomerSchema } from "../../types/customers";
import { formatCNPJ, formatCPF, unformatCPFOrCNPJ } from "../../lib/utils";
import IconClose from "../IconClose";
import ViaCepService from "../../service/viaCepService";

interface Props {
  showModal: boolean;
  onCloseModal: () => void;
  onUpdateCustomer: () => void;
  customer: GetCustomerSchema;
}

const UpdateCustomerModal: React.FC<Props> = ({
  showModal,
  onCloseModal,
  onUpdateCustomer,
  customer,
}) => {
  const [formData, setFormData] = useState<GetCustomerSchema | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const viaApiService = new ViaCepService();

  useEffect(() => {
    setFormData(customer);
  }, [customer]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    let updatedValue = value;

    // Verifica se o campo é CPF ou CNPJ e formata automaticamente
    if (name === "cpf") {
      updatedValue = formatCPF(value);
    } else if (name === "cnpj") {
      updatedValue = formatCNPJ(value);
    }

    if (formData) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: updatedValue,
      }));
    }
  };

  const handleCEPChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const cep = e.target.value;
    setFormData((prevFormData) => ({
      ...prevFormData,
      cep,
    }));
    try {
      const { data, status } = await viaApiService.getCep(cep);

      if (status === 200)
        setFormData((prevFormData) => ({
          ...prevFormData,
          street: data.logradouro,
          district: data.bairro,
          city: data.localidade,
        }));
    } catch (error) {
      console.error("Erro ao buscar CEP:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const customerService = new CustomerService();
      setIsLoading(true);
      setError(null);

      if (formData) {
        const params = {
          ...formData,
          cpf:
            formData.accountType === "PF"
              ? unformatCPFOrCNPJ(formData.cpf)
              : undefined,
          cnpj:
            formData.accountType === "PJ"
              ? unformatCPFOrCNPJ(formData.cnpj)
              : undefined,
        };
        const { status, data } = await customerService.updateCustomer(
          formData.id,
          params
        );

        if (status === 200) {
          onCloseModal();
          onUpdateCustomer();
          alert("Cliente atualizado com sucesso!");
        } else if (status === 400) {
          alert(data.message);
          setError("Erro ao cadastrar cliente. Por favor, tente novamente.");
        } else if (status === 409) {
          alert(data.message);
        }
      }
    } catch (error) {
      console.error(error);
      setError("Erro ao atualizar cliente. Por favor, tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {showModal && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen">
            <div
              className="fixed inset-0 bg-black opacity-50"
              onClick={onCloseModal}
            ></div>
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
                    Atualizar Cliente
                  </h3>
                  {error && <div className="text-red-500">{error}</div>}
                  {formData && (
                    <form onSubmit={handleSubmit}>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label
                            htmlFor="fullName"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Nome Completo
                          </label>
                          <input
                            type="text"
                            name="fullName"
                            id="fullName"
                            className="mt-1 bg-gray-200 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md px-2"
                            value={formData.fullName}
                            onChange={handleChange}
                            required
                          />
                        </div>
                        <div>
                          <label
                            htmlFor="accountType"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Tipo de Conta
                          </label>
                          <select
                            id="accountType"
                            name="accountType"
                            className="mt-1 bg-gray-200 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md px-2"
                            value={formData.accountType}
                            onChange={handleChange}
                            required
                          >
                            <option value="PF">Pessoa Física</option>
                            <option value="PJ">Pessoa Jurídica</option>
                          </select>
                        </div>
                        {formData.accountType === "PF" ? (
                          <>
                            <div>
                              <label
                                htmlFor="cpf"
                                className="block text-sm font-medium text-gray-700"
                              >
                                CPF
                              </label>
                              <input
                                type="text"
                                name="cpf"
                                id="cpf"
                                className="mt-1 bg-gray-200 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md px-2"
                                value={formatCPF(formData.cpf)}
                                onChange={handleChange}
                                required
                              />
                            </div>
                            <div className="hidden">
                              <label
                                htmlFor="cnpj"
                                className="block text-sm font-medium text-gray-700"
                              >
                                CNPJ
                              </label>
                              <input
                                type="text"
                                name="cnpj"
                                id="cnpj"
                                className="mt-1 bg-gray-200 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md px-2"
                                value={formatCNPJ(formData.cnpj)}
                                onChange={handleChange}
                              />
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="hidden">
                              <label
                                htmlFor="cpf"
                                className="block text-sm font-medium text-gray-700"
                              >
                                CPF
                              </label>
                              <input
                                type="text"
                                name="cpf"
                                id="cpf"
                                className="mt-1 bg-gray-200 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md px-2"
                                value={formData.cpf}
                                onChange={handleChange}
                              />
                            </div>
                            <div>
                              <label
                                htmlFor="cnpj"
                                className="block text-sm font-medium text-gray-700"
                              >
                                CNPJ
                              </label>
                              <input
                                type="text"
                                name="cnpj"
                                id="cnpj"
                                className="mt-1 bg-gray-200 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md px-2"
                                value={formData.cnpj}
                                onChange={handleChange}
                                required
                              />
                            </div>
                          </>
                        )}
                        <div>
                          <label
                            htmlFor="birth"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Data de Nascimento
                          </label>
                          <input
                            type="date"
                            name="birth"
                            id="birth"
                            className="mt-1 bg-gray-200 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md px-2"
                            value={
                              formData.birth
                                ? new Date(formData.birth)
                                    .toISOString()
                                    .split("T")[0]
                                : ""
                            }
                            onChange={handleChange}
                            required
                          />
                        </div>
                        <div>
                          <label
                            htmlFor="cep"
                            className="block text-sm font-medium text-gray-700"
                          >
                            CEP
                          </label>
                          <input
                            type="text"
                            name="cep"
                            id="cep"
                            className="mt-1 bg-gray-200 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md px-2"
                            value={formData.cep}
                            onChange={handleCEPChange}
                            required
                          />
                        </div>
                        <div>
                          <label
                            htmlFor="street"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Rua
                          </label>
                          <input
                            type="text"
                            name="street"
                            id="street"
                            className="mt-1 bg-gray-200 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md px-2"
                            value={formData.street}
                            onChange={handleChange}
                            required
                          />
                        </div>
                        <div>
                          <label
                            htmlFor="number"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Número
                          </label>
                          <input
                            type="text"
                            name="number"
                            id="number"
                            className="mt-1 bg-gray-200 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md px-2"
                            value={formData.number}
                            onChange={handleChange}
                            required
                          />
                        </div>
                        <div>
                          <label
                            htmlFor="district"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Bairro
                          </label>
                          <input
                            type="text"
                            name="district"
                            id="district"
                            className="mt-1 bg-gray-200 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md px-2"
                            value={formData.district}
                            onChange={handleChange}
                            required
                          />
                        </div>
                        <div>
                          <label
                            htmlFor="city"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Cidade
                          </label>
                          <input
                            type="text"
                            name="city"
                            id="city"
                            className="mt-1 bg-gray-200 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md px-2"
                            value={formData.city}
                            onChange={handleChange}
                            required
                          />
                        </div>
                        <div className="flex justify-center">
                          <label className="flex items-center mt-6">
                            <input
                              type="checkbox"
                              name="status"
                              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                              checked={!formData.inactive}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  inactive: !formData.inactive,
                                })
                              }
                            />
                            <span className="ml-2 text-sm text-gray-600">
                              {!formData.inactive ? "Ativo" : "Inativo"}
                            </span>
                          </label>
                        </div>
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
                          {isLoading ? "Atualizando..." : "Atualizar"}
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default UpdateCustomerModal;
