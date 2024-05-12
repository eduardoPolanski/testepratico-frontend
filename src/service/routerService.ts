import { api } from "../lib/api";
import { getErrorMessage, reportError } from "../lib/error";

import { isAxiosError } from "axios";
import { UpdateRoutersSchema } from "../types/router";

class RouterService {
  async getRouter() {
    try {
      const { data, status } = await api.get("/routers");

      return { data, status };
    } catch (error) {
      if (isAxiosError(error)) {
        return error.response;
      }
      reportError({ message: getErrorMessage(error) });
    }
  }

  async createRouter(routerData) {
    try {
      const { data, status } = await api.post("/routers", routerData);

      return { data, status };
    } catch (error) {
      if (isAxiosError(error)) {
        return error.response;
      }
      reportError({ message: getErrorMessage(error) });
    }
  }

  async updateRouter(routerData: UpdateRoutersSchema, routerId: number) {
    try {
      // Prepara os dados para enviar para a API
      const params = {
        ...routerData,
        customerIds: routerData.customer.map((customer) => customer.id),
        id: undefined,
        createdAt: undefined,
        updatedAt: undefined,
        customer: undefined,
        customers: undefined,
      };
      const { data, status } = await api.put(`/routers/${routerId}`, params);

      return { data, status };
    } catch (error) {
      if (isAxiosError(error)) {
        return error.response;
      }
      reportError({ message: getErrorMessage(error) });
    }
  }

  async deleteRouter(routerId: number) {
    try {
      const { data, status } = await api.delete(`/routers/${routerId}`);

      return { data, status };
    } catch (error) {
      if (isAxiosError(error)) {
        return error.response;
      }
      reportError({ message: getErrorMessage(error) });
    }
  }
}

export default RouterService;
