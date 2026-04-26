🎮 PlayscopeApp
O Playscope é uma plataforma centralizada para organização de games, descoberta e interação social. Este repositório contém o MVP funcional desenvolvido em React Native com TypeScript.

🚀 Como rodar o projeto
Siga os passos abaixo para configurar e executar o app no seu emulador Android.

1. Pré-requisitos
Node.js instalado

Android Studio (Emulador configurado)

Variáveis de ambiente do Android SDK configuradas

2. Instalação
Clone o repositório e instale as dependências:

Bash
git clone https://github.com/SEU_USUARIO/PROJETO.git
cd PlayscopeApp
npm install
3. Executando o Metro Bundler
Inicie o servidor de pacotes na porta customizada (utilizada para evitar conflitos):

Bash
npx react-native start --port 8082
4. Conectando ao Emulador
Com o emulador aberto, execute o comando de redirecionamento de porta (ADB) para garantir a conexão entre o PC e o celular:

PowerShell
adb reverse tcp:8081 tcp:8082
5. Iniciando o App
Em um novo terminal, rode:

Bash
npx react-native run-android --port 8082
🛠️ Tecnologias Utilizadas
React Native: Framework para desenvolvimento mobile.

TypeScript: Tipagem estática para maior segurança do código.

React Navigation: Gerenciamento de rotas e telas.

📱 Funcionalidades Atuais (MVP)
[x] Fluxo de autenticação (Tela de Login).

[x] Navegação entre Login e Home.

[x] Interface baseada no design final (Mockup).

Desenvolvido por Felipe Cavalcante e equipe - 2026.1
