import * as fs from 'fs/promises';
import * as path from 'path';
import esbuild from 'esbuild';


async function recurs (dirname, callback, prefix = dirname) {
	dirname = path.resolve('.', dirname);

	let listing = await fs.readdir(dirname, { withFileTypes: true });
	let items = [];

	for (let file of listing) {
		let relative = path.join(prefix, file.name);
		let absolute = path.join(dirname, file.name);

		if (file.isDirectory()) {
			items.push(...await recurs(absolute, callback, relative));
		} else {
			if (await callback(relative, absolute, file)) items.push(relative);
		}
	}

	return items;
}

let IMPORT_RE = /(import|export)(.*)(['"])(\.{0,2}\/.*(?<!\.js))\3/g;

let start = Date.now();
let entries = await recurs('lib/', (file) => file.endsWith('.ts'));

await fs.rm('dist/', { recursive: true, force: true });

let { warnings, outputFiles } = await esbuild.build({
	entryPoints: entries,
	outdir: 'dist/',
	format: 'esm',
	target: 'es2020',
	write: false,
});

for (let warning of warnings) {
	console.warn(`warn: ${warning.text}`);
}

for (let file of outputFiles) {
	let source = file.text;
	let filename = file.path;
	let dirname = path.dirname(filename);

	if (filename.endsWith('.js')) {
		source = source.replace(IMPORT_RE, '$1$2$3$4.js$3');
	}

	await fs.mkdir(dirname, { recursive: true });
	await fs.writeFile(filename, source);
}

let end = Date.now();
console.log(`Build took ${end - start} ms`);
