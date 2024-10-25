import "dotenv/config";
import app from "./src/app.js";
import { QueueManager } from "./src/shared/services/QueueManager.js";
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
	console.log(`Server is running on http://localhost:${PORT}`);
});
