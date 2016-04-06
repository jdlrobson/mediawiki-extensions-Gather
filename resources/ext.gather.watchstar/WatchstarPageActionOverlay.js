( function ( M, $ ) {
	var PageActionOverlay = M.require( 'mobile.contentOverlays/PointerOverlay' );

	/**
	 * @class WatchstarPageActionOverlay
	 * @extends PageActionOverlay
	 * @param {Object} options
	 */
	function WatchstarPageActionOverlay( options ) {
		PageActionOverlay.call( this, options );
	}

	OO.mfExtend( WatchstarPageActionOverlay, PageActionOverlay, {
		className: PageActionOverlay.prototype.className + ' slide active editing',
		events: $.extend( {}, PageActionOverlay.prototype.events, {
			'click .cancel': 'onCancelClick',
			'click .actionable': 'onActionClick'
		} ),
		defaults: {
			summary: mw.msg( 'gather-add-to-collection-summary', mw.config.get( 'wgTitle' ) ),
			confirmMsg: mw.msg( 'gather-add-to-collection-confirm' ),
			cancelMsg: mw.msg( 'gather-add-to-collection-cancel' )
		},
		/**
		 * Event handler for cancelling the overlay
		 * @emits cancel
		 */
		onCancelClick: function () {
			this.hide();
			/**
			 * @event cancel
			 */
			this.emit( 'cancel' );
			mw.track( 'gather.schemaGatherClicks', {
				eventName: 'dismiss-onboarding'
			} );
		},
		/**
		 * Event handler for cancelling the overlay
		 * @emits action
		 * @param {jQuery.Event} ev
		 */
		onActionClick: function ( ev ) {
			this.hide();
			/**
			 * @event action
			 */
			this.emit( 'action', ev );
		}
	} );

	M.define( 'ext.gather.watchstar/WatchstarPageActionOverlay', WatchstarPageActionOverlay );
}( mw.mobileFrontend, jQuery ) );
