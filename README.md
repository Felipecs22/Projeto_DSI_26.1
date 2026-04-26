Markdown
# 🎮 Playscope

> **Sua jornada gamer, centralizada e conectada.**

O **Playscope** resolve a fragmentação da experiência gamer moderna. Em um cenário onde jogos, conquistas e interações sociais estão espalhados por diversas plataformas, o Playscope atua como um hub inteligente que organiza sua biblioteca e conecta você ao que seus amigos estão jogando.

---

## 🚀 Stack Tecnológica
* **Framework:** React Native
* **Linguagem:** TypeScript
* **Navegação:** React Navigation
* **Ambiente:** Android SDK / NDK

---

## 🛠️ Guia de Instalação e Execução

Siga os passos abaixo para rodar o MVP funcional no seu ambiente local:

### 1. Instalação de Dependências
Certifique-se de estar na raiz da pasta `PlayscopeApp` e execute o comando abaixo para baixar as bibliotecas necessárias:
```bash
npm install
2. Inicialização do Metro Bundler
Inicie o servidor de pacotes na porta customizada para evitar conflitos com a porta padrão do sistema:

Bash
npx react-native start --port 8082
3. Configuração de Ponte ADB
Com o emulador Android aberto, abra um novo terminal e realize o redirecionamento de porta para estabelecer a comunicação entre o computador e o dispositivo virtual:

PowerShell
adb reverse tcp:8081 tcp:8082
4. Lançamento do App
Com o servidor e a ponte ativos, abra o aplicativo manualmente no emulador ou utilize o comando de trigger via terminal:

Bash
npx react-native run-android --port 8082
✨ Funcionalidades do MVP
[x] Autenticação: Interface de login integrada à identidade visual do projeto.

[x] Dashboard: Visualização inicial da biblioteca de jogos e feed de atividades.

[x] Navegação Nativa: Transições fluidas entre telas utilizando Stack Navigation.

[x] UI de Alta Fidelidade: Design responsivo focado na experiência do usuário (UX).

👥 Equipe
Felipe Cavalcante e Igor Dias - Engenharia de Software & Desenvolvimento Mobile
 
