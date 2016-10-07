/**
 * main function that does all the magic.
 * @param {string} parent -- xpath of Parent element from which the calendar dropdown appears
 * @param {string} jsDateString -- This should be a valid js date string
 * @param {string} [triggerElement] -- xpath of Optional triggerElement that would trigger the dropdown.
 */
function pickDate (parent, jsDateString, triggerElement) {
  // Convert the provided date string into date object
  var dt = new Date(jsDateString);

  // Determine AM/PM
  var ampm = dt.getHours() >= 12 ? 'PM' : 'AM';

  // Convert hours to 12hr format
  var hours = (ampm === 'PM') ? dt.getHours() - 12 : dt.getHours();

  // -Start- Minutes(00-60) will in multiples of 5
  var minutes = dt.getMinutes();
  var rem = minutes % 5;
  minutes = rem < 3 ? (minutes - rem) : (minutes - rem + 5);
  minutes = minutes <= 5 ? '0' + minutes : minutes;
  // -End- Minutes(00-60) will in multiples of

  // Months array
  var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  // Get the parent element from the xpath
  var div = element(by.xpath(parent));

  // If triggerElement is passed, we perform a click on it else falls back to parent
  if (triggerElement) {
    element(by.xpath(triggerElement)).click();
  } else {
    // Clicking on parent element to get the dropdown
    div.click();
  }

  // -Start- Resolving the calendar elements based on the parent element
  var leftArrowElement = div.element(by.css('th.left'));
  var rightArrowElement = div.element(by.css('th.right'));
  var switchElement = div.element(by.css('.switch'));
  var yearElement = div.element(by.cssContainingText('.year', dt.getFullYear()));
  var monthElement = div.element(by.cssContainingText('.month', months[dt.getMonth()]));
  var dayElement = div.element(by.cssContainingText('td:not(.past)', dt.getDate()));
  var hourElementArr = div.all(by.cssContainingText('.hour', hours + ':00 ' + ampm));
  var minuteElement = div.element(by.cssContainingText('.minute', hours + ':' + minutes + ' ' + ampm));
  // -End- Resolving the calendar elements based on the parent element

  // -Start- Double Click on the switch element to arrive @ years selection
  switchElement.click();
  switchElement.click();
  // -End- Double Click on the switch element to arrive @ years selection

  // -Start- Determine how many times to click left/right icons to arrive @ provided year
  var dtrange = '';
  switchElement.getText().then(function (val) {
    dtrange = val;
  });

  // Waiting for above promise to resolve
  protractor.promise.controlFlow().execute(function () {
    // Splitting the date range to get start and end years
    var currentYear = dtrange.split('-');
    var startYear = currentYear[0];
    var endYear = currentYear[1];
    var providedYear = dt.getFullYear();
    var tmp = '';
    var whichDirection = '';
    if (startYear > providedYear) {
      tmp = endYear - providedYear;
      tmp = +(('' + (tmp / 10)).split('.')[0]);
      whichDirection = leftArrowElement;
    } else if (providedYear > endYear) {
      tmp = providedYear - endYear;
      tmp = +(('' + (tmp / 10)).split('.')[0]);
      tmp = tmp + 1;
      whichDirection = rightArrowElement;
    }
    // -End- Determine how many times to click left/right icons to arrive @ year

    // Click through either the left or right arrow to arrive @ the provided year on the UI
    for (var i = 0; i < tmp; i++) {
      whichDirection.click();
    }

    // Click on year,month,day,hours,minutes
    clickIfElemPresent(yearElement);
    clickIfElemPresent(monthElement);
    clickIfElemPresent(dayElement);
    var hourElement = hourElementArr.first();
    hourElementArr.each(function (element, index) {
      element.getText().then(function (text) {
        if (text === hours + ':00 ' + ampm) {
          hourElement = element;
        }
      });
    });
    protractor.promise.controlFlow().execute(function () {
      clickIfElemPresent(hourElement);
      clickIfElemPresent(minuteElement);
    });
  });
}

/**
 * This method clicks on the provided element only if the element is present.
 */
function clickIfElemPresent (ele) {
  ele.isPresent().then(function (result) {
    if (result) {
      ele.click();
    }
  });
}

module.exports = pickDate;
