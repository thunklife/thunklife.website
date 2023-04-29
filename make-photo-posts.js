/**
 * Create new photo posts from images in the `new-img` directory using its EXIF data
 * Once the new post is created move the phot to `static/img`
 */

const ExifParser = require('exif-parser');
const fs = require('fs-extra');
const path = require('path')

const sourceDirPath = path.join(process.cwd(), 'new-img');
const targetDirPath = path.join(process.cwd(), 'static', 'img')
const dirContents = fs.readdirSync(sourceDirPath);

dirContents.forEach(item => {
	// create the source and dest paths for the image
	const sourcePhotoPath = path.join(sourceDirPath, item);
	const targetPhotoPath = path.join(targetDirPath, item)
	const stats = fs.statSync(sourcePhotoPath);
	const {birthtime} = stats;
	const file = fs.readFileSync(sourcePhotoPath);
	const parser = ExifParser.create(file);

	parser.enableBinaryFields(true);
	parser.enableTagNames(true);
	parser.enableImageSize(true);
	parser.enableReturnTags(true);
	
	const img = parser.parse();
	const tags = img.tags;
	const meta = {
		camera: `${tags.Make} ${tags.Model}`,
		make: tags.Make,
		model: tags.Model,
		fStop: tags.FNumber,
		lens: `${tags.LensMake} ${tags.LensModel}`,
		iso: tags.ISO
	}

	const parsedPath = path.parse(item);
	const fileName = parsedPath.base;
	const imgTitle = parsedPath.name.replaceAll('-', ' ');
	const outDir = path.join(process.cwd(), 'content', 'photos', parsedPath.name);
	const outPath = `${outDir}.njk`;
	const template = `---\ntitle: ${imgTitle}\nfile_name: ${fileName}\ncreated: ${meta.created}\ncamera: ${meta.camera}\nlens: ${meta.lens}\niso: ${meta.iso}\nfstop: ${meta.fStop}\n---`;
	fs.writeFileSync(outPath, template)
	fs.moveSync(sourcePhotoPath, targetPhotoPath)
});