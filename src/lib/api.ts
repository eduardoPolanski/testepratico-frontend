import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3001",
});

const apiViaCep = axios.create({
  baseURL: "https://viacep.com.br/ws/",
});

export { api, apiViaCep };
