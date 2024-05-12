import { isAxiosError } from "axios";

export function getErrorMessage(error: unknown) {
  if (isAxiosError(error)) {
    switch (error.response?.status) {
      case 404:
        return "Rota não encontrada.";
      case 500:
        return "Erro interno do servidor";
      default:
        return (
          error.response?.data?.message ||
          "Erro interno " + error.response?.status
        );
    }
  }
  return String(error);
}

export const reportError = ({ message }: { message: string }) => {
  alert(message);
};
