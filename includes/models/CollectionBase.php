<?php

/**
 * CollectionBase.php
 */

namespace Gather\models;

use User;
use Title;
use SpecialPage;

/**
 * Base model for a Collection.
 */
abstract class CollectionBase implements WithImage, ArraySerializable {

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
	 * Whether collection has been hidden
	 *
	 * @var bool
	 */
	protected $hidden;

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
	 * @param File $image Image that represents the collection
	 */
	public function __construct( $id = null, $user = null, $title = '', $description = '',
		$public = true, $image = null ) {
		$this->id = $id;
		$this->owner = $user;
		$this->title = $title;
		$this->description = $description;
		$this->public = $public;
		$this->image = $image;
		$this->isWatchlist = $this->id === 0;
	}

	/**
	 * @return int id The internal id of a collection
	 */
	public function getId() {
		return $this->id;
	}

	/**
	 * @return boolean whether the collection is a watchlist.
	 */
	public function isWatchlist() {
		return $this->isWatchlist;
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
	 * Marks the collection as hidden.
	 */
	public function setHidden() {
		$this->hidden = true;
	}

	/**
	 * Returns if the list has been hidden by an admin.
	 *
	 * @return boolean
	 */
	public function isHidden() {
		return $this->hidden;
	}

	/**
	 * Returns items count
	 *
	 * @return int count of items in collection
	 */
	abstract public function getCount();

	/**
	 * Return local url for collection
	 * Example: /wiki/Special:Gather/by/user/id
	 *
	 * @param array [$args] optional query string parameters
	 * @return string localized url for collection
	 */
	public function getUrl( $args = [] ) {
		return isset( $this->url ) ? $this->url : SpecialPage::getTitleFor( 'Gather' )
			->getSubpage( 'id' )
			->getSubpage( $this->getId() )
			->getSubpage( $this->getTitle() )
			->getLocalURL( $args );
	}

	/**
	 * Get url of owner.
	 *
	 * @return string|boolean url of owner's Gather page or false if no owner associated
	 *  with collection.
	 */
	public function getOwnerUrl() {
		$owner = $this->getOwner();
		if ( $owner->getName() ) {
			return SpecialPage::getTitleFor( 'Gather' )
				->getSubpage( 'by' )
				->getSubPage( $owner->getName() )->getLocalUrl();
		} else {
			return false;
		}
	}
	/**
	 * Define the local url for which the collection can be accessed
	 *
	 * @param string $url for accessing the collection minus any query string parameters
	 */
	public function setUrl( $url ) {
		$this->url = $url;
	}

	/** @inheritdoc */
	public function toArray() {
		$data = [
			'id' => $this->id,
			'owner' => $this->owner->getName(),
			'title' => $this->title,
			'description' => $this->description,
			'public' => $this->public,
			'isWatchlist' => $this->isWatchlist,
			'image' => $this->image ? $this->image->getTitle()->getText() : null
		];
		return $data;
	}

	/**
	 * @inheritdoc
	 */
	public function hasImage() {
		return (bool)$this->image;
	}

	/**
	 * @inheritdoc
	 */
	public function getFile() {
		return $this->image;
	}

	/**
	 * Returns if the user is the owner of the collection/list
	 * @param User $user user to check if it is the owner
	 * @return boolean
	 */
	public function isOwner( User $user ) {
		if ( $this->owner ) {
			return $this->owner->equals( $user );
		} else {
			// if owner is null then there can be no owner
			return false;
		}
	}

}
