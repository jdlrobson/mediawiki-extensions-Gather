( function ( M, $ ) {

	var toast = M.require( 'mobile.toast/toast' ),
		icons = M.require( 'mobile.startup/icons' ),
		CollectionsContentOverlayBase = M.require( 'ext.gather.collection.base/CollectionsContentOverlayBase' );

	/**
	 * Action confirmation overlay base class
	 * @extends CollectionsContentOverlayBase
	 * @class ConfirmationOverlay
	 */
	function ConfirmationOverlay( options ) {
		var collection = options.collection;
		CollectionsContentOverlayBase.apply( this, arguments );
		if ( !collection ) {
			// use toast
			toast.show( options.unknownCollectionError, 'toast error' );
		} else {
			this.id = collection.id;
		}
	}

	OO.mfExtend( ConfirmationOverlay, CollectionsContentOverlayBase, {
		/** @inheritdoc */
		className: 'collection-confirmation-overlay content-overlay position-fixed',
		/** @inheritdoc */
		defaults: $.extend( {}, CollectionsContentOverlayBase.prototype.defaults, {
			fixedHeader: false,
			collection: null,
			spinner: icons.spinner().toHtmlString(),
			unknownCollectionError: mw.msg( 'gather-error-unknown-collection' ),
			cancelButtonClass: 'mw-ui-progressive',
			cancelButtonLabel: mw.msg( 'gather-confirmation-cancel-button-label' )
		} ),
		/** @inheritdoc */
		events: $.extend( {}, CollectionsContentOverlayBase.prototype.events, {
			'click .cancel': 'onCancelClick'
		} ),
		/** @inheritdoc */
		templatePartials: $.extend( {}, CollectionsContentOverlayBase.prototype.templatePartials, {
			content: mw.template.get( 'ext.gather.collection.confirm', 'confirmationOverlay.hogan' )
		} ),
		/**
		 * Event handler when the cancel button is clicked.
		 */
		onCancelClick: function () {
			this.hide();
		}
	} );

	M.define( 'ext.gather.collection.confirm/ConfirmationOverlay', ConfirmationOverlay );

}( mw.mobileFrontend, jQuery ) );
