const fs = require('fs');
const matter = require('gray-matter');
const path = require('path');

const INPUT_DIR = path.resolve(__dirname, '../essays');
const OUTPUT_PATH = path.resolve(__dirname, '../data/essays.json');

function run() {
  const filenames = fs.readdirSync(INPUT_DIR);
  const rv = filenames.map(name => {
    const raw = fs.readFileSync(INPUT_DIR + '/' + name);
    return matter(raw);
  });
  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(rv, null, 2));
  console.log('success');
}

run();
