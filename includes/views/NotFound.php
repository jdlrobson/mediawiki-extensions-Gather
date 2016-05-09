<?php
/**
 * NotFound.php
 */

namespace Gather\views;

use Html;

/**
 * Renders an error when the user wasn't found
 */
class NotFound extends View {

	/**
	 * @inheritdoc
	 */
	public function getTitle() {
		return wfMessage( 'mobile-frontend-generic-404-title' )->text();
	}

	/**
	 * @inheritdoc
	 */
	public function getHtml( $data = [] ) {
		// FIXME: Showing generic not found error right now. Show user not found instead
		$html = Html::openElement( 'div', [ 'class' => 'collection not-found content' ] );
		$html .= Html::element( 'span', [ 'class' => 'mw-ui-anchor mw-ui-destructive' ],
			wfMessage( 'mobile-frontend-generic-404-desc' )->escaped() );
		$html .= Html::closeElement( 'div' );
		return $html;
	}

}
