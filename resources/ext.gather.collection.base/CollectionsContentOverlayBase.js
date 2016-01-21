( function ( M ) {

	var ContentOverlay = M.require( 'mobile.overlays/ContentOverlay' );

	/**
	 * A clickable watchstar for managing collections
	 * @class CollectionsContentOverlayBase
	 * @extends ContentOverlay
	 */
	function CollectionsContentOverlayBase() {
		ContentOverlay.apply( this, arguments );
	}

	OO.mfExtend( CollectionsContentOverlayBase, ContentOverlay, {
		/**
		 * FIXME: re-evaluate content overlay default classes/css.
		 * @inheritdoc
		 */
		appendToElement: 'body',
		/** @inheritdoc */
		hasFixedHeader: false,
		/** @inheritdoc */
		postRender: function () {
			this.hideSpinner();
		},
		/**
		 * Reveal all interface elements and cancel the spinner.
		 */
		hideSpinner: function () {
			this.$( '.overlay-content' ).children().show();
			this.$( '.spinner' ).hide();
			// For position absolute to work the parent must have a specified height
			this.$el.parent().css( 'height', '100%' );
		},
		/**
		 * Hide all interface elements and show spinner.
		 */
		showSpinner: function () {
			this.$( '.overlay-content' ).children().hide();
			this.$( '.spinner' ).show();
		}
	} );
	M.define( 'ext.gather.collection.base/CollectionsContentOverlayBase', CollectionsContentOverlayBase );

}( mw.mobileFrontend ) );
