const chromium = require("chrome-aws-lambda");
const puppeteer = require("puppeteer-core");

const createPdf = async (htmlPage) => {
  const browser = await puppeteer.launch({
    args: chromium.args,
    executablePath:
      process.env.CHROME_EXECUTABLE_PATH || (await chromium.executablePath),
    headless: true,
  });

  const page = await browser.newPage();
  await page.setContent(htmlPage);
  const pdfBuffer = await page.pdf();

  await page.close();
  await browser.close();

  return pdfBuffer;
};

exports.handler = async (event, context) => {
  const htmlString = JSON.parse(event.body).htmlString;

  if (!htmlString)
    return {
      statusCode: 400,
      body: JSON.stringify({ message: "No page defined" }),
    };

  const pdf = await createPdf(htmlString);

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: `Pdf is ready`,
      buffer: pdf,
    }),
  };
};
