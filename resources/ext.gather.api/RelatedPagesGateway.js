( function ( M, $ ) {

	/**
	 * API for managing collection items
	 *
	 * @class RelatedPagesGateway
	 * @extends Api
	 * @param {mw.Api} api
	 */
	function RelatedPagesGateway( api ) {
		this.api = api;
	}

	RelatedPagesGateway.prototype = {
		/**
		 * @method
		 * @param {String} title Title of the page to find related pages of.
		 * @param {Number} [limit] How many related pages to return. Defaults to 3.
		 * @returns {jQuery.Deferred}
		 */
		getRelatedPages: function ( title, limit ) {
			limit = limit || 3;

			return this.api.get( {
				action: 'query',
				prop: 'pageimages',
				piprop: 'thumbnail',
				pilimit: limit,
				pithumbsize: mw.config.get( 'wgMFThumbnailSizes' ).tiny,
				generator: 'search',
				gsrsearch: 'morelike:' + title,
				gsrnamespace: '0',
				gsrlimit: limit
			} ).then( cleanApiResults );
		}
	};

	/**
	 * Clean api results by extracting query.pages into an array
	 * @param {Object} results Results from the API to clean up
	 */
	function cleanApiResults( results ) {
		if ( results && results.query && results.query.pages ) {
			return $.map( results.query.pages, function ( p ) {
				return p;
			} );
		} else {
			return null;
		}
	}

	M.define( 'ext.gather.api/RelatedPagesGateway', RelatedPagesGateway, 'ext.gather.api/RelatedPagesApi' );

}( mw.mobileFrontend, jQuery ) );
