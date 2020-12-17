// Colors
const blue = '#0093d7';
const yellow = '#ffc815';
const green = '#a3cd3b';

// Elements with constant classes
const $display = $('.js-display');
const $string = $('.js-indicator__string');

// Start value of js-level
const startValue = 725;

// Delay of js-level changing
let blockDisplay = false;

// Converts radians to degrees
// x - angle in radians
function toDeg(x) {
	return x * 180 / Math.PI;
}

// Calculates value of transform property
// percentAngle - the value of angle in percents (from 0 to 1)
function calcAngle(percentAngle) {
	return 180 * percentAngle - 30;
}

// Changes js-level value, its color, and string position
// percentAngle - the value of angle in percents (from 0 to 1)
function changeValue(percentAngle) {
	// Elements with changing classes
	const $oldValue = $('.level-text__value_old');
	const $newValue = $('.level-text__value_new');

	// Changes string position
	$string.css({
		transform: `rotate(${calcAngle(percentAngle)}deg)`,
	});

	let newValue = +percentAngle.toFixed(3) * 1000;		// New display value
	let newColor;

	// Value of new color
	if (newValue > 660) {
		newColor = blue;
	} else if (newValue > 330) {
		newColor = green;
	} else {
		newColor = yellow;
	}

	// Changes display value
	$newValue.html(newValue);
	$newValue.css({
		opacity: '1',
		color: newColor,
	});

	$oldValue.css({
		opacity: '0',
	});

	blockDisplay = true;

	setTimeout(() => {
		$newValue.removeClass('level-text__value_new');
		$newValue.addClass('level-text__value_old');
		$oldValue.removeClass('level-text__value_old');
		$oldValue.addClass('level-text__value_new');
		$oldValue.html('');

		blockDisplay = false;
	}, 1000);
}

changeValue(startValue / 1000);

$display.on('click', (event) => {
	if (!blockDisplay) {
		const displayRect = $display[0].getBoundingClientRect();				// Rect info about display
		const radius = displayRect.width / 2;									// radius of display
		const mouseX = event.pageX - displayRect.x;								// Mouse x-position inside display
		const mouseY = event.pageY - displayRect.y - window.pageYOffset + 1;	// Mouse y-position inside display

		// Cathetus for calculating angle,
		// distance between center of display and x-coord of mouse position
		let cathetus = radius - mouseX;
		let angle;

		if (cathetus === 0) {
			angle = 90;
		} else {
			let tg = (radius - mouseY) / cathetus;
			angle = toDeg(Math.atan(tg));
		}

		// Angle in percents (from 0 to 1)
		let percentAngle = cathetus < 0 ? (180 + angle) / 180 : angle / 180;
		changeValue(percentAngle);
	}
});
