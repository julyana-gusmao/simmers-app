[![logotype](https://github.com/user-attachments/assets/1d435c77-228c-490e-b975-d23301e773a6)](https://youtu.be/Gr-R6JUz_ys)

Desenvolvido em **Adonis 6** e **React** 👩‍💻🚀 <br/><br/>
Confira a [Documentação Oficial da API](https://documenter.getpostman.com/view/27144159/2sA3s1pCA5) <br/>
Guia de instalação no final do README

## Sobre o projeto 🚀 

**S.immers** é uma rede social criada para jogadores de The Sims compartilharem as suas gameplays e conhecerem outros simmers. A ideia é você interagir como se fosse o seu Sim, praticamente um "RP". Compartilhar seus momentos mais especiais (do seu Sim), compartilhar as conquistas na carreira (do seu Sim), compartilhar a sua família evoluindo (novamente, do seu Sim).

No Simmers você precisa ter um email e uma senha para se cadastrar, e fique à vontade para adicionar uma foto bem legal no seu perfil!
Na página Explorar Simmers, você pode ver as postagens de todos os usuários do Simmers e conhecer gente nova, é só buscar o nome na filtragem e seguir, assim, você não perde nenhuma novidade postada sobre aquele Sim!

Em resumo, no Simmers você pode:

- Postar seus melhores momentos, 
- Ver e interagir com as postagens dos seus amigos,
- Excluir e editar seus posts e comentários,
- Seguir e deixar de seguir usuários,
- Conhecer gente nova lá no Explorer,
- Editar seu perfil
- Stalkear o perfil de alguém! 👀
- Excluir sua conta permanentemente

Em futuras versões teremos:
<br/>
✨ Opção de Like e Amei
<br/>
✨ Opção de postagem com mídia
<br/>
✨ Layout responsivo mobile


## 🛠️ Guia de Instalação

### **Pré-requisitos**
> Node.js (versão 14.x ou superior) <br/>
> Algum gerenciador de pacotes do node (estarei exemplando com NPM) <br/>
> SQLite (OBS: NENHUMA DAS CREDENCIAIS DO BANCO DE DADO ATUAL SÃO REAIS)
<br/>


**1. Clonar o repositório**
```git
git clone https://github.com/seu-usuario/thesimssocials-app.git
cd thesimssocials-app
```

**2. Configurar o backend**
```git
cd backend
npm install
```

- Renomeie o arquivo **.env.example** para **.env**. <br/>
- Abra o arquivo .env e configure as variáveis necessárias, como conexão ao banco de dados e chaves secretas.**
- Crie as migrações do banco de dados
```git
node ace migration:run
```

✅ Servidor pronto para inicializar
```git
node ace serve --watch
```

3. Configurar o frontend
```git
cd ../frontend
npm install
```

✅ Interface pronta para inicializar
```git
npm start
```
