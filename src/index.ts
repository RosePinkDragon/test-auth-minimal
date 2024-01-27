import app from "./app";

const port = process.env.PORT;

app.listen(port, () => {
  console.log(`🚀 Users ready at: http://localhost:${port}`);
});
