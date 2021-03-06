package com.harystolho.adexchange.repositories.proposal;

import java.util.List;

import com.harystolho.adexchange.models.Proposal;

public interface ProposalRepository {

	Proposal save(Proposal proposal);

	Proposal getById(String id);

	List<Proposal> getByAccountId(String accountId);

	void deleteById(String id);

}
