package com.harystolho.adserver.tracker.repository;

import com.harystolho.adserver.tracker.UserInteraction;

public interface UserInteractionRepository {

	public UserInteraction getByInteractorId(String interactorId);

	public void save(UserInteraction userInteraction);
}
