const puppeteer = require("puppeteer");
require("dotenv").config();

const scrapeLogic = async (res) => {
	const browser = await puppeteer.launch({
		args: ["--disable-setuid-sandbox", "--no-sandbox", "--single-process", "--no-zygote"],
		executablePath: process.env.NODE_ENV === "production" ? process.env.PUPPETEER_EXECUTABLE_PATH : puppeteer.executablePath(),
	});

	try {
		const page = await browser.newPage();

		// await page.goto("https://api.scraperapi.com?api_key=3202a932c39c99daf584f5d126be1b94&url=https://patentechile.com/&device_type=desktop", { waitUntil: "networkidle0" });
		await page.goto("https://patentechile.com/", { waitUntil: "networkidle2" });

		// Set screen size
		await page.setViewport({ width: 1080, height: 1024 });
		await page.type("#txtTerm", "svjk51", { delay: 100 });
		await page.click("#btnConsultar");
		await page.waitForNavigation({ waitUntil: "networkidle2" });

		// Extraer la información como texto plano
		const rawText = await page.evaluate(() => {
			const element = document.querySelector("#tblVehicl3-x");
			if (element) {
				return element.innerText;
			}
			return null;
		});

		res.send(rawText);

		// Type into search box
		// await page.type(".search-box__input", "automate beyond recorder");

		// Wait and click on first result
		// const searchResultSelector = ".search-box__link";
		// await page.waitForSelector(searchResultSelector);
		// await page.click(searchResultSelector);

		// Locate the full title with a unique string
		// const textSelector = await page.waitForSelector("h1");
		// const fullTitle = await textSelector.evaluate((el) => el.textContent);

		// Print the full title
		// const logStatement = `The title of this blog post is ${fullTitle}`;
		// console.log(logStatement);
		// res.send(logStatement);
	} catch (e) {
		console.error(e);
		res.send(`Something went wrong while running Puppeteer: ${e}`);
	} finally {
		await browser.close();
	}
};

module.exports = { scrapeLogic };
