( function ( M, $ ) {

	var CollectionsApi = M.require( 'ext.gather.watchstar/CollectionsApi' ),
		toast = M.require( 'toast' ),
		overlayManager = M.require( 'overlayManager' );

	overlayManager.add( /^\/collection\/(.*)\/(.*)$/, function ( action, id ) {
		var d = $.Deferred(),
			api = new CollectionsApi();

		api.getCollection( id ).done( function ( collection ) {
			if ( collection ) {
				if ( action === 'edit' ) {
					mw.loader.using( 'ext.gather.collection.editor' ).done( function () {
						var CollectionEditOverlay = M.require( 'ext.gather.edit/CollectionEditOverlay' );
						d.resolve(
							new CollectionEditOverlay( {
								collection: collection
							} )
						);
					} );
				} else if ( action === 'delete' ) {
					mw.loader.using( 'ext.gather.collection.delete' ).done( function () {
						var CollectionDeleteOverlay = M.require( 'ext.gather.delete/CollectionDeleteOverlay' );
						d.resolve(
							new CollectionDeleteOverlay( {
								collection: collection
							} )
						);
					} );
				} else {
					toast.show( mw.msg( 'gather-no-such-action' ), 'error' );
				}
			} else {
				toast.show( mw.msg( 'gather-unknown-error' ), 'error' );
			}
		} );
		return d;
	} );

}( mw.mobileFrontend, jQuery ) );