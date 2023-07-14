# Desafio Trakto Back-end

## Índice

1. Como rodar o código?
2. Organização do código
3. Endpoints

## 1. Como rodar o código?

Passos para reproduzir o código na sua máquina:

1. Instalar as dependências com `npm install`.
2. Criar um cluster no MongoDB Atlas (https://www.mongodb.com/atlas/database).
3. Adicionar um arquivo .env na pasta raíz do projeto com as seguintes variáveis:
   ```
   API_ADDRESS=<Endereço do servidor> # Rodando na máquina provavelmente será http://localhost:3000
   MONGODB_ATLAS_CONNECTION_STRING=<String de conexão com o cluster do MongoDB Atlas>
   ```
4. Executar `npm start`

_Versão do Node.js utilizada: 18.12.1._

## 2. Organização do código

O projeto está organizado da seguinte forma:

```
/public
    /images
/src
    /test
    /filters
    /images
        /data-storage
        /dtos
        /image-transformers
        /utils
        images.controller.ts
        images.module.ts
        images.service.ts
    app.module.ts
    main.ts
```

A maioria das pastas tem nomes autoexplicativos, mas algumas vale a pena detalhar.

- `/images` contém o módulo ImagesModule e tudo que é referente a ele.
- `/data-storage` contém tudo relacionado ao armazenamento de dados, como entidades e repositórios.
- `/images-transformers` contém serviços para manipulação de imagens - como ThumbnailService para gerar thumbnails e BlurService para aplicar filtro de blur.
- `images.controller` é responsável pelas rotas relativa a imagem.
- A lógica de cada rota está em `images.service`, sendo que seus metódos mapeiam 1 para 1 com os métodos do controller.

## 3. Endpoints

### POST - /images/thumbnail

Gera uma thumbnail a partir do endereço de uma imagem. Retorna os endereços de uma cópia da imagem original e do thumbnail gerado, e os metadados da imagem original.

**Request**

```
{
    image: string <Endereço da imagem>,
    compress: number <Compressão do thumbnail - entre 0 e 0.99>
}
```

**Response**

```
{
  localpath: {
    original: string <Endereço da cópia da imagem original>,
    thumb: string <Endereço da thumbnail>,
  },
  metadata: object <Metadata da imagem original>,
}
```

### POST - /images/blur

Gera uma imagem com blur a partir do endereço de uma imagem. Retorna os endereços de uma cópia da imagem original e da imagem com blur gerada.

**Request**

```
{
    image: string <Endereço da imagem>,
    compress: number <Compressão do thumbnail - entre 0 e 0.99>,
    blur: number <Compressão do thumbnail - entre 0.3 e 1000>
}
```

**Response**

```
{
  localpath: {
    original: string <Endereço da cópia da imagem original>,
    blurred: string <Endereço da imagem com blur>,
  },
};
```
