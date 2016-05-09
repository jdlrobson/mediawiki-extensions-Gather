<?php

namespace Gather;

use Title;

class EchoGatherModerationHidePresentationModel extends EchoGatherModerationPresentationModel {
	public function getSecondaryLinks() {
		$criteriaTitle = Title::newFromText(
			$this->msg( 'gather-moderation-criteria-page' )->inContentLanguage()->text()
		);

		$contestTitle = Title::newFromText(
			$this->msg( 'gather-moderation-dispute-page' )->inContentLanguage()->text()
		);

		return [
			[
				'url' => $criteriaTitle->getFullURL(),
				'label' => $this->msg( 'gather-moderation-criteria-link-label' )->text(),
				'description' => $this->msg( 'gather-moderation-criteria-link-description' )->text(),
				'icon' => false,
				'prioritized' => true,
			],
			[
				'url' => $contestTitle->getFullURL(),
				'label' => $this->msg( 'gather-moderation-dispute-link-label' )->text(),
				'description' => $this->msg( 'gather-moderation-dispute-link-description' )->text(),
				'icon' => 'speechBubbles',

				// This could be made false, depending how much visibility this option requires.
				// It could also be linked from the criteria page.
				'prioritized' => true,
			],
		];
	}
}
