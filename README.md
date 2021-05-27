# The bookmark app backend

<a href="https://www.npmjs.com/package/express"><img src="https://img.shields.io/badge/express-v4-green" alt="express" /></a> <a href="https://www.npmjs.com/package/express"><img src="https://img.shields.io/badge/apollo--server--express-v2-blueviolet" alt="apollo-server-express" /></a> <a href="https://www.npmjs.com/package/jest"><img src="https://img.shields.io/badge/jest-v27-yellow" alt="jest" /></a> <a href="https://www.npmjs.com/package/typescript"><img src="https://img.shields.io/badge/typescript-v4-blue" alt="typescript" /></a> <a href="https://www.npmjs.com/package/mongoose"><img src="https://img.shields.io/badge/mongoose-v5.10-green" alt="mongoose" /></a> <a href="https://dashboard.heroku.com/apps"><img src="https://img.shields.io/badge/heroku-blueviolet" alt="heorku" /></a>

## Description

The bookmark app backend is a simple project used as practice ground for using jest and supertest to test a graphql api that uses cookies for users authorization.
It was also a good opportunity to use github actions to automate testing and deployment to heroku just for fun.

## How to run the project

### Local machine

Install project dependencies running the following command:

```cmd
npm i
```

Create a `.env` file in the root of the project that holds the following variables:

- `PORT`: the port where the project will be running.
- `DB_CONNECTION_STRING`: the mongodb uri used to connect the project to a mongodb database.
- `JWT_SECRET`: the string used to hash passwords.

#### Production mode

```cmd
npm run start
```

#### Development mode

The following command runs the project with hot reload enabled everytime a new change is saved.

```cmd
npm run start:dev
```

### Docker

Open a terminal in the root directory of the project

Build a docker image of the project with the following command:

```cmd
docker build -t <your-docker-image-name> .
```

where `your-docker-image-name` is the name of the image created after the building process.

Then run a container using the newly created image:

```text
docker run -d -p 3000:3000 --env PORT=3000 --env JWT_SECRET=<your-secret-of-choice> --env DB_CONNECTION_STRING=<your-mongo-db-connection-uri> --name <your-container-name-of-choice> <your-docker-image-name>
```

where `<your-container-name-of-choice>` is the identifier that docker will assign to the running container and `<your-docker-image-name>` is the same image name used in the previous step

## License

[MIT](https://choosealicense.com/licenses/mit/)
