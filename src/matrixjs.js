/**
* Bryan 'Rice' Portillo | Matrix 1.0
* 
* No Copyright so far
* Sin Copyright por el momento
* 
* This project is just a hobbie, created by Bryan 'Rice' Portillo,
* reproduction is totally allowed as this code is just for fun.
* 
* Este proyecto es solamente un hobbie, creado por Bryan 'Rice' Portillo,
* cualquier reproduccion es permitida debido a que este codigo tiene 
* fines unicamente de entretenimiento.
* 
* @version 1.0
* @author Bryan Portillo,
*/
(function ( $ ) {
	var Bit = function ($el, options) {
		$.extend(this.values, options);
		this.el = $el;
		this.init();
		return $.extend($el, this);
	};
	Bit.prototype = {
		el : null,
		runsLeft: null,
		intervalId: null,
		values : {
			'char' : '',
			'colors' : [],
			'characters' : {},
			'probabilities' : {},
			height: '10',
			getRandom : function(){},
			interval : 10 
		},
		getChartype : function () {
			var rand = this.values.getRandom();
			for(p in this.values.probabilities){
				if (rand <= this.values.probabilities[p]) {
					return p;
				}
			}
		},
		createChar : function () {
			var chartype = this.getChartype();
			var len = this.values.characters[chartype].length - 1;
			this.char = this.values.characters[chartype][this.values.getRandom(0, len)];
			return this.char;	
		},
		init : function() {
			this.runs = this.values.getRandom(1, 5);
			this.update(this.el);
			var _this = this;
			_this.intervalId = setInterval(function(){
				_this.update(_this.el);
				_this.runs--;
				if(typeof _this.runs === 'undeined' || _this.runs <= 0) {
					_this.stop();
					return;
				}
			}, 5);
			
		},
		update : function(elem) {
			elem.text(this.createChar());
		},
		stop : function() {
			//Just clear the interval, update the running flag and set all elements to a dark color for visual effects.
			clearInterval(this.intervalId);
			if(this && this.hasOwnProperty('parent')) {
				this.parent().childrent('span.bit').text(0);
			}
		}
	};
	/**
	* this will create the columns in which the letter (Bytes)
	*/
	var Column = function($el, options) {
		this.init($el, options);
		return $.extend($el, this);
	};
	Column.prototype = {
		values : {
			range : 5,
			delay : 0,
			height: 0,
			bitHeight: 14,
			id: null,
		},
		bits : {},
		intervalId : null,
		timerId: null,
		el : null,
		isRunning : false,
		stop: function () {
			clearInterval(this.intervalId);
			this.children('span').css('color', this.values.colors.darkest).text(0);
			this.isRunning = false;
		},
		run : function () {
			//This is the main function, createBit is the one responsible for creating and updating letters showing in columns
			var _this = this;
			_this.timerId = setTimeout(function(column){
				column.isRunning = true;
				_this.intervalId = setInterval(function(column){
					column.createBit();
					if(column.isFull()) {
						column.stop();
						return;
					}
				}, _this.values.getRandom(0, 150), column);//Give the animaiton a delay to create a better matrix effect, each span will be updated in a separate thread
			}, _this.delay, _this);
		},
		init : function ($el, options) {
			this.values = $.extend(this.values, options);
			this.el = $el;
		},
		isFull : function () {//check if the column would be overflown by adding an additional character.
			var selector = 'span.bit';
			var contentHeight = (this.children(selector).length * this.values.bitHeight) + this.values.bitHeight;
			return (contentHeight > this.values.height);
		},
		createBit : function() {
			var _this = this;
			if (_this.isFull()) {//Dont add any more characters
				return;
			}
			//append a new char to the column, also create an object attached to the span to update the chars inside of it
			var bit =  $('<span>')
				.addClass('bit')
				.css('height', this.values.bitHeight);
			_this.append(bit);
			var matrixBit = new Bit(bit, this.values);
			var bitIndex = _this.attr('id');
			_this.bits[bitIndex] = _this.bits[_this.attr('id')] || [];
			_this.bits[bitIndex].push(matrixBit);
			var bitCount = _this.bits[bitIndex].length ;
			var maxBits = bitCount < 10 ? bitCount : 10;
			//Update the Bit's colors to give it a nice matrix like effect
			for(var fadeIdx = 2; fadeIdx <= maxBits; fadeIdx = fadeIdx + 1) {
				if(typeof _this.bits[bitIndex][bitCount - fadeIdx] !== 'undefined') {
					switch (fadeIdx) {
						case 1:
						case 2:
						case 3:
						case 4:
							_this.bits[bitIndex][bitCount - fadeIdx].css('color', this.values.colors['light']);
							break;
						case 5:
						case 6:
						case 7:
							_this.bits[bitIndex][bitCount - fadeIdx].css('color', this.values.colors['med']);
							break;
						case 8:
							_this.bits[bitIndex][bitCount - fadeIdx].css('color', this.values.colors['dark']);
							break;
						case 9:
						case 10:
							_this.bits[bitIndex][bitCount - fadeIdx].css('color', this.values.colors['darkest']);
							break;
					}
				}
			}
			
		},
	};

	var Matrix = function(el, options) {
		$.extend(this.values, options);
		if(!this.hasValidOptions()) {
			return;
		}
		this.init(el);
		this.enterTheMatrix();
		return el;
	};
	Matrix.prototype = {
		values : {
			'colors': {
				'darkest' : '#36ba01', 
				'dark' :'#009a22', 
				'med' : '#00ff2b', 
				'light' : '#aaff2b', 
				'lightest' : '#ddffaa'
			},
			'characters' : {
				'hiragana': ['あ','い','う','え','お','つ','て','と','な','ぬ','の','は','ひ','へ','ま','む','も','や','ゆ','よ','り','れ','ゎ','ゐ','を'],
				'numbers': [1,2,3,4,5,6,7,8,9,0],
				'letters': ['a','A','b','B','c','C','d','D','e','E','f','F','g','G','h','H','i','I','j','J','k','K','l','L','m','M','n','N','o','O','p','P','q','Q','r','R','s','S','t','T','u','U','v','V','w','W','x','X','y','Y','z','Z'],
				'kanjis':  ['強','三','上','二','休','何','元','免','金','早','最','勉','ー','十','士','水','火','災','魚','黒','空','中','川','犬','木','安','花','強','文','村','人','車','内','元','刊','タ','子','市','千','手'],
			},
			'probabilities' : {
				'hiragana': 27,
				'numbers': 47,
				'letters': 70,
				'kanjis':  100,
			},
			'density': 'normal',
			'size' : 'fullScreen'
		},
		hasValidOptions : function(){
			var validates = ['characters', 'colors', 'probabilities'];
			var messages = [];
			var valid = true;
			for (var v in validates) {
				if($.isEmptyObject(this.values[validates[v]])) {
					messages.push('This plugin requires to have ' + validates[v] + ' set!');
					valid = false;
				}
			}
			if(!valid){
				alert(messages.join('\n'));
			}
			return valid;
		},
		columns : [],
		densities : {
			'normal' : 15,
			'high' : 10,
			'low' : 20,
		},
		init : function(element) {
			$.extend(this, element);
			this.values.hiraganaCount = this.values.characters.hiragana.length;
			this.values.numbersCount = this.values.characters.numbers.length;
			this.values.ettersCount = this.values.characters.letters.length;
			this.values.kanjisCount = this.values.characters.kanjis.length;
			this.values.density = this.densities[this.values.density] || 15;
			this.values.size = typeof this.values.size === 'string' ? this.values.size.split('x') : 'fullScreen';
			var _this = this;
			this.each(function(){
				if (typeof size === 'object' && size.length > 0 && size[0] > 0 && size[1] > 0) {
					_this.css('width', size[0]);
					_this.css('height', size[1]);
				} else {
					_this.addClass('matrix fullScreen');
				}
				_this.css('background-color', '#000');
				_this.createColumns(_this.css('width').replace('px', ''), _this.css('height').replace('px', ''));
			});
			
		},
		enterTheMatrix : function() {
			for(var c in this.columns) {
				if(!this.columns[c].isRunning) {
					this.columns[c].run();
				}
			}
		},
		createColumns : function(width, height) {
			var columns = Math.floor(width / this.values.density, 0);
			for(var column = 0; column < columns - 1; column=column+1){
				var col = $('<div>')
					.attr('id', 'matrix-col-' + column)
					.addClass('matrix-column')
					.css('width', this.values.density + 'px')
					.data('index', column)
				this.append(col);
				var matrixColumn = new Column(col, $.extend({
					delay : this.getRandom(0, 50),
					height: height,
					getRandom : this.getRandom,
					id: column,
				}, this.values));
				this.columns.push(matrixColumn);
			}
		},
		//This will be used a lot for this plugin, 'extended' it to colums and bits through $.extend when creating columns.
		getRandom : function(min, max) {
			min = min || 0;
			max = max || 100;
			return Math.floor(Math.random() * ((max - min) + min));
		}
	}
	$.fn.matrix = function(options) {
		this.matrix = new Matrix(this.first(), options);
	}
	
}( jQuery ));
