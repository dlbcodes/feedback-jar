export function colorFromId(id: string) {
	// Hash string → number
	let hash = 0;
	for (let i = 0; i < id.length; i++) {
		hash = id.charCodeAt(i) + ((hash << 5) - hash);
	}

	// Convert hash → HSL color
	const hue = hash % 360;
	return `hsl(${hue}, 70%, 60%)`;
}
