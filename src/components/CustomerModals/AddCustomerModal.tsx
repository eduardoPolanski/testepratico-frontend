import React, { useState } from "react";
import CustomerService from "../../service/customerService";
import { formatCPF, formatCNPJ, unformatCPFOrCNPJ } from "../../lib/utils";
import IconClose from "../IconClose";
import ViaCepService from "../../service/viaCepService";

interface Props {
  showModal: boolean;
  onCloseModal: () => void;
  onAddCustomer: () => void;
}

const AddCustomerModal: React.FC<Props> = ({
  showModal,
  onCloseModal,
  onAddCustomer,
}) => {
  const [formData, setFormData] = useState({
    fullName: "",
    cpf: "",
    cnpj: "",
    accountType: "PF",
    birth: "",
    street: "",
    number: "",
    cep: "",
    district: "",
    city: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const viaApiService = new ViaCepService();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    // Formata CPF ou CNPJ automaticamente enquanto o usuário digita
    let formattedValue = value;
    if (name === "cpf") {
      formattedValue = formatCPF(value);
    } else if (name === "cnpj") {
      formattedValue = formatCNPJ(value);
    }

    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: formattedValue,
    }));
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
      setIsLoading(true);
      setError(null);

      const customerService = new CustomerService();

      // Remove as pontuações do CPF ou CNPJ antes de enviar para a API
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

      const { status, data } = await customerService.createCustomer(params);

      if (status === 200) {
        setFormData({
          fullName: "",
          accountType: "PF",
          cpf: "",
          cnpj: "",
          birth: "",
          cep: "",
          street: "",
          number: "",
          district: "",
          city: "",
        });
        onCloseModal();
        alert("Cliente cadastrado com sucesso!");
        onAddCustomer();
      } else if (status === 400) {
        setError(data.message || "Erro ao cadastrar cliente. Tente novamente.");
      } else if (status === 409) {
        setError(data.message);
      }
    } catch (error) {
      setError("Erro ao cadastrar cliente. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
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
                  <span className="sr-only">Fechar</span>
                  <IconClose />
                </button>
              </div>
              <div className="sm:flex sm:items-start">
                <div className="w-full mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                  <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                    Adicionar Cliente
                  </h3>
                  {error && <div className="text-red-500">{error}</div>}
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
                            value={formData.cpf}
                            onChange={handleChange}
                            required
                          />
                        </div>
                      ) : (
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
                          value={formData.birth}
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
                          className="block text-sm font-medium text-gray-700 "
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
    </>
  );
};

export default AddCustomerModal;
