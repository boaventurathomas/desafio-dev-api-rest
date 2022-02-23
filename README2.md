# Executando

Para executar o projeto é necessário ter o docker instalado e rodar o comando

```
docker compose up --build
```

Com isso já irá configurar o banco de dados mysql conforme script que consta no arquivo [sql](scripts/desafio-dev-api-rest.sql)

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
Após execução pode verificar via browser acessando a pasta da aplicaçao e /coverage/lcov-report/index.html

*OBS:* os testes foram priorizados nos arquivos tipo controller e service

# Fazendo Requisições

Importar o arquivo [environment](/postman/local.postman_environment.json) como enviroment no postman. 

Importar o arquivo [collection](/postman/desafio-dev-api-rest.postman_collection.json) como collection no postman para realizar as requisições.

As requisições também pode ser feitas via swagger acessando [http://localhost:3000/api/](http://localhost:3000/api/) via browser

As requisições estão divididas em pastas na collection, Contas, Portador e Trnsações.

# Consultando os requisitos

1 - Deve ser possível criar e remover **portadores** 
    - Utilizar a requisição na pasta Portador -> POST /portador para criar um novo portador
    - Utilizar a requisição na pasta Portador -> DEL /portador para excluír um portador
    
    1.1 Um **portador** deve conter apenas seu *nome completo* e *CPF*
    - Utilizar a requisição na pasta Portador -> GET /portador/:cpf para consultar os dados do portador ou
    - Utilizar a requisição na pasta Portador -> GET /portador para consultar todos os portadores

    1.2 O *CPF* deve ser válido e único no cadastro de **portadores**
     - Utilizar a requisição na pasta Portador -> POST /portador para criar um novo portador utilizando um CPF inválido. A requisição retornar que o CPF é inválido

2 - As **contas digital Dock** devem conter as seguintes funcionalidades:
    2.1 A conta deve ser criada utilizando o *CPF* do **portador**
    - Utilizar a requisição na pasta Conta -> POST /conta para criar uma nova conta. é obrigatório o envio da informação do CPF do portador para vincular a conta.


    2.2 Uma conta deve ter seu *saldo*, *número* e *agência* disponíveis para consulta
    - Utilizar a requisição na pasta Conta -> GET /conta/:agencia/:conta para criar consulta os dados da conta.


    2.3 Necessário ter funcionalidade para fazer a *consulta de extrato* da conta *por período*
      - Utilizar a requisição na pasta Transacao -> GET /transacao/extrato?agencia={{agencia}}&conta={{conta}}&dataInicialPeriodo={{data_inicial_periodo}}&dataFinalPeriodo={{data_final_periodo}} para consultar as transações da conta no período indicado.
    
    2.4 Um **portador** pode fechar a **conta digital Dock** a qualquer instante
    - Utilizar a requisição na pasta Conta -> PATCH /conta/:agencia/:conta passando o parâmetro ativo como false no corpo da mensagem. 
        ```
        {
            "ativo": false
        }
        ```

    2.5 Executar as operações de *saque* e *depósito*

        2.5.1 *Depósito* é liberado para todas as *contas ativas* e *desbloqueadas*
        - Utilizar a requisição na pasta transacao -> POST /transacao/deposito para uma conta que esteja ativa (ver item 2.4 para ativar. Por padrão é criada ativa)
        - Utilizar a requisição na pasta transacao -> POST /transacao/deposito para uma conta que esteja inativa (ver item 2.4 para inativar uma conta). Aplicação avisará que a conta está inativa

        2.5.2 *Saque* é permitido para todas as *contas ativas* e *desbloqueadas* desde que haja *saldo disponível* e não ultrapasse o limite diário de *2 mil reais*
        - Utilizar a requisição na pasta transacao -> POST /transacao/saque para uma conta que esteja ativa (ver item 2.4 para ativar. Por padrão é criada ativa) e que tenha saldo superior ao valor do saque (veja o item 2.5.1 como realizar deposito na conta) e que tenha valor total de saque no dia menor que 2000 reais (ver item 2.3 para consultar os saques do dia)
        - Utilizar a requisição na pasta transacao -> POST /transacao/saque para uma conta que esteja inativa (ver item 2.4 para inativar uma conta). Aplicação avisará que a conta está inativa
        - Utilizar a requisição na pasta transacao -> POST /transacao/saque para uma conta que esteja ativa (ver item 2.4 para inativar uma conta) e que já tenha mais de 2000 reais em saque no dia (ver item 2.3 para consultar os saques do dia). Aplicação avisará que o limite diário foi atingido

3 - Precisamos *bloquear* e *desbloquear* a **conta digital Dock** a qualquer momento
    - Utilizar a requisição na pasta Conta -> PATCH /conta/:agencia/:conta passando o parâmetro ativo true para desbloquear e false para bloquear
    - 
4 - A **conta digital Dock** nunca poderá ter o *saldo negativo*
    Tentar realizar um saque (ver item 2.5.2) em uma conta sem saldo ou um saque de valor maior que o saldo da conta (ver item 2.2 para verificar o saldo da conta)
