import fs from "fs";
import { markdown } from "markdown";

import stringify from "json-stable-stringify-pretty";

const issueUrl = "https://github.com/Muttley/foundryvtt-ac2d20/issues";

const docs = [
	{
		src: "./CHANGELOG.md",
		dst: "./data/packs/system_documentation.db/release_notes__g6JENp97aKkuNFcs.json",
	},
];

function compileDocs(cb) {
	for (const doc of docs) {
		const source = fs.readFileSync(doc.src, "utf8");

		// Dynamically add links to ticket numbers:
		//
		// Matches: [#389]
		// Outputs: [**[#389](https://github.com/Muttley/foundryvtt-ac2d20/issues/389)**]
		//
		const enhancedSource = source.replace(
			/\[#(\d+?)\]/g,
			`[**[#$1](${issueUrl}/$1)**]`
		);

		const html = markdown.toHTML(enhancedSource, "Maruku");

		const journalJson = fs.readFileSync(doc.dst, "utf8");
		const journal = JSON.parse(journalJson);
		journal.text.content = `${html}`;

		let jsonData = stringify(journal, {space: "\t", undef: true});
		jsonData += "\n";

		fs.writeFileSync(doc.dst, jsonData);
	}

	cb();
}

export const compile = compileDocs;
