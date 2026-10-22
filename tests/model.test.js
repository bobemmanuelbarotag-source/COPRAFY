// Run with: node --test tests/model.test.js
const test = require('node:test');
const assert = require('node:assert/strict');
const M = require('../app/src/main/assets/model.js');

test('PCA registration and Head operational permissions remain separate', () => {
  const s = M.seed();
  assert.throws(() => M.saveMember(s,'head',{name:'Ana Cruz',barangay:'San Isidro'}));
  M.saveMember(s,'pca',{name:'Ana Cruz',barangay:'San Isidro',phone:''});
  assert.equal(s.members.at(-1).name,'Ana Cruz');
  assert.throws(() => M.saveSession(s,'pca',{date:M.date(2),time:'10:00',operator:s.operators[0],lots:[]}));
  assert.throws(() => M.reportLines(s,'head',s.sessions));
  assert.throws(() => M.sample(s,'pca','S0231','L01',5.8,''));
});
test('Tray allocation rejects overlapping, malformed, and duplicate ranges', () => {
  const s=M.seed(),draft={date:M.date(2),time:'09:00',operator:s.operators[0],lots:[{memberId:'M001',quantity:100,trays:'1-2'},{memberId:'M002',quantity:80,trays:'2-3'}]};
  assert.throws(()=>M.saveSession(s,'head',draft),/share a tray/);
  assert.throws(()=>M.trays('3-1'));
  assert.throws(()=>M.trays('1,1'));
  assert.throws(()=>M.trays('one'));
  draft.lots[1].trays='3-4';
  const result=M.saveSession(s,'head',draft);assert.equal(result.lots.length,2);
});
test('A second session cannot occupy the shared chamber', () => {
  const s=M.seed();assert.throws(()=>M.simulate(s,'S0232','load'),/occupied/);
});
test('Drying locks tray records and does not imply permission to unload', () => {
  const s=M.seed();
  assert.throws(()=>M.saveSession(s,'head',s.sessions[0],'S0231'),/locked/);
  assert.throws(()=>M.complete(s,'head','S0231',true));
  M.assignOperator(s,'head','S0231','Mark Dela Rosa');assert.equal(s.sessions[0].operator,'Mark Dela Rosa');
  M.simulate(s,'S0231','cooldown');
  assert.equal(s.sessions[0].status,'Cooldown');
  assert.throws(()=>M.complete(s,'head','S0231',true));
  M.simulate(s,'S0231','cooled');assert.equal(s.sessions[0].status,'Cooldown');
  M.sample(s,'head','S0231','L01',5.8,'');M.sample(s,'head','S0231','L02',5.9,'');
  M.sample(s,'head','S0231','L03',7.1,'');assert.equal(s.sessions[0].status,'Cooldown');
  M.sample(s,'head','S0231','L03',6,'');assert.equal(s.sessions[0].status,'Ready to unload');
  assert.throws(()=>M.complete(s,'head','S0231',false));
  M.complete(s,'head','S0231',true);assert.equal(s.sessions[0].status,'Completed');
  assert.throws(()=>M.assignOperator(s,'head','S0231','Mel Santos'));
  M.simulate(s,'S0232','load');assert.equal(s.sessions[2].status,'Loading');
});
test('Offline and fault scenarios block acceptance and closure; read notices do not clear faults', () => {
  const s=M.seed();M.simulate(s,'S0231','offline');
  assert.throws(()=>M.sample(s,'head','S0231','L01',5.8,''));
  M.simulate(s,'S0231','reconnect');M.simulate(s,'S0231','door');
  assert.throws(()=>M.simulate(s,'S0231','cooldown'));
  s.alerts[0].read=true;assert.equal(s.sessions[0].fault,'Door opened unexpectedly');
  M.simulate(s,'S0231','clear-fault');assert.equal(s.sessions[0].status,'Drying');
  assert.equal(s.sessions[0].fault,null);
});
test('Reports distinguish chamber estimates from measured lot samples', () => {
  const s=M.seed(),lines=M.reportLines(s,'pca',[s.sessions[0]]).join('\n');
  assert.match(lines,/9.2%/);assert.match(lines,/Sample moisture: Not recorded/);assert.match(lines,/not a measured lot result/);
  const stored=JSON.parse(JSON.stringify(s));assert.equal(stored.sessions[0].lots.length,3);
});
