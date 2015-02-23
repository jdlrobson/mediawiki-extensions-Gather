<?php

/**
 * CollectionBase.php
 */

namespace Gather\models;

use \User;
use \Title;
use \SpecialPage;

/**
 * Base model for a Collection.
 */
abstract class CollectionBase implements WithImage {

	/**
	 * The internal id of a collection
	 *
	 * @var int id
	 */
	protected $id;

	/**
	 * Owner of collection
	 * @var User
	 */
	protected $owner;

	/**
	 * @var string
	 */
	protected $title;

	/**
	 * @var string
	 */
	protected $description;

	/**
	 * Whether collection is public or private
	 * Collection by default is true
	 *
	 * @var bool
	 */
	protected $public;

	/**
	 * Image that represents the collection.
	 *
	 * @var File
	 */
	protected $image;

	/**
	 * @param int $id id of the collection. Null if not persisted yet
	 * @param User $user User that owns the collection
	 * @param string $title Title of the collection
	 * @param string $description Description of the collection
	 * @param boolean $public Whether the collection is public or private
	 * @param File Image that represents the collection
	 */
	public function __construct( $id = null, User $user, $title = '', $description = '',
		$public = true, $image = null) {
		$this->id = $id;
		$this->owner = $user;
		$this->title = $title;
		$this->description = $description;
		$this->public = $public;
		$this->image = $image;
	}

	/**
	 * @return int id The internal id of a collection
	 */
	public function getId() {
		return $this->id;
	}

	/**
	 * @return User
	 */
	public function getOwner() {
		return $this->owner;
	}

	/**
	 * @return string
	 */
	public function getTitle() {
		return $this->title;
	}

	/**
	 * @return string
	 */
	public function getDescription() {
		return $this->description;
	}

	/**
	 * Returns if the list is public
	 *
	 * @return boolean
	 */
	public function isPublic() {
		return $this->public;
	}

	/**
	 * Returns items count
	 *
	 * @return int count of items in collection
	 */
	abstract public function getCount();

	/**
	 * Return local url for collection
	 * Example: /wiki/Special:Gather/user/id
	 *
	 * @return string localized url for collection
	 */
	public function getUrl() {
		return SpecialPage::getTitleFor( 'Gather' )
			->getSubpage( $this->getOwner() )
			->getSubpage( $this->getId() )
			->getLocalURL();
	}

	/**
	 * Serialise to JSON
	 */
	public function toJSON() {
		$data = array(
			'id' => $this->id,
			'owner' => $this->owner->getName(),
			'title' => $this->title,
			'description' => $this->description,
			'public' => $this->public,
			'image' => $this->image->getTitle()
		);
		return $data;
	}

	/**
	 * @inheritdoc
	 */
	public function hasImage() {
		return $this->image ? true : false;
	}

	/**
	 * @inheritdoc
	 */
	public function getFile() {
		return $this->image;
	}

}
