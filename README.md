# protractor-dalelotts-angular-bootstrap-datetimepicker
A simple protractor utility for automation of picking time on dalelotts angular date time picker.

#### Install ####
You can install this package with npm

#### npm ####
```
npm install --save protractor-utility-for-dalelotts-angular-date-time-picker
```
#### Usage ####

```javascript
var dtPicker = require('protractor-utility-for-dalelotts-angular-date-time-picker');

describe('Dalelotts date time picker', function () {
  beforeEach(function () {
    browser.get('https://dalelotts.github.io/angular-bootstrap-datetimepicker/');
  });

  it('cstm picker', function () {
    // the xpath of parent element from which the datepicker dropdown appears
    var div = '//*[@id="drop-down-input"]/div/div[1]/div/div';
    //the xpath and javascript valid date string are inputs to the utility
    dtPicker(div, '2040/07/27 22:00');
    var div1 = element(by.xpath('//*[@id="dropdown2"]/div/input'));
    div1.getAttribute('value').then(function (value) {
      console.log(value);
      expect(value).toBe('Fri Jul 27 2040 22:00:00 GMT+0530 (India Standard Time)');
    });
  });
});
```
