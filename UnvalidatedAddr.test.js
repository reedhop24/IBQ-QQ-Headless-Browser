const puppeteer = require('puppeteer');
const { TestScheduler } = require('jest');
let browser;
let page;

beforeEach(async () => {
    try {
        browser = await puppeteer.launch({
            ignoreDefaultArgs: ['--disable-extentions'],
            headless: false
        });
        page = await browser.newPage();
        await page.goto('https://quickquote-test.ibqsystems.com/ACME/Auto/#Location');
    
        // Zip tab
        await page.waitFor('input[name=Zip]');
        await page.$eval('input[name=Zip]', el => el.value = 99203);
    
        await page.waitForSelector('input[name=accept-terms]');
        await page.$eval('input[name=accept-terms]', el => el.parentElement.click());
    
        await page.waitFor('button[name=forward]');
        await page.$eval('button[name=forward]', el => el.click());
    
        const waitforNav = await page.waitForNavigation({ waitUntil: 'networkidle0' ,timeout: 5000});
        await waitforNav;

        // About You
        await page.waitFor('input[name=AppFirstName]');
        await page.$eval('input[name=AppFirstName]', el => el.value = 'Reed');
    
        await page.waitFor('input[name=AppLastName]');
        await page.$eval('input[name=AppLastName]', el => el.value = 'Hopkins');
    
        await page.waitFor('input[name=Address]');
        await page.$eval('input[name=Address]', el => el.value = '618 W 23rd');
    
        await page.waitFor('input[class="TFDate-Month form-control input-lg date-field"]');
        await page.$eval('input[class="TFDate-Month form-control input-lg date-field"]', el => el.value = '09');
    
        await page.waitFor('input[class="TFDate-Day form-control input-lg date-field"]');
        await page.$eval('input[class="TFDate-Day form-control input-lg date-field"]', el => el.value = '19');

        await page.waitFor('input[class="TFDate-Year form-control input-lg date-field"]');
        await page.$eval('input[class="TFDate-Year form-control input-lg date-field"]', el => el.value = '2010');
        await page.$eval('input[class="TFDate-Year form-control input-lg date-field"]', el => el.click());

        await page.waitFor('input[name=Number]');
        await page.$eval('input[name=Number]', el => el.value = '509-720-6633');

        await page.waitFor('select[name=ResidenceType]');
        await page.select('select[name=ResidenceType]', 'Rented Dwelling');

        await page.waitFor('select[name=AgencyReferral]');
        await page.select('select[name=AgencyReferral]', 'Internet');

        await page.waitFor('input[name=AppEmail]');
        await page.$eval('input[name=AppEmail]', el => el.value = 'reed@ibqsystems.com');

        await page.waitFor('button[name=forward]');
        await page.$eval('button[name=forward]', el => el.click());

    } catch(err) {
        console.log(err);
    }
});

afterEach(async () => {
    await browser.close();
});

jest.setTimeout(30000);

test('Test an invalid', async () => {
    const text = await page.$eval('div[class="error"]', el => el.innerHTML);
    expect(text).toEqual('Applicant age must be 16 - 105 years old');
});
