// index.ts
import express from 'express';
import router from './route';
import { config } from './configs';

const app = express();

app.use('/', router);
app.get('/', (req, res) => {
  return res.json({ status: 'OK' })
})

const PORT = process.env.PORT || 1337;

app.listen(PORT, () => {
  console.log(`SERVER START AT PORT: ${PORT}`);
});
