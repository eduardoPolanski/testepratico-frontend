import React from "react";
import { GetCustomerSchema } from "../../types/customers";
import CustomerInfo from "../CustomerInfo";

interface Props {
  showModal: boolean;
  onCloseModal: () => void;
  customer: GetCustomerSchema;
}

const CustomerModal: React.FC<Props> = ({
  showModal,
  onCloseModal,
  customer,
}) => {
  return (
    <>
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div
            className="absolute inset-0 bg-gray-900 opacity-50"
            onClick={onCloseModal}
          ></div>
          <div className="bg-white py-6 px-14 rounded-md z-10 max-w-3xl">
            <div className=" py-2  border-b rounded-t border-gray-400">
              <h3 className="text-2xl font-bold  ">Cliente</h3>
            </div>
            <div className="bg-gray-200 p-4 rounded-md mt-4">
              <CustomerInfo customer={customer} />
            </div>

            <button
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md mt-4"
              onClick={onCloseModal}
            >
              Fechar
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default CustomerModal;
