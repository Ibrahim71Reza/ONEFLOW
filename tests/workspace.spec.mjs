import {test,expect} from '@playwright/test';
test('dealer order crosses sales, allocation, production and dispatch',async({page})=>{
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('/');const click=name=>page.getByRole('button',{name,exact:true}).first().click();
 await click('Enter demo workspace');await click('Dealer Portal');await click('Place order');await click('Submit order');await click('View tracking');
 await click('Sales Management');await click('Review');await click('Confirm');await click('Production Planning');
 await page.locator('#planId').selectOption('1043');await click('Allocate 60 coils');await click('Generate work order for 40');await click('Open factory floor');
 await page.locator('select[name=id]').selectOption('1043');await page.getByLabel('Good coils').fill('40');await click('Submit production log');
 await click('Sales Management');await click('Mark delivered');await click('Dealer Portal');await expect(page.locator('.track').first().locator('li.done')).toHaveCount(6);
 await page.reload();await click('Dealer Portal');await expect(page.locator('.track').first()).toContainText('OF-1043');expect(errors).toEqual([]);
});
test('reports export, procurement and alert actions',async({page})=>{
 await page.goto('/');await page.getByText('Enter demo workspace').click();await page.getByRole('button',{name:'Resolve',exact:true}).first().click();
 await page.getByRole('button',{name:'Notifications'}).click();await expect(page.locator('dialog .result')).toHaveCount(5);await page.getByText('Close',{exact:true}).click();
 await page.locator('#role').selectOption('5');await page.getByText('Receive shipment',{exact:true}).first().click();await expect(page.locator('.stats')).toContainText('245 t');
 await page.locator('#role').selectOption('7');await page.locator('#range').selectOption('7');let file=page.waitForEvent('download');await page.getByText('Download report (CSV)').click();expect((await file).suggestedFilename()).toContain('7-days');
});
test('mobile navigation, search and reset',async({page})=>{
 await page.setViewportSize({width:390,height:844});await page.goto('/');await page.getByText('Enter demo workspace').click();
 await page.getByRole('button',{name:'Search workspace'}).click();await page.locator('#global').fill('finance');await page.locator('dialog .result').click();await expect(page.locator('h1')).toContainText('Working Capital');
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBeTruthy();
 await page.getByRole('button',{name:'Open menu'}).click();await page.getByRole('button',{name:'Reset demo'}).click();await page.getByText('Restore starting data').click();await expect(page.getByText('Enter demo workspace')).toBeVisible();
});

for (const width of [320,360,390,620,768,800,801,1024,1366,1440]) {
 test('walkthrough and eight workspaces fit at '+width+'px',async({page})=>{
  await page.setViewportSize({width,height:width<800?844:900});await page.goto('/');
  const fit=async()=>expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
  await fit();await page.getByRole('button',{name:'Guided walkthrough'}).click();
  for(let i=0;i<6;i++){
   await fit();await page.locator('[data-act="advance-story"]').click();
  }
  await expect(page.locator('#story-heading')).toHaveText('100 coils delivered.');
  await page.getByText('Exit walkthrough',{exact:true}).click();
  for(let i=0;i<8;i++){await page.locator('#role').selectOption(String(i));await fit()}
  await page.locator('#role').selectOption('2');
  if(width<=620)await expect(page.locator('tbody tr').first()).toHaveCSS('display','block');
  if(width<=800){await page.getByRole('button',{name:'Open menu'}).click();await page.keyboard.press('Escape');await expect(page.locator('aside')).toBeHidden()}
 });
}
