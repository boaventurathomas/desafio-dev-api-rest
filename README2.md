# Executando

Para executar o projeto é necessário ter o docker instalado e rodar o comando

```
docker compose up --build
```

Com isso já irá configurar o banco de dados mysql conforme script que consta no arquivo *scripts/desafio-dev-api-rest.sql*

A aplicação está configurada para executar na porta 3000

# Testando

Para executar os testes unitários da aplicação é necessário executar o seguinte comando:

```
npm run test
```

Parar verficiar a cobertura de teste pode executar o seguinte comando:

```
npm run test:cov
```
Após execução pode verificar via browser acessando a pasta da aplicaçao e [coverage](/coverage/lcov-report/index.html)

# Fazendo Requisições

Importar o arquivo [environment](/postman/local.postman_environment.json) como enviroment no postman. 

Importar o arquivo [collection](/postman/desafio-dev-api-rest.postman_collection.json) como collection no postman para realizar as requisições.

As requisições também pode ser feitas via swagger acessando [http://localhost:3000/api/](http://localhost:3000/api/) via browser