const express = require("express");
const mongodb = require("mongodb");
const uri =
  "mongodb+srv://cyf:dwWl1Z4yk0xMn7Cg@cluster0.q8yg7.mongodb.net/test";
const mongoOptions = { useUnifiedTopology: true };
const client = new mongodb.MongoClient(uri, mongoOptions);

const app = express();

app.use(express.json());

client.connect(function () {
  const db = client.db("cinema");
  const collection = db.collection("mongodb-week3");
  app.get("/films", function (request, response) {
    //get collection movies

    collection.find({}).toArray((error, movies) => {
      if (error) {
        response.status(500).send(error);
      } else {
        response.status(200).send(movies);
      }
    });

    // find all the movies => cursor
    //convert toArray
    //callback which has the data
    //if everythink is ok -> send the data(200 default)
    //otherwise send -> a error response (500)
  });

  app.get("/films/:id", function (request, response) {
    //get collection(movie)
    //defin id(mongodb.ObjectID)
    const id = new mongodb.ObjectID(request.params.id);

    if (!mongodb.ObjectID.isValid(request.params.id)) {
      return response.sendStatus(404);
    }

    //check if the id is valid if not -> 404
    const queryObject = { _id: id };
    //queryObject = {_id: id}
    console.log("queryObject", queryObject);
    collection.findOne(queryObject, (error, result) => {
      if (error) {
        response.status(500).send("error");
      }
      if (!result) {
        return response.sendStatus(404);
      }
      return response.send(result);
    });

    //collection.findOne
    //if everything is not ok-> send a error response(500)
    // if not record -> 404
  });

  app.post("/films", function (request, response) {
    let body = request.body;
    console.log("body", body);

    collection.insertOne(body, (error, result) => {
      if (error) {
        response.status(500).send("error");
      }
      if (!result) {
        return response.sendStatus(404);
      }
      return response.send(result);
    });
  });

  app.put("/films/:id", function (request, response) {
    response.send("Update one film");
  });

  app.delete("/films/:id", function (request, response) {
    response.send("Delete one film");
  });

  app.listen(3000);
});
