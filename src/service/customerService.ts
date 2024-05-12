import { api } from "../lib/api";
import { getErrorMessage, reportError } from "../lib/error";

import { isAxiosError } from "axios";
import { GetCustomerSchema } from "../types/customers";

class CustomerService {
  async getCustomer() {
    try {
      const { data, status } = await api.get<GetCustomerSchema>("/customers");

      return { data, status };
    } catch (error) {
      if (isAxiosError(error)) {
        return error.response;
      }
      reportError({ message: getErrorMessage(error) });
    }
  }

  async createCustomer(createCustomer) {
    try {
      // Prepara os dados para enviar para a API
      if (createCustomer.accountType === "PF") {
        createCustomer.cnpj = undefined;
      } else {
        createCustomer.cpf = undefined;
      }
      const { data, status } = await api.post("/customers", createCustomer);

      return { data, status };
    } catch (error) {
      if (isAxiosError(error)) {
        return error.response;
      }
      reportError({ message: getErrorMessage(error) });
    }
  }

  async updateCustomer(customerId: number, updateCustomer) {
    try {
      // Prepara os dados para enviar para a API
      if (updateCustomer.accountType === "PF") {
        updateCustomer.cnpj = undefined;
      } else {
        updateCustomer.cpf = undefined;
      }
      updateCustomer.id = undefined;
      updateCustomer.createdAt = undefined;
      updateCustomer.updatedAt = undefined;
      updateCustomer.router = undefined;
      updateCustomer.routerId = undefined;
      const { data, status } = await api.put(
        `/customers/${customerId}`,
        updateCustomer
      );

      return { data, status };
    } catch (error) {
      if (isAxiosError(error)) {
        return error.response;
      }
      reportError({ message: getErrorMessage(error) });
    }
  }

  async deleteCustomer(customerId: number) {
    try {
      const { data, status } = await api.delete(`/customers/${customerId}`);

      return { data, status };
    } catch (error) {
      if (isAxiosError(error)) {
        return error.response;
      }
      reportError({ message: getErrorMessage(error) });
    }
  }
}

export default CustomerService;
