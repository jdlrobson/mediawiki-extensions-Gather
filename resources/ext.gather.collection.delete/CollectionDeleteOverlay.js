( function ( M, $ ) {

	var CollectionDeleteOverlay,
		SchemaGather = M.require( 'ext.gather.logging/SchemaGather' ),
		schema = new SchemaGather(),
		toast = M.require( 'mobile.toast/toast' ),
		CollectionsGateway = M.require( 'ext.gather.api/CollectionsGateway' ),
		ConfirmationOverlay = M.require( 'ext.gather.collection.confirm/ConfirmationOverlay' );

	/**
	 * Overlay for deleting a collection
	 * @extends ConfirmationOverlay
	 * @class CollectionDeleteOverlay
	 */
	CollectionDeleteOverlay = ConfirmationOverlay.extend( {
		/**
		 * @inheritdoc
		 * @cfg {Object} defaults Default options hash.
		 * @cfg {mw.Api} defaults.api
		 */
		defaults: $.extend( {}, ConfirmationOverlay.prototype.defaults, {
			deleteSuccessMsg: mw.msg( 'gather-delete-collection-success' ),
			deleteFailedError: mw.msg( 'gather-delete-collection-failed-error' ),
			subheading: mw.msg( 'gather-delete-collection-heading' ),
			confirmMessage: mw.msg( 'gather-delete-collection-confirm' ),
			confirmButtonClass: 'mw-ui-destructive',
			confirmButtonLabel: mw.msg( 'gather-delete-collection-delete-label' )
		} ),
		/** @inheritdoc */
		events: {
			'click .cancel': 'onCancelClick',
			'click .confirm': 'onDeleteClick'
		},
		/** @inheritdoc */
		initialize: function ( options ) {
			this.gateway = new CollectionsGateway( options.api );
			ConfirmationOverlay.prototype.initialize.apply( this, arguments );
		},
		/**
		 * Event handler when the delete button is clicked.
		 */
		onDeleteClick: function () {
			var self = this;
			this.showSpinner();
			// disable button and inputs
			this.$( '.confirm, .cancel' ).prop( 'disabled', true );
			this.gateway.removeCollection( this.id ).done( function () {
				schema.log( {
					eventName: 'delete-collection'
				} ).always( function () {
					self.$( '.spinner' ).hide();
					// Show toast after reloading
					toast.showOnPageReload( self.options.deleteSuccessMsg, 'toast' );
					self.hide();
					// Go to the collections list page as collection will no longer exist
					window.location.href = mw.util.getUrl( 'Special:Gather' );
				} );
			} ).fail( function ( errMsg ) {
				toast.show( self.options.deleteFailedError, 'toast error' );
				self.hide();
				// Make it possible to try again.
				self.$( '.confirm, .cancel' ).prop( 'disabled', false );
				schema.log( {
					eventName: 'delete-collection-error',
					errorText: errMsg
				} );
			} );
		}
	} );

	M.define( 'ext.gather.collection.delete/CollectionDeleteOverlay', CollectionDeleteOverlay );

}( mw.mobileFrontend, jQuery ) );
