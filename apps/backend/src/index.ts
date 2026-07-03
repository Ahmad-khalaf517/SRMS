import { server, BASE_URL } from "./server";
import connectDB from "./config/db";

connectDB();

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  const address = server.address();
  const host =
    address && typeof address === "object"
      ? address.address === "::"
        ? "localhost"
        : address.address
      : "localhost";
  const port = address && typeof address === "object" ? address.port : PORT;
  const url = `http://${host}:${port}${BASE_URL}`;
  console.log(`🚀 Server running at ${url}`);
});
