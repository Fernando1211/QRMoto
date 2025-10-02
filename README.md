# QRMoto

## Integrantes (rm):

- Fernando Henrique Vilela Aguiar (557525)
- Gabrielly Campos Macedo (558962)
- Rafael Mocoto Magalhães Seo (554992)

  ## Proposta  e funcionalidades

A proposta do QRMoto é ser um aplicativo móvel para o gerenciamento de uma frota de motos. A principal inovação do projeto é a utilização de QR Codes para identificar e acessar rapidamente as informações de cada veículo. O aplicativo é construído com tecnologias modernas de desenvolvimento móvel (React Native e Expo), permitindo que funcione tanto em Android quanto em iOS.

## Funcionalidades
O aplicativo implementa um sistema de CRUD (Criar, Ler, Atualizar, Deletar) completo para as motos, com as seguintes funcionalidades principais:

Cadastro de Motos: Um formulário permite registrar novas motos no sistema, inserindo informações como modelo, status (Disponível, Manutenção, etc.), posição, placa e problemas associados.

Listagem e Visualização: Uma tela dedicada exibe todas as motos cadastradas em uma lista, permitindo uma visão geral da frota.

Edição e Exclusão: É possível editar os dados de uma moto já existente ou removê-la do sistema.

Geração de QR Code: O aplicativo pode gerar um QR Code único para cada moto cadastrada. Este QR Code contém as informações do veículo, facilitando a identificação em campo.

Leitura de QR Code: Há uma tela de scanner que utiliza a câmera do celular para ler um QR Code e exibir instantaneamente os detalhes da moto correspondente.

Navegação por Abas: A interface é organizada em abas, separando claramente as principais seções do app: "Cadastro", "Lista" e "Scanner".

## Estrutura de pastas
O projeto segue a estrutura padrão de um aplicativo criado com Expo (React Native), utilizando a navegação baseada em arquivos (File-based routing) do Expo Router. A estrutura principal é a seguinte:

QRMoto/ (Pasta raiz do projeto)

app/: É o coração do aplicativo, onde ficam todas as telas e a lógica de navegação.

(tabs)/: Diretório especial que define a navegação principal por abas.

_layout.tsx: Configura o layout das abas (ícones, nomes, etc.).

index.tsx: Corresponde à primeira aba, a tela de Cadastro de Motos.

list.tsx: A segunda aba, que lista as motos cadastradas.

scanner.tsx: A terceira aba, responsável por abrir a câmera para escanear os QR Codes.

_layout.tsx: Arquivo de layout principal (root) do aplicativo.

modal.tsx: Uma tela modal, provavelmente usada para exibir os detalhes da moto após a leitura de um QR Code.

assets/: Contém os arquivos estáticos, como imagens (ícones) e fontes utilizadas no app.

components/: (Pasta não presente, mas seria o local ideal para componentes reutilizáveis como botões e inputs customizados).

app.json: Arquivo de configuração principal do projeto Expo (nome, ícone, versão, etc.).

package.json: Define as dependências do projeto (bibliotecas como Expo, React Native, etc.) e os scripts para execução.

README.md: A documentação que você está criando.

tsconfig.json: Arquivo de configuração para o TypeScript.

  
