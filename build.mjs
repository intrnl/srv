import fs from 'fs/promises';
import path from 'path';
import esbuild from 'esbuild';


async function recurse (dirname, callback, prefix = dirname) {
	dirname = path.resolve('.', dirname);

	await fs.readdir(dirname)
		.then((listing) => Promise.all(
			listing.map((item) => {
				let absolute = path.join(dirname, item);

				return fs.stat(absolute).then((stat) => (
					stat.isDirectory()
						? recurse(absolute, callback, path.join(prefix, item))
						: callback(path.join(prefix, item), absolute, stat)
				));
			})
		));
}

let start = Date.now();
let entryPoints = [];
let IMPORT_RE = /(import|export)(.*)(['"])(\.{0,2}\/.*(?<!\.js))\3/g;

// Remove dist directory beforehand
await fs.rm('dist/', { recursive: true, force: true });

// Collect the files
await recurse('lib/', (file) => {
	if (file.endsWith('.ts')) entryPoints.push(file);
});

// Build!
await esbuild.build({
	entryPoints,
	target: 'es2020',
	format: 'esm',
	outdir: 'dist/',
});

// Rewrite imports
await recurse('dist/', async (file) => {
	if (!file.endsWith('.js')) return;

	let source = await fs.readFile(file, 'utf-8');
	let modified = source.replace(IMPORT_RE, (f, type, imports, quote, path) => {
		return `${type}${imports}${quote}${path}.js${quote}`;
	});

	if (modified != source) await fs.writeFile(file, modified);
});

let end = Date.now();
console.log(`Build took ${end - start} ms`);
