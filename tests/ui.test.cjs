// Requires Playwright. Run: node tests/ui.test.cjs
// Optional: BROWSER_PATH=/path/to/chromium QA_OUTPUT=/output/directory
const { chromium } = require('playwright');
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
process.env.TZ='Asia/Manila';
const M = require('../app/src/main/assets/model.js');
const assets = path.resolve(__dirname, '../app/src/main/assets');
const out = process.env.QA_OUTPUT || path.resolve(__dirname, '../../qa');
fs.mkdirSync(out,{recursive:true});
const server = http.createServer((req,res)=>{
  const name = req.url === '/' ? 'index.html' : req.url.split('?')[0].slice(1);
  if(!['index.html','logo.png','styles.css','app.js','model.js'].includes(name)){res.writeHead(404);res.end();return;}
  res.setHeader('Content-Type',name.endsWith('.js')?'text/javascript':name.endsWith('.css')?'text/css':name.endsWith('.png')?'image/png':'text/html');
  res.end(fs.readFileSync(path.join(assets,name)));
});
(async()=>{
  await new Promise(r=>server.listen(0,'127.0.0.1',r));
  const browser = await chromium.launch({headless:true,executablePath:process.env.BROWSER_PATH||undefined,args:['--no-sandbox']});
  const page = await browser.newPage({viewport:{width:390,height:844},timezoneId:'Asia/Manila',acceptDownloads:true});
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  const check = async (text) => { assert.ok((await Promise.all((await page.getByText(text,{exact:false}).all()).map(l=>l.isVisible()))).some(Boolean),text); };
  const snap = async name => { await page.waitForFunction(()=>!document.querySelector('#toast').classList.contains('visible'));await page.screenshot({path:path.join(out,name+'.png'),fullPage:false}); };
  const nav = r => page.locator(`.bottom-nav [data-route="${r}"]`).click();
  const login = async role => { await page.locator(`[data-action="choose-role"][data-role="${role}"]`).click();await page.getByRole('button',{name:'Log in',exact:true}).click(); };
  const logout = async () => { await nav('profile');await page.getByRole('button',{name:'Log out / change role'}).click(); };
  const demo = async event => { await nav('profile');await page.getByRole('button',{name:'Demo scenarios',exact:true}).click();await page.locator(`[data-event="${event}"]`).click(); };
  await page.goto(`http://127.0.0.1:${server.address().port}`);
  await snap('01-roles');
  await login('pca');
  assert.equal(await page.locator('.bottom-nav [data-route="reports"]').count(),1);
  await nav('members');
  await page.getByRole('button',{name:'Register farmer-member'}).click();
  await page.getByLabel('Full name').fill('Ana Cruz');await page.getByLabel('Barangay',{exact:true}).fill('San Isidro');
  await page.getByRole('button',{name:'Save member',exact:true}).click();
  await check('Ana Cruz');
  await snap('02-members');
  await logout();await login('head');await snap('03-dashboard');
  assert.equal(await page.locator('.bottom-nav [data-route="reports"]').count(),0);
  await page.getByRole('button',{name:'New load',exact:false}).click();
  await page.getByLabel('Loading date',{exact:true}).fill(M.date(2));
  await page.getByLabel('Registered farmer-member',{exact:true}).selectOption({label:'Ana Cruz · M0241'});
  await page.getByLabel('Quantity (kg)',{exact:true}).fill('90');await page.getByLabel('Tray numbers',{exact:true}).fill('1-2');
  await page.getByRole('button',{name:'Add farmer-lot',exact:false}).click();
  await page.locator('#member-1').selectOption('M002');await page.locator('#qty-1').fill('100');await page.locator('#trays-1').fill('2-3');
  await page.getByRole('button',{name:'Save shared load',exact:true}).click();await check('Two lots share a tray');
  await page.locator('#trays-1').fill('3-4');await page.getByRole('button',{name:'Save shared load',exact:true}).click();await check('Ana Cruz');
  await nav('home');await page.getByRole('button',{name:'Schedule member',exact:true}).click();await page.getByRole('button',{name:'Schedule a member',exact:false}).click();
  await page.getByLabel('Registered member',{exact:true}).selectOption('M001');await page.locator('#booking-date').fill(M.date(3));await page.locator('#booking-qty').fill('200');
  await page.getByRole('button',{name:'Save booking',exact:true}).click();await check('Emilio Lopis');
  await nav('status');await snap('04-monitoring');
  await demo('door');await page.getByRole('button',{name:'View monitoring',exact:true}).click();await check('Door opened unexpectedly');
  await nav('alerts');await page.locator('[data-action="read-alert"]').first().click();
  const stored=await page.evaluate(()=>JSON.parse(localStorage.getItem('coprafy.prototype.v1')));assert.equal(stored.sessions[0].fault,'Door opened unexpectedly');
  await snap('05-alerts');
  await demo('clear-fault');await page.getByRole('button',{name:'View monitoring',exact:true}).click();await check('Heating remains paused');
  await demo('resume');await demo('offline');await page.getByRole('button',{name:'View monitoring',exact:true}).click();await check('Offline · Last readings are stale');
  await snap('06-offline');
  await demo('reconnect');await demo('cooldown');await page.getByRole('button',{name:'View monitoring',exact:true}).click();await check('Cooldown · Unloading is not permitted yet');
  for(const [lot,value] of [['L01','5.8'],['L02','7.1'],['L03','5.9']]){
    await page.locator(`[data-action="sample"][data-lot="${lot}"]`).click();await page.getByLabel('Sample moisture (%)',{exact:true}).fill(value);await page.getByRole('button',{name:'Save sample result'}).click();
  }
  await demo('cooled');await page.getByRole('button',{name:'View monitoring',exact:true}).click();await check('sample acceptance is still pending');
  await page.locator('[data-action="sample"][data-lot="L02"]').click();await page.getByLabel('Sample moisture (%)',{exact:true}).fill('6');await page.getByRole('button',{name:'Save sample result'}).click();
  await check('Ready to unload');await snap('07-ready');
  await page.getByRole('button',{name:'Record unloading completion'}).click();
  await page.locator('#complete-form input[type="checkbox"]').check();await page.getByRole('button',{name:'Complete session record'}).click();await check('Completed');
  await page.reload();await login('head');await nav('sessions');await check('Completed');
  await logout();await login('pca');await nav('reports');await snap('08-reports');
  const dl=page.waitForEvent('download');await page.getByRole('button',{name:'Generate and save PDF'}).click();const download=await dl;await download.saveAs(path.join(out,'sample-report.pdf'));assert.ok(fs.statSync(path.join(out,'sample-report.pdf')).size>500);
  await page.locator('#report-range').selectOption('custom');await page.locator('#report-from').fill(M.date(30));await page.locator('#report-to').fill(M.date(31));assert.ok(await page.getByRole('button',{name:'Generate and save PDF'}).isDisabled());
  await nav('sessions');await page.getByRole('button',{name:'Calendar',exact:true}).click();assert.ok(await page.locator('.calendar').isVisible());
  await page.setViewportSize({width:320,height:640});await snap('09-small-screen');
  for(const r of ['home','members','sessions','reports','profile']){await nav(r);assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>window.innerWidth),false,'No horizontal overflow on '+r);}
  assert.deepEqual(errors,[]);
  console.log('PASS: two-role navigation, member registration, tray validation, session logging, scheduling, faults, offline status, sample acceptance, cooldown clearance, completion, persistence, calendar, PDF download, and 320px layout.');
  await browser.close();server.close();
})().catch(e=>{console.error(e);server.close();process.exit(1);});
