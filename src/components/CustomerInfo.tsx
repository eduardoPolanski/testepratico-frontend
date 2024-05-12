import React from "react";
import { GetCustomerSchema } from "../types/customers";

interface Props {
  customer: GetCustomerSchema;
}

const CustomerInfo: React.FC<Props> = ({ customer }) => {
  return (
    <div className="p-4 grid grid-cols-2 gap-8">
      <div>
        <h3 className="text-xl font-semibold my-2">Informações do Cliente</h3>
        <div className="mb-4">
          <p className="font-semibold">Nome:</p>
          <p>{customer.fullName}</p>
        </div>
        <div className="mb-4">
          <p className="font-semibold">CPF:</p>
          <p>{customer.cpf}</p>
        </div>
        <div className="mb-4">
          <p className="font-semibold">Tipo de Conta:</p>
          <p>
            {customer.accountType === "PF"
              ? "Pessoa Física"
              : "Pessoa Jurídica"}
          </p>
        </div>
        <div className="mb-4">
          <p className="font-semibold">Data de Nascimento:</p>
          <p>
            {customer.birth
              ? new Date(customer.birth).toLocaleDateString()
              : "N/A"}
          </p>
        </div>
        <div className="mb-4">
          <p className="font-semibold">Endereço:</p>
          <p>{`${customer.street}, ${customer.number} ${
            customer.complement || ""
          }, ${customer.district}, ${customer.city} - ${customer.cep}`}</p>
        </div>
      </div>

      <div>
        <h3 className="text-xl font-semibold my-2">Informações do Roteador</h3>
        <div className="mb-4">
          <p className="font-semibold">Endereço IP:</p>
          <p>{customer.router?.addressIp || "N/A"}</p>
        </div>
        <div className="mb-4">
          <p className="font-semibold">Endereço IPv6:</p>
          <p className="break-words">{customer.router?.addressIpv6 || "N/A"}</p>
        </div>
        <div className="mb-4">
          <p className="font-semibold">Marca:</p>
          <p>{customer.router?.brand || "N/A"}</p>
        </div>
        <div className="mb-4">
          <p className="font-semibold">Modelo:</p>
          <p>{customer.router?.model || "N/A"}</p>
        </div>
        <div className="mb-4">
          <p className="font-semibold">Status:</p>
          <p>{customer.router?.inactive ? "Inativo" : "Ativo"}</p>
        </div>
        <div className="mb-4">
          <p className="font-semibold">Criado em:</p>
          <p>
            {customer.router?.createdAt
              ? new Date(customer.router.createdAt).toLocaleString()
              : "N/A"}
          </p>
        </div>
        <div className="mb-4">
          <p className="font-semibold">Atualizado em:</p>
          <p>
            {customer.router?.updatedAt
              ? new Date(customer.router.updatedAt).toLocaleString()
              : "N/A"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default CustomerInfo;
