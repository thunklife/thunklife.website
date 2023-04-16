const ExifParser = require('exif-parser');
const fs = require('fs-extra');
const path = require('path')

const photosDirPath = path.join(process.cwd(), 'static', 'img');
const dirContents = fs.readdirSync(photosDirPath);
dirContents.forEach(item => {
	const photoPath = path.join(photosDirPath, item);
	const stats = fs.statSync(photoPath);
	const {birthtime} = stats;
	const file = fs.readFileSync(photoPath)
	const exif = ExifParser
	const parser = ExifParser.create(file);

	parser.enableBinaryFields(true);
	parser.enableTagNames(true);
	parser.enableImageSize(true);
	parser.enableReturnTags(true);
	
	const img = parser.parse();
	const tags = img.tags
	const meta = {
		camera: `${tags.Make} ${tags.Model}`,
		make: tags.Make,
		model: tags.Model,
		fStop: tags.FNumber,
		lens: `${tags.LensMake} ${tags.LensModel}`,
		iso: tags.ISO,
		created: birthtime
	}
	/**
	 * 
		---
		title: Anaheim Convention Center
		date: 2023-04-01
		file_name: anaheim-convention-center.jpg
		---
	 */
	const parsedPath = path.parse(item);
	const fileName = parsedPath.base;
	const imgTitle = parsedPath.name.replaceAll('-', ' ');
	const outDir = path.join(process.cwd(), 'content', 'photos', parsedPath.name);
	const outPath = `${outDir}.njk`;
	const template = `---\ntitle: ${imgTitle}\nfile_name: ${fileName}\ncreated: ${meta.created}\ncamera: ${meta.camera}\nlens: ${meta.lens}\niso: ${meta.iso}\nfstop: ${meta.fStop}\n---`;
	fs.writeFileSync(outPath, template)
});
