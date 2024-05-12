import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-4xl font-bold text-gray-800 mb-6">
        Bem-vindo ao Teste Prático!
      </h1>
      <p className="text-lg text-gray-700 text-center mb-8">
        Este é um teste prático para a vaga de Desenvolvedor Full Stack
        Pleno/Sênior. Confira abaixo as tarefas destinadas ao desenvolvimento do
        Backend e Frontend.
      </p>

      <p className="text-sm text-gray-700 mt-8">
        Clique em{" "}
        <Link to="/clientes" className="underline">
          Clientes
        </Link>{" "}
        ou{" "}
        <Link to="/roteadores" className="underline">
          Roteadores
        </Link>{" "}
        para começar.
      </p>
      <p>
        <Link
          className="underline"
          target="_blank"
          to="http://localhost:3001/docs"
        >
          Clique aqui
        </Link>{" "}
        para ver a documentação da API
      </p>
    </div>
  );
};

export default Home;
