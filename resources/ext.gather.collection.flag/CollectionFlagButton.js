( function ( M ) {

	var CollectionsGateway = M.require( 'ext.gather.api/CollectionsGateway' ),
		CollectionFlagOverlay = M.require( 'ext.gather.collection.flag/CollectionFlagOverlay' ),
		Button = M.require( 'mobile.startup/Button' ),
		Icon = M.require( 'mobile.startup/Icon' ),
		CollectionFlagButton;

	/**
	 * A button used to flag a collection
	 * @class CollectionFlagButton
	 * @extends Button
	 */
	CollectionFlagButton = Button.extend( {
		/**
		 * @inheritdoc
		 * @cfg {Object} defaults Default options hash.
		 * @cfg {mw.Api} defaults.api
		 */
		defaults: {
			tagName: 'div',
			additionalClassNames: new Icon( {
				name: 'collection-flag',
				additionalClassNames: 'mw-ui-quiet'
			} ).getClassName(),
			title: mw.msg( 'gather-flag-collection-flag-label' )
		},
		events: {
			click: 'onCollectionFlagButtonClick'
		},
		/** @inheritdoc */
		postRender: function () {
			Button.prototype.postRender.apply( this, arguments );
			this.$el.attr( 'title', this.options.title );
		},
		/**
		 * Click handler for collection flag button
		 * @param {Object} ev Event Object
		 */
		onCollectionFlagButtonClick: function ( ev ) {
			var flagOverlay,
				gateway = new CollectionsGateway( this.options.api ),
				$flag = this.$el;
			ev.stopPropagation();
			ev.preventDefault();

			if ( !$flag.hasClass( 'disabled' ) ) {
				// Prevent multiple clicks
				$flag.addClass( 'disabled' );
				gateway.getCollection( this.options.collectionId ).done( function ( collection ) {
					flagOverlay = new CollectionFlagOverlay( {
						collection: collection
					} );
					flagOverlay.show();
					flagOverlay.on( 'collection-flagged', function () {
						// After flagging, remove flag icon.
						$flag.detach();
					} );
					flagOverlay.on( 'hide', function () {
						$flag.removeClass( 'disabled' );
					} );
				} );
			}
		}
	} );
	M.define( 'ext.gather.collection.flag/CollectionFlagButton', CollectionFlagButton );

}( mw.mobileFrontend ) );
