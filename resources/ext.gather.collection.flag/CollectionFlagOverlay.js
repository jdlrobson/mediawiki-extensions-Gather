( function ( M, $ ) {

	var ConfirmationOverlay = M.require( 'ext.gather.collection.confirm/ConfirmationOverlay' ),
		toast = M.require( 'mobile.toast/toast' );

	/**
	 * Overlay for deleting a collection
	 * @extends ConfirmationOverlay
	 * @class CollectionFlagOverlay
	 */
	function CollectionFlagOverlay() {
		ConfirmationOverlay.apply( this, arguments );
	}

	OO.mfExtend( CollectionFlagOverlay, ConfirmationOverlay, {
		/** @inheritdoc */
		defaults: $.extend( {}, ConfirmationOverlay.prototype.defaults, {
			flagSuccessMsg: mw.msg( 'gather-flag-collection-success' ),
			subheading: mw.msg( 'gather-flag-collection-heading' ),
			confirmMessage: mw.msg( 'gather-flag-collection-confirm' ),
			confirmButtonClass: 'mw-ui-destructive',
			confirmButtonLabel: mw.msg( 'gather-flag-collection-flag-label' )
		} ),
		/** @inheritdoc */
		events: $.extend( {}, ConfirmationOverlay.prototype.events, {
			'click .confirm': 'onFlagClick'
		} ),
		/**
		 * Event handler when the delete button is clicked.
		 */
		onFlagClick: function () {
			var self = this;
			this.showSpinner();
			// disable buttons
			this.$( '.confirm, .cancel' ).prop( 'disabled', true );
			mw.track( 'gather.schemaGatherFlags', {
				collectionId: self.id
			} );
			toast.show( self.options.flagSuccessMsg, 'toast' );
			self.emit( 'collection-flagged' );
			self.hide();
		},
		/**
		* Override Overlay:onExit function as this overlay is not controlled by OverlayManager
		*/
		onExit: function () {}
	} );

	M.define( 'ext.gather.collection.flag/CollectionFlagOverlay', CollectionFlagOverlay );

}( mw.mobileFrontend, jQuery ) );
