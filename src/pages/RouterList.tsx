import React, { useEffect, useState } from "react";

import SearchInput from "../components/SearchInput";
import AddRouterModal from "../components/RouterModals/AddRouterModal";
import RouterDeleteModal from "../components/RouterModals/DeleteRouterModal";
import RouterUpdateModal from "../components/RouterModals/UpdateRouterModal";
import RouterService from "../service/routerService";
import { GetRoutersSchema } from "../types/router";
import RouterModal from "../components/RouterModals/RouterModal";

const RouterList: React.FC = () => {
  const [routers, setRouters] = useState<GetRoutersSchema[]>([]);
  const [showRouterModal, setShowRouterModal] = useState(false);
  const [showAddRouterModal, setShowAddRouterModal] = useState(false);
  const [showDeleteRouterModal, setShowDeleteRouterModal] = useState(false);
  const [showUpdateRouterModal, setShowUpdateRouterModal] = useState(false);
  const [router, setRouter] = useState<GetRoutersSchema | null>(null);
  const [searchText, setSearchText] = useState<string>("");
  const routerService = new RouterService();

  const openRouterModal = (router: GetRoutersSchema) => {
    setRouter(router);
    setShowRouterModal(true);
  };

  const closeRouterModal = () => {
    setShowRouterModal(false);
  };

  const openAddRouterModal = () => {
    setShowAddRouterModal(true);
  };

  const closeAddRouterModal = () => {
    setShowAddRouterModal(false);
  };

  const openDeleteModal = (router: GetRoutersSchema) => {
    setRouter(router);
    setShowDeleteRouterModal(true);
  };

  const closeDeleteModal = () => {
    setShowDeleteRouterModal(false);
  };

  const openUpdateModal = (router: GetRoutersSchema) => {
    setRouter(router);
    setShowUpdateRouterModal(true);
  };

  const closeUpdateModal = () => {
    setShowUpdateRouterModal(false);
  };

  const getRouters = async () => {
    try {
      const { data, status } = await routerService.getRouter();
      if (status !== 200) {
        throw new Error("Falha ao buscar roteador");
      }
      setRouters(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getRouters();
  }, []);

  // Função para filtrar os roteadors com base no texto da pesquisa
  const filteredCustomers = routers.filter((router) =>
    router.brand.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <div className="">
      <div className="flex items-center justify-between py-2">
        <button
          className="inline-flex justify-center rounded-md border border-transparent shadow-sm px-2 sm:px-4 py-2 
          bg-green-600  font-medium text-white hover:bg-green-700 focus:outline-none 
         focus:ring-2 focus:ring-offset-2 text-sm"
          onClick={openAddRouterModal}
        >
          Adicionar roteador
        </button>
        <SearchInput
          placeholder="Pesquisar roteadors..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
      </div>
      <h1 className="text-2xl font-bold mb-4">Lista de Roteadores</h1>
      <ul>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredCustomers.length > 0 ? (
            filteredCustomers.map((router) => (
              <div
                key={router.id}
                className="flex flex-col justify-between border border-gray-300 p-4 rounded-md"
              >
                <div className="flex items-center gap-x-2">
                  {!router.inactive ? (
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
                  <h1 className="text-lg font-semibold text-gray-800">
                    Roteador
                  </h1>
                </div>

                <div>
                  <p className="text-lg text-gray-600">
                    Marca: <span>{router?.brand || "N/A"}</span>
                  </p>
                  <p className="text-lg text-gray-600">
                    Modelo: <span>{router?.model || "N/A"}</span>
                  </p>
                  <h1 className="text-lg font-semibold text-gray-800 mt-2">
                    Clientes
                  </h1>
                  {router.customer.length > 0 ? (
                    <div>
                      <p className="text-lg text-gray-600">
                        Total: <span>{router.customer.length}</span>
                      </p>
                    </div>
                  ) : (
                    <p>Nenhum roteador cadastrado</p>
                  )}
                </div>

                <div className="flex justify-between items-center mt-4">
                  <button
                    className="inline-flex justify-center rounded-md border border-transparent shadow-sm px-2 sm:px-4 py-2 
                  bg-green-600  font-medium text-white hover:bg-green-700 focus:outline-none 
                  focus:ring-2 focus:ring-offset-2 text-sm"
                    onClick={() => openRouterModal(router)}
                  >
                    Ver mais
                  </button>
                  <div className="flex items-center gap-x-2">
                    <button
                      className="inline-flex justify-center rounded-md border border-transparent shadow-sm px-2 sm:px-4 py-2 
                    bg-blue-500  font-medium text-white hover:bg-blue-700 focus:outline-none 
                    focus:ring-2 focus:ring-offset-2 text-sm"
                      onClick={() => openUpdateModal(router)}
                    >
                      Editar
                    </button>
                    <button
                      className="inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 
                    bg-red-500 font-medium text-white hover:bg-red-700 focus:outline-none 
                    focus:ring-2 focus:ring-offset-2 text-sm"
                      onClick={() => openDeleteModal(router)}
                    >
                      Excluir
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div>Nenhum roteador cadastrado</div>
          )}
        </div>
      </ul>

      <RouterModal
        showModal={showRouterModal}
        onCloseModal={closeRouterModal}
        router={router}
      />

      <AddRouterModal
        showModal={showAddRouterModal}
        onCloseModal={closeAddRouterModal}
        onAddRouter={() => {
          getRouters();
          closeAddRouterModal();
        }}
      />

      <RouterDeleteModal
        showModal={showDeleteRouterModal}
        onCloseModal={closeDeleteModal}
        router={router}
        onDeleteRouter={() => {
          getRouters();
          closeDeleteModal(); 
        }}
      />

      <RouterUpdateModal
        showModal={showUpdateRouterModal}
        router={router}
        onCloseModal={closeUpdateModal}
        onUpdateRouter={() => {
          getRouters();
          closeDeleteModal();
        }}
      />
    </div>
  );
};

export default RouterList;
