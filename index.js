import 'dotenv/config';
import express from 'express'
import cors from 'cors'

const app = express();
app.use(cors()); 
app.use(express.json());

app.get('/', (req, res)=>{
res.json("this server is okay")
})














const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
