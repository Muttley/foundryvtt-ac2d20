export function registerEnrichers() {
	CONFIG.TextEditor.enrichers = [
		...CONFIG.TextEditor.enrichers,
		{
			pattern: /@(s(tress)?|c(hallenge)?)/gim,
			enricher: async (match, options) => {
				const i = document.createElement('i');
				i.className = 'cthl-cthulhu';

				// Adjust positioning slightly to align better with text.
				i.style.position = 'relative';
				i.style.top = '0.2em';

				return i;
			},
		},
	];
}