import app from "./app";
const port: any = process.env.PORT || 8000

app.listen(port, () => {
  console.log(`Application running on port ${port}`)
});