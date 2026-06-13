import app from "@/app";
import { env } from "@/config";
import type { Response } from "express";

// Routes that don't exist
app.use((_, res: Response) => {
  res.status(404).send("Route not found");
});

app.listen(env.PORT, () => {
  console.log(`Server running on port http://localhost:${env.PORT}`);
});
