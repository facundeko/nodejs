/**
* Usage (from root directory): node test/test.js | node_modules/.bin/tap-spec
*/

var test = require('tape');

test('timing test', function (t) {
    t.plan(2);
    
    t.equal(typeof Date.now, 'function');
    t.equal(typeof Date.now, 'function');
});