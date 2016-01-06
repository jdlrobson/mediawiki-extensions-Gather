( function ( M, $ ) {
	var skinName = mw.config.get( 'skin' ),
		context = M.require( 'mobile.context/context' ),
		mobileMode = context.getMode(),
		Schema = M.require( 'mobile.startup/Schema' ),
		user = M.require( 'mobile.user/user' );

	if ( mobileMode ) {
		skinName += '-' + mobileMode;
	}
	/**
	 * @class SchemaGather
	 * @extends Schema
	 */
	function SchemaGather( options ) {
		Schema.call( this, options );
	}

	OO.mfExtend( SchemaGather, Schema, {
		/**
		 * @inheritdoc
		 */
		defaults: $.extend( {}, Schema.prototype.defaults, {
			skin: skinName,
			userId: mw.user.getId(),
			// FIXME: use mw.user when method available
			// Null when user is anon, set to 0
			userEditCount: user.getEditCount() || 0
		} ),
		/**
		 * @inheritdoc
		 */
		name: 'GatherClicks'
	} );

	M.define( 'ext.gather.logging/SchemaGather', SchemaGather );

}( mw.mobileFrontend, jQuery ) );
