import { apiViaCep } from "../lib/api";
import { getErrorMessage, reportError } from "../lib/error";

import { isAxiosError } from "axios";

class ViaCepService {
  async getCep(cep: string) {
    try {
      const { data, status } = await apiViaCep.get(`${cep}/json/`);

      return { data, status };
    } catch (error) {
      if (isAxiosError(error)) {
        return error.response;
      }
      reportError({ message: getErrorMessage(error) });
    }
  }
}

export default ViaCepService;
