( function ( M, $ ) {
	var CollectionsList = M.require( 'ext.gather.collections.list/CollectionsList' ),
		$collectionsList = $( '.collections-list' ),
		owner = $collectionsList.data( 'owner' ),
		mode = $collectionsList.data( 'mode' );

	$( function () {
		new CollectionsList( {
			api: new mw.Api(),
			skin: mw.gather.getSkin(),
			el: $collectionsList,
			enhance: true,
			owner: owner,
			mode: mode
		} );
	} );

}( mw.mobileFrontend, jQuery ) );
