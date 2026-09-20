const express = require("express");
const routes = require("./api/routes");

const app = express();

app.use(express.json());
app.use("/api", routes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
