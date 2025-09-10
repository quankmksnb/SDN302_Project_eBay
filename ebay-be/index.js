import express from 'express';

const hostname = 'localhost';
const port = 9999;

const app = express();

app.get('/', (req, res) => {
  res.status(200).send("Hello World from eBay BE!");
});

app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});

