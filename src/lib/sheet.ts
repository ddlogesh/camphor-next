import {BlobReader, ZipReader, configure} from '@zip.js/zip.js';
import {SaxesParser} from 'saxes';
import {Worksheet} from "@/src/types/file-info";

const getWorksheetNames = async (file: File): Promise<Worksheet[]> => {
  const worksheets: Worksheet[] = [];

  configure({
    useWebWorkers: true,
    chunkSize: 5 * 1024 * 1024, // 5MB
  });
  const zipReader = new ZipReader(new BlobReader(file));
  const entries = await zipReader.getEntries();

  const workbookEntry = entries.find(e => e.filename === 'xl/workbook.xml');
  if (!workbookEntry?.getData) return worksheets;

  const decoder = new TextDecoderStream('utf-8');
  const parser = new SaxesParser();

  parser.on('opentag', (tag) => {
    if (tag.name === 'sheet' && tag.attributes['sheetId']) {
      worksheets.push({
        id: tag.attributes['sheetId'],
        name: tag.attributes['name'],
      });
    }
  });

  const parsingComplete = new Promise<void>((resolve, reject) => {
    parser.on('end', () => resolve());
    parser.on('error', reject);
  });

  const writableStream = new WritableStream({
    write(chunk) {
      parser.write(chunk);
    },
    close() {
      parser.close();
    }
  });

  // Start the piping
  const pipePromise = decoder.readable.pipeTo(writableStream);
  await workbookEntry.getData(decoder.writable);
  await Promise.all([pipePromise, parsingComplete])
  await zipReader.close();

  return worksheets;
}

export {
  getWorksheetNames,
};
