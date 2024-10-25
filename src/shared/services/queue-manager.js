// import "dotenv/config";
import IORedis from "ioredis";
import { Queue, Worker } from "bullmq";

const defaultQueue = "default";
const connection = new IORedis({ maxRetriesPerRequest: null });
const queue = new Queue(defaultQueue, { connection });
const worker = new Worker(defaultQueue, ioIntensiveJobProcessor, {
	connection,
	concurrency: 5,
});

const worker2 = new Worker(defaultQueue, cpuIntensiveJobProcessor, {
	connection,
	concurrency: 5,
});

/**
 * @type {import("bullmq").Processor} job
 */
async function ioIntensiveJobProcessor(job) {
	const timeDelay = 5000;

	const result = await new Promise((resolve) => {
		setTimeout(() => {
			resolve(`Job processed after ${timeDelay} millis`);
		}, timeDelay);
	});

	console.log(result);
	console.log("Job Data", job.data);
}

/**
 * @type {import("bullmq").Processor} job
 */
async function cpuIntensiveJobProcessor(job) {
	const startTime = Date.now();
	let result = 0;
	for (let i = 0; i < 5000000000; i++) {
		result += Math.sqrt(i);
	}
	const endTime = Date.now();
	console.log(`Job processed after ${endTime - startTime} ms`);
	console.log("Job Data", job.data);
	return result;
}

const repeatQueueName = "repeatQueue";
const repeatQueue = new Queue(repeatQueueName, { connection });
const repeatWorker = new Worker(repeatQueueName, cpuIntensiveJobProcessor, {
	connection,
	concurrency: 1,
});

function repeatJobProcessor(job) {
	console.log({ data: job.data });
}
async function addJob() {
	// await repeatQueue.add(
	// 	"test",
	// 	{ test: "test" },
	// 	{
	// 		repeat: {
	// 			pattern: "*/10 * * * * *",
	// 		},
	// 	}
	// );

	await repeatQueue.add(
		"test2",
		{ test: "test2" },
		{
			repeat: {
				pattern: "48 22 * * *",
			},
		}
	);

	await repeatQueue.add(
		"test3",
		{ test: "test3" },
		{
			repeat: {
				pattern: "48 22 * * *",
			},
		}
	);
}

for (let i = 0; i < 500; i++) {
	addJob();
}

addJob();
