const { Request, Response } = require('express');
const express = require('express');

const app = express();
const port = 3000;

const cors = require('cors');
// Enable CORS for all domains
app.use(cors());

app.get('/api/hello', async (req: Request, res: Response) => {
  return res.status(200).json({ message: 'Hello World' });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});


module.exports = app;

