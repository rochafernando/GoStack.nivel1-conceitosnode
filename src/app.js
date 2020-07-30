const express = require("express");
const cors = require("cors");

const { uuid, isUuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

function validateRepositoryIdFormat(request, response, next) {  
  const { id } = request.params;
  if (!isUuid(id)) {
    return response.status(400).json({ error: 'Invalid repository ID Format' });
  }
  return next();
}

function validateRepositoryId(request, response, next){
  
  const { id } = request.params;
  return (repositories.some( repo => repo.id === id)) ? next() : response.status(400).json({ error: ` ID Repository: ${id} not founded` });
}



app.use('/repositories/:id', validateRepositoryIdFormat,validateRepositoryId);

app.get("/repositories", (request, response) => {

  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;

  const repository = { "id": uuid(), title, url, techs, "likes": 0 };

  repositories.push(repository);

  return response.status(200).json(repository);  
});

app.put("/repositories/:id", (request, response) => {
  
  const { id } = request.params;

  const { title, url, techs } = request.body; 
  
  const repoIndex = repositories.findIndex(repo => repo.id === id);
  const obj = repositories[repoIndex];  
  const repository = { id, title, url, techs, "likes": obj.likes  };

  repositories[repoIndex] = repository;

  return response.json(repository);
  

});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;
    
  const repoIndex = repositories.findIndex(repo => repo.id === id);

  repositories.splice(repoIndex,1);

   return response.status(204).send();
});

app.post("/repositories/:id/like", validateRepositoryIdFormat,validateRepositoryId , (request, response) => {
  const { id } = request.params;  
  
  const repoIndex = repositories.findIndex(repo => repo.id === id);
  repositories[repoIndex].likes += 1;  
  return response.json(repositories[repoIndex]);
});

module.exports = app;
