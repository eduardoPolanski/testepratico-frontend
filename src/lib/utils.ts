// Função para remover formatação do CPF
export const unformatCPFOrCNPJ = (data: string): string => {
  return data.replace(/[^\d]/g, "");
};

// Função para formatar CPF
export function formatCPF(cpf) {
  if (!cpf) return;
  // Remove todos os caracteres não numéricos
  const formatedCpf = cpf.replace(/\D/g, "");

  // Aplica a formatação do CPF (###.###.###-##)
  return formatedCpf.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/g, "$1.$2.$3-$4");
}

// Função para formatar CNPJ
export function formatCNPJ(cnpj) {
  if (!cnpj) return;
  // Remove todos os caracteres não numéricos
  const formatedCnpj = cnpj.replace(/\D/g, "");

  // Aplica a formatação do CNPJ (##.###.###/####-##)
  return formatedCnpj.replace(
    /^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/g,
    "$1.$2.$3/$4-$5"
  );
}
