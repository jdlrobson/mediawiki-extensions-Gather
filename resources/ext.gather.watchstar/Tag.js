// jscs:disable requireCamelCaseOrUpperCaseIdentifiers
( function ( M ) {

	var View = M.require( 'mobile.view/View' );

	/**
	 * A tag with a label
	 * @class Tag
	 * @extends View
	 */
	function Tag() {
		View.call( this );
	}

	OO.mfExtend( Tag, View, {
		className: 'gather-tag',
		template: mw.template.get( 'ext.gather.watchstar', 'Tag.hogan' )
	} );
	M.define( 'ext.gather.watchstar/Tag', Tag );

}( mw.mobileFrontend ) );
