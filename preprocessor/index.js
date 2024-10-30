import Papa from 'papaparse';
import Fuse from 'fuse.js'
import { createReadStream, createWriteStream } from 'node:fs';
import BloomFilter from 'bloom-filters';

const authorsReadStream = createReadStream('./preprocessor/data/authors.txt');
const authorsWriteStream = createWriteStream('./preprocessor/data/authors.min.txt');
// const authors = [];
const errorRate = 0.000000003;
const authorFilter = BloomFilter.BloomFilter.create(11138200, errorRate);

Papa.parse(authorsReadStream, {
	worker: true,
    skipEmptyLines: true,
    delimiter: '\t',
	step: (results) => {
        if (results.errors.length) {
            console.error(results.errors);
            return;
        }

		const authorRaw = JSON.parse(results.data[4]);
        
        if (!authorRaw.name || !authorRaw.name.length) {
            return
        }
        const authorNameClean = authorRaw.name.trim().toLowerCase();
        if (!authorFilter.has(authorNameClean)) {
            authorFilter.add(authorNameClean);
            const authorSubset = {
                name: authorRaw.name.trim(),
                key: results.data[1]
            };
    
            authorsWriteStream.write(JSON.stringify(authorSubset) + '\n');
        }
	},
    complete: () => {
        authorsWriteStream.end();
    },
    error: (err, file, inputElem, reason) => {
        console.error(err, inputElem, reason);
    }
});

// // Create the Fuse index
// const authorIndex = Fuse.createIndex(['name'], authors);
// writeFile('./preprocessor/data/fuse-author-index.json', JSON.stringify(authorIndex.toJSON()), (err) => {
//     if (err) throw err;
//     console.log('The file has been saved!');
// });