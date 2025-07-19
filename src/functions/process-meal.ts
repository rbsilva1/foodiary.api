import type { SQSEvent } from "aws-lambda";
import { ProcessMealQueue } from "../queues/process-meal.queue";

export async function handler(event: SQSEvent) {
	await Promise.all(
		event.Records.map(async (record) => {
			const { fileKey } = JSON.parse(record.body);

			await new ProcessMealQueue().process({ fileKey });
		}),
	);
}
