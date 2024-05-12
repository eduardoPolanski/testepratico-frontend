import React, { useState } from "react";

import RouterService from "../../service/routerService";
import { GetRoutersSchema } from "../../types/router";

interface DeleteModalProps {
  showModal: boolean;
  onCloseModal: () => void;
  router: GetRoutersSchema | null;
  onDeleteRouter: () => void;
}

const RouterDeleteModal: React.FC<DeleteModalProps> = ({
  showModal,
  onCloseModal,
  router,
  onDeleteRouter,
}) => {
  const routerService = new RouterService();
  const [error, setError] = useState<string | null>(null);

  const handleDeleteRouter = async () => {
    if (router) {
      try {
        const { status, data } = await routerService.deleteRouter(router.id);
        if (status === 204) {
          onDeleteRouter();
          alert("Roteador excluido com sucesso!");
          onCloseModal();
          setError(null);
        } else if (status === 400) {
          setError(
            data.message || "Erro ao exluir um roteador. Tente novamente."
          );
        } else if (status === 409) {
          alert(data.message);
          setError(data.message);
        }
      } catch (error) {
        setError(error.message);
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
          Tem certeza que deseja excluir o roteador de marcar{" "}
          <span className="font-semibold">{router?.brand}</span> e modelo{" "}
          <span className="font-semibold">{router?.model}</span>?
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
            onClick={handleDeleteRouter}
            className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-md"
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
};

export default RouterDeleteModal;
