
// MIT License
// Requires jquery 1.5+

(function(window, html2canvas) {

	var scriptUrl = "html2canvas.js";

	var dependencyLoader = {

		status: "READY",

		loadLibraries: function() {
			var promise = $.Deferred();
			var self = this;

			if (typeof window.html2canvas !== 'undefined') {
				this.status = "DONE";
				promise.resolve();
			} else {
				$.getScript(scriptUrl)
					.done(self.handleLoadedScript.call(self, promise))
					.fail(self.handleFailedScript.call(self, promise));
			}
			return promise;
		},

		handleLoadedScript: function(promise) {
			this.status = "DONE";
			return promise.resolve();
		},

		handleFailedScript(promise) {
			this.status = "FAILED";
			console.error("FAILED TO LOAD HTML2CANVAS SCRIPT");
			return promise.reject();
		}
	};


	var renderer = {

		target: null,

		options: {
			logging: true,
			useCORS: true,
			effects: {
				invert: 90,
				saturate: 300,
				contrast: 30,
				brightness: 40,
				blur: 3
			}
		},

		screen: $("body"),

		canvas: null,

		filterUnits: {
			"default": "%",
			"blur": "px",
			"hue-rotate": "deg",
			"url": ""
		},


		makeScreenshot: function() {
			var self = this;
			var promise = $.Deferred();

			html2canvas(this.screen, this.options)
				.then(function(canvas) {
					self.canvas = $(canvas);
					promise.resolve();
				});

			return promise;
		},

		attachBackground: function() {
		    this.positionCanvas();
			this.target.append(this.canvas);
		},

		styleParent: function() {
			if (this.target.css("position") !== "absolute") {
				this.target.css("position", "relative");
			}
		},

		positionCanvas: function() {	
		    var dialogPos = this.target.offset();
		    var xPos = dialogPos.left - $(window).scrollLeft();
		    var yPos = dialogPos.top - $(window).scrollTop();

		    this.canvas.css('top',  '-' + yPos + 'px').css('left', '-' + xPos + 'px');
		},

		addEffects: function() {
			var self = this;
			var filterString = Object.keys(this.options.effects).reduce(function(prev, curr) {
				var value = this.options.effects[curr];
				var unit = self.filterUnits[curr] || self.filterUnits.default;

				var formatted = curr + "(" + value + unit + ") ";
				prev += curr
			}, "");

			this.canvas.css({
				"-webkit-filter": filterString,
				"filter": filterString
			});
		},

		render: function() {
			var self = this;
			this.makeScreenshot()
				.then(function() {
					self.styleParent();
				    self.addEffects();
		    		self.canvas.addClass('totesBg');
					self.attachBackground();
				});
		}
	}

	var totesBg = function(target, options) {
		options = typeof options === 'object' ? options : {};
		options.effects = typeof options.effects === 'object' ? options.effects : {};

		renderer.target = target;
		renderer.options = $.extend({}, renderer.options, options);
		renderer.options.effects = $.extend({}, renderer.options.effects, options.effects || {});

		dependencyLoader.loadLibraries(target)
			.then(renderer.render.call(renderer));

		return {

			target: $(target),

			dependencyLoader: dependencyLoader,

			renderer: renderer,

			onOpen: function() {
				this.update();
			},

			onClose: function() {
				this.clear();
			},

			update: function() {
				renderer.render(this.target);
			},

			clear: function() {
				var canvas = $(this.target).find(".totesBg");

				if (canvas.length > 0) {
					canvas.remove();
				}
			},

			setTarget: function(target, /* optional */ update) {
				this.target = $(target);

				if (typeof update !== 'undefined' && update) {
					this.update();
				}
			},

			setEffects: function(effects, /* optional */ update) {
				if (typeof effects === 'object') {
					renderer.options.effects = $.extend({}, renderer.options.effects, effects);	
				}

				if (typeof update !== 'undefined' && update) {
					this.update();
				}
			}
		}
	}

	window.TotesBg = totesBg;

})(window, window.html2canvas);