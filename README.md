# QRMoto

## Integrantes (rm):

- Fernando Henrique Vilela Aguiar (557525)
- Gabrielly Campos Macedo (558962)
- Rafael Mocoto Magalhães Seo (554992)

  ## Funcionalidade:


Este projeto é um aplicativo mobile desenvolvido com React Native utilizando a estrutura de navegação do expo-router. Ele conta com quatro principais funcionalidades acessíveis por abas inferiores: uma tela inicial de boas-vindas, uma interface de cadastro de motos, uma visualização em mapa com grid representando as posições/status das motos, e uma tela com os desenvolvedores do projeto. O sistema permite cadastrar, editar e excluir informações de motos, com campos como modelo, posição, status, problema, placa e ala associada, e utiliza AsyncStorage para persistência local.

Para que o projeto funcione corretamente, é indispensável que o backend esteja rodando em paralelo, pois todas as operações de consulta, criação, edição e exclusão de dados dependem da   API. O backend está disponível no repositório:

🔗 https://github.com/Fernando1211/SprintJavaPz

A comunicação entre o app e a API ocorre pela URL http://10.0.2.2:8080/, que é o endereço utilizado para acessar a máquina local a partir de um emulador Android padrão (AVD). Caso o     app seja testado em um celular físico ou outro tipo de emulador, esse endereço deverá ser ajustado conforme o IP local da máquina que executa o backend.

O projeto pode ser executado localmente com o Expo CLI, bastando instalar as dependências com npm install e iniciar o app com npx expo start. O aplicativo pode ser testado tanto em um   emulador quanto no celular utilizando o app Expo Go.

Este sistema foi projetado com foco em organização, navegação simples e integração com APIs RESTful, sendo uma solução prática para o gerenciamento visual e funcional de motos       
vinculadas a setores (alas).

## Solução do projeto:

O projeto tem como foco aplicar Visão Computacional para reconhecer, classificar e localizar motos nos pátios da Mottu, utilizando câmeras como sensores inteligentes. A partir das imagens capturadas, modelos de Inteligência Artificial – especialmente redes neurais convolucionais (CNN) – são usados para identificar automaticamente o tipo de moto (Pop, Sport ou Elétrica). A imagem processada exibe o modelo da moto com destaque visual e, futuramente, os dados serão integrados a um aplicativo com mapa interativo em tempo real. Essa abordagem elimina a necessidade de sensores físicos como RFID ou GPS em cada moto, reduzindo significativamente os custos operacionais.

A solução foi desenvolvida com Python, OpenCV e TensorFlow/Keras, com treinamento realizado em Google Colab e scripts executados localmente via Visual Studio Code. O modelo alcançou alta acurácia utilizando um dataset real composto por três classes de motos. O sistema pode ser executado localmente ou em nuvem e funciona com câmeras comuns, sem necessidade de hardware especializado, tornando a solução técnica e economicamente viável para diferentes filiais.


  
