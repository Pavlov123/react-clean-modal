(function(root, factory) {
	'use strict';
	if (typeof define === 'function' && define.amd) {
		define(['react', 'jquery'], factory);
	} else if (typeof module === 'object' && module.exports) {
		module.exports = factory(require('react'), require('jquery'));
	} else {
		root.LightBox = factory(root.React, root.jQuery);
	}
}(this, function(React, $) {
	'use strict';

	var D = React.DOM;

	var lightbox_id = 1;

	var LightBox = React.createClass({
		open: function() {
			this.setState({
				open: true
			});
			this.props.onOpen();
		},
		close: function() {
			this.setState({
				open: false
			});
			this.props.onClose();
		},
		skip: function() {
			if (!this.props.noSkip) {
				this.close();
			}
		},
		is_open: function() {
			return this.state.open;
		},
		componentWillMount: function() {
			// use jquery event namespaces to avoid removing other events
			// later
			this.lightbox_id = lightbox_id;
			lightbox_id += 1;

			this.eventName = 'keyup.' + this.lightbox_id;
			$(window).on(this.eventName, function(event) {
				if (event.keyCode === 27) {
					this.skip();
				}
			}.bind(this));
		},
		componentWillUnmount: function() {
			$(window).off(this.eventName);
		},
		getDefaultProps: function() {
			return {
				noSkip: false,
				openInitial: false,
				iconclass: '__none__',
				onClose: function() {},
				onOpen: function() {}
			};
		},
		getInitialState: function() {
			return {
				open: this.props.openInitial
			};
		},
		render: function() {
			var className = 'clean-modal';
			var titleClassName = '';

			if (!this.props.title) {
				titleClassName = 'hidden';
			}

			if (!this.state.open) {
				return D.div();
			}

			if (this.props.className) {
				className = className + ' ' + this.props.className;
			}

			return D.div({className: className,},
				D.div({className: 'clean-modal-wrapper'},
					D.h1(
						{className: 'clean-modal-title ' + titleClassName},
						D.div({className: 'icon ' + this.props.iconclass}),
						D.span({}, this.props.title)
					),
					D.div({className: 'clean-modal-content'}, this.props.children),
					D.div(
						{
							className: 'clean-modal-close',
							onClick: this.skip
						},
						this.props.noSkip ? '' : '×'
					)
				),
				D.div({className: 'clean-modal-overlay', onClick: this.skip})
			);
		}
	});

	return LightBox;
}));
