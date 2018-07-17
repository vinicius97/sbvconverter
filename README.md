# Documentação da API
Para o correto funcionamento da aplicação é necessário configurar o arquivo config.json no diretório raiz com as configurações abaixo:
````
{
  "api_domain":"ENDEREÇO_DESTA_APLICAÇÃO",
  "webapp_domain":"ENDEREÇO_DA_APLICAÇÃO_FRONTEND_PARA_AUTORIZAR_CORS",
  "aws": {
    "accessKeyId":"ACCESS_KEY_AWS",
    "secretAccessKey":"SECRET_ACCESS_KEY_AWS",
    "region": "REGIÃO_AWS"
  },
  "db":"mongodb://USUARIO:SENHA@ENDEREÇO_MONGODB:PORTA/COLLECTION",
  "zencoder":{
    "endpoint":"https://app.zencoder.com/api/v2",
    "secret":"SECRET_ZENCODER"
  }
}
````
Os métodos possíveis para uso desta api são

## GET

```
GET /video/list
application/json
```
Retorna um array de objetos contendo as informações dos vídeos enviados para a AWS S3
````
[
  {
    "status":"",
    "_id":"",
    "title":"",
    "filename":"",
    "key":"",
    "url":"",
    "input":"",
    "__v": 0,
    "output_id":"",
    "encode_id":""
  },
  {
    "status":"",
    "_id":"",
    "title":"",
    "filename":"",
    "key":"",
    "url":"",
    "input":"",
    "__v": 0,
    "output_id":"",
    "encode_id":""
  }
]
````



```
GET /video/:id
application/json
```
Retorna os dados de determinado vídeo do banco de dados utilizando o id específico passado como parâmetro no endpoint.
````
{
    "status":"",
    "_id":"",
    "title":"",
    "filename":"",
    "key":"",
    "url":"",
    "input":"",
    "__v": 0,
    "output_id":"",
    "encode_id":""
  },
````



## POST

```
POST /video/job/callback
application/json
```
Webhook que escuta do Zencoder quando um vídeo foi encodado. Ele emite uma ação para o websocket enviar à aplicação frontend o novo status do item que estava em upload para 'Finalizado'.




```
Recebe como parâmetro no body da requisição: file, key, title
POST /video/upload
multipart/form-data 
```
Este endpoint é responsável pelo upload dos vídeos, tendo como cabçalho os parâmetros em multipart/form-data 




```
Recebe como parâmetro no body da requisição: _id, bucket, input, key
POST /video/encode
application/json
```
Este endpoint é responsável por localizar o vídeo passado como parâmetro no repositório do AWS S3 e solicitar o encode para a API do Zencoder



