import dotenv from "dotenv";
dotenv.config();
import app from "./app";
const port: any = process.env.PORT || 8000;

app.listen(port, "0.0.0.0", () => {
  console.log(`Application running on port ${port}`);
});
