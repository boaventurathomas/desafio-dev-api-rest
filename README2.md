# Executar o projeto
Para executar o projeto é necessário ter o docker instalado e rodar o comando

```
docker compose up --build
```

Com isso já irá configurar o banco de dados mysql conforme script que consta no arquivo scripts/desafio-dev-api-rest.sql

# Testes

Para executar os testes unitários da aplicação é necessário executar o seguinte comando:

```
npm run test
```

Parar verficiar a cobertura de teste pode executar o seguinte comando:

```
npm run test:cov
```
Após execução pode verificar via browser acessando a pasta da aplicaçao e /coverage/lcov-report/index.html