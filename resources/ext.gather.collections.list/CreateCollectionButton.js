( function ( M ) {

	var CollectionEditOverlay = M.require( 'ext.gather.collection.edit/CollectionEditOverlay' ),
		Button = M.require( 'mobile.startup/Button' ),
		Icon = M.require( 'mobile.startup/Icon' );

	/**
	 * A button used to create a collection
	 * @class CreateCollectionButton
	 * @extends Button
	 */
	function CreateCollectionButton() {
		Button.apply( this, arguments );
	}
	OO.mfExtend( CreateCollectionButton, Button, {
		/**
		 * @inheritdoc
		 * @cfg {Object} defaults Default options hash.
		 */
		defaults: {
			tagName: 'div',
			progressive: true,
			label: mw.msg( 'gather-create-collection-button-label' ),
			additionalClassNames: new Icon( {
				tagName: 'span',
				name: 'collections-icon',
				hasText: true
			} ).getClassName()
		},
		events: {
			click: 'onCreateCollectionButtonClick'
		},
		/**
		 * Click handler for create collection button
		 * @param {Object} ev Event Object
		 */
		onCreateCollectionButtonClick: function ( ev ) {
			var editOverlay;
			ev.stopPropagation();
			ev.preventDefault();
			editOverlay = new CollectionEditOverlay( {
				reloadOnSave: true,
				api: new mw.Api()
			} );
			editOverlay.show();
		}
	} );
	M.define( 'ext.gather.collections.list/CreateCollectionButton', CreateCollectionButton );

}( mw.mobileFrontend ) );
