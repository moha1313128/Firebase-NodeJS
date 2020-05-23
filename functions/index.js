const functions = require("firebase-functions");
const admin = require("firebase-admin");
const express = require("express");
const cors = require("cors");
const app = express();
const serviceAccount = require("./permissions.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://web-app-f3b4e.firebaseio.com",
});
const db = admin.firestore();
app.use(cors({ origin: true }));
// Routes
// app.get("/api", (req, res) => {
//   return res.status(200).send("Hello World");
// });
app.post("/api/create", async (req, res) => {
  try {
    await db
      .collection("products")
      .doc("/" + req.body.id + "/")
      .create({
        name: req.body.name,
        description: req.body.description,
        price: req.body.price,
      });
    return res.status(200).send();
  } catch (error) {
    console.log(error);
    return res.status(500).send(error);
  }
});

app.get("/api/read/:id", async (req, res) => {
  try {
    const document = db.collection("products").doc(req.params.id);
    let product = await document.get();
    let response = product.data();
    return res.status(200).send(response);
  } catch (error) {
    console.log(error);
    return res.status(500).send(error);
  }
});
app.get("/api", async (req, res) => {
  try {
    let query = db.collection("products");
    let response = [];
    await query.get().then((querySnapshot) => {
      let docs = querySnapshot.docs;
      for (let doc of docs) {
        const selectedItem = {
          id: doc.id,
          name: doc.data().name,
          price: doc.data().price,
          description: doc.data().description,
        };
        response.push(selectedItem);
      }
      return response;
    });
    return res.status(200).send(response);
  } catch (error) {
    console.log(error);
    return res.status(500).send(error);
  }
});
app.put("/api/:id", async (req, res) => {
  try {
    const document = db.collection("products").doc(req.params.id);
    await document.update({
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
    });
    return res.status(200).send();
  } catch (error) {
    console.log(error);
    return res.status(500).send(error);
  }
});
app.delete("/api/:id", async (req, res) => {
  try {
    const document = db.collection("products").doc(req.params.id);
    await document.delete();
    return res.status(200).send();
  } catch (error) {
    console.log(error);
    return res.status(500).send(error);
  }
});
// Export api to firebase cloud functions
exports.app = functions.https.onRequest(app);
