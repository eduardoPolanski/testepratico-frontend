import React, { useState } from "react";
import { GetRoutersSchema } from "../types/router";

interface Props {
  router: GetRoutersSchema;
}

const RouterInfo: React.FC<Props> = ({ router }) => {
  const [expanded, setExpanded] = useState(false);

  const toggleExpanded = () => {
    setExpanded(!expanded);
  };

  return (
    <div className="sm:w-[450px]">
      <h3 className="text-xl text-center font-semibold my-2">
        Informações do roteador
      </h3>
      <div className="p-4 grid grid-cols-2 gap-8">
        <div>
          <div className="mb-4">
            <p className="font-semibold">Marca:</p>
            <p>{router.brand}</p>
          </div>
          <div className="mb-4">
            <p className="font-semibold">Modelo:</p>
            <p>{router.model}</p>
          </div>
          <div className="mb-4">
            <p className="font-semibold">Status:</p>
            <p>{!router.inactive ? "Ativo" : "Inativo"}</p>
          </div>
        </div>
        <div>
          <div className="mb-4">
            <p className="font-semibold">Endereço IP:</p>
            <p>{router.addressIp}</p>
          </div>
          <div className="mb-4 ">
            <p className="font-semibold ">Endereço IPv6:</p>
            <p className="break-words">{router.addressIpv6}</p>
          </div>
        </div>
      </div>
      <div className="">
        <button
          className="w-full block bg-blue-500 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md focus:outline-none"
          onClick={toggleExpanded}
        >
          {expanded
            ? "Esconder lista de clientes"
            : "Mostrar lista de clientes"}
        </button>
        {expanded && (
          <div className="mt-4 text-center">
            <h3 className="text-xl font-semibold my-2 rounded-md">
              Lista de clientes:
            </h3>

            <ul>
              <p className="mb-2">
                {router.customer.length > 0
                  ? "Informações do Clientes"
                  : "Nenhum cliente cadastrado para esse roteador"}
              </p>
              <div className="grid grid-cols-2 ">
                {router.customer.map((customer) => (
                  <li key={customer.id}>
                    <div className="flex px-4 gap-x-2 ">
                      <p className="font-semibold">Nome:</p>
                      <p className="text-start">{customer.fullName}</p>
                    </div>
                  </li>
                ))}
              </div>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default RouterInfo;
