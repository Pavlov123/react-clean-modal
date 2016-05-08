(function(root, factory) {
	'use strict';
	if (typeof define === 'function' && define.amd) {
		define(['react'], factory);
	} else if (typeof module === 'object' && module.exports) {
		module.exports = factory(require('react'));
	} else {
		root.LightBox = factory(root.React);
	}
}(this, function(React) {
	'use strict';

	var D = React.DOM;

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
			if (typeof this.props.open !== 'undefined') {
				return this.props.open;
			}

			return this.state.open;
		},
		componentWillMount: function() {
			this.keyupListener = function(event) {
				if (event.keyCode === 27) {
					this.skip();
				}
			}.bind(this);

			window.addEventListener('keyup', this.keyupListener);
		},
		componentWillUnmount: function() {
			window.removeEventListener('keyup', this.keyupListener);
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

			if (!this.is_open()) {
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
					D.div(
						{className: 'clean-modal-content'},
						this.props.children
					),
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
