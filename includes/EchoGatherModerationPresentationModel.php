<?php

namespace Gather;

use EchoEventPresentationModel;

class EchoGatherModerationPresentationModel extends EchoEventPresentationModel {
	public function canRender() {
		// We only need to potentially block rendering if we're notifying someone
		// other than the person who wrote the content.

		// We can just return true if we're only notifying the collection
		// owner.
		return true;
	}

	public function getIconType() {
		return 'placeholder';
	}

	public function getHeaderMessage() {
		$msg = parent::getHeaderMessage();
		$msg->params( $this->getViewingUserForGender() );

		return $msg;
	}

	public function getPrimaryLink() {
		$title = $this->event->getTitle();
		$labelMsg = $this->msg( 'gather-moderation-notification-primary-link-text' );

		return [
			'url' => $title->getFullURL(),
			'label' => $labelMsg->params( $this->getViewingUserForGender() )->text(),
		];
	}
}
