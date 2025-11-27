import { seedTriggers } from "./seedTriggers";

async function main() {
	console.log("🌱 Running trigger seeds...");
	await seedTriggers();
	console.log("✅ Trigger seeds done!");
}

main().catch((e) => {
	console.error(e);
	process.exit(1);
});
