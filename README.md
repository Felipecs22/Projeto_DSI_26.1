Markdown
# 🎮 Playscope

> **A sua jornada gamer, centralizada e conectada.**

O **Playscope** nasce para solucionar a fragmentação da experiência gamer moderna. Em um cenário onde jogos, conquistas e interações sociais estão espalhados por diversas plataformas, o Playscope atua como um **Hub Inteligente** que organiza sua biblioteca, monitora seu progresso e conecta você ao que seus amigos estão jogando.

---

## 🎯 O Problema e a Solução
* **Problema:** Dificuldade em gerenciar backlogs em múltiplas lojas (Steam, Epic, PSN, Xbox) e falta de um feed social focado puramente em gameplay.
* **Solução:** Uma interface unificada em **React Native** que agrega dados de progresso e oferece uma camada social contextualizada.

---

## 🚀 Tecnologias e Arquitetura
O projeto foi desenvolvido utilizando práticas modernas de Engenharia de Software:
* **Mobile:** React Native (Framework)
* **Linguagem:** TypeScript (Tipagem estática para robustez)
* **Navegação:** React Navigation (Stack)
* **Ambiente:** Android SDK / NDK configurado para desenvolvimento nativo.

---

## 🛠️ Guia de Execução (Desenvolvedor)

Para rodar o MVP funcional no seu ambiente local, siga os passos abaixo:

### 1. Instalação de Dependências
Certifique-se de estar na raiz da pasta `PlayscopeApp` e execute:
```bash
npm install
2. Inicialização do Metro Bundler
Inicie o servidor de pacotes utilizando a porta customizada:

Bash
npx react-native start --port 8082
3. Configuração de Ponte ADB
Com o emulador Android aberto, realize o redirecionamento de porta para estabelecer a conexão:

PowerShell
adb reverse tcp:8081 tcp:8082
4. Lançamento do App
Abra o aplicativo diretamente no emulador ou utilize o comando de trigger:

Bash
npx react-native run-android --port 8082
✨ Funcionalidades do MVP
[x] Autenticação de Usuário: Interface de login integrada à identidade visual.

[x] Dashboard Principal (Home): Visualização inicial da biblioteca e feed.

[x] Navegação Nativa: Transições fluidas entre telas via Stack Navigation.

[x] Mockup de Alta Fidelidade: Design responsivo e focado na experiência do usuário (UX).

👥 Equipe e Contribuição
Felipe Cavalcante - Engenharia de Software & Desenvolvimento Mobile

Igor - UI/UX Design & Prototipagem Web

Este projeto é um artefato acadêmico desenvolvido para a disciplina de Sistemas de Informação - UFRPE.


### O que mudou nesse novo README?
1.  **Tom Profissional:** Usei termos como "Hub Inteligente", "Camada Social Contextualizada" e "Artefato Acadêmico". Isso valoriza o seu trabalho na hora da nota.
2.  **Foco em Engenharia:** Destaquei o uso de **TypeScript** e a configuração do **Android SDK/NDK**, que foram os grandes desafios técnicos que você superou.
3.  **Clareza Total:** O passo a passo de execução agora está blindado, citando a porta 8082 que é a chave para o seu projeto funcionar.

Pode colar sem medo! Tudo pronto para o show agora?
