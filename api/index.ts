import express from 'express';
import { Request, Response } from 'express';

const app = express();
const port = 3000;

app.get('/api/hello', async (req: Request, res: Response) => {
  return res.status(200).json({ message: 'Hello World' });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

export default app;