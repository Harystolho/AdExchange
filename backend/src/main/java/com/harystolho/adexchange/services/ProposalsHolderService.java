package com.harystolho.adexchange.services;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.harystolho.adexchange.dao.ProposalsHolderRepository;
import com.harystolho.adexchange.models.Proposal;
import com.harystolho.adexchange.models.ProposalsHolder;

@Service
public class ProposalsHolderService {

	private ProposalsHolderRepository proposalsHolderRepository;

	private AdService adService;
	private WebsiteService websiteService;

	@Autowired
	public ProposalsHolderService(ProposalsHolderRepository proposalsHolder, AdService adService,
			WebsiteService websiteService) {
		this.proposalsHolderRepository = proposalsHolder;
		this.adService = adService;
		this.websiteService = websiteService;
	}

	private void addNewProposalToAccount(String accountId, String proposalId) {
		ProposalsHolder holder = getProposalHolderByAccountId(accountId);

		holder.addNewProposal(proposalId);
		proposalsHolderRepository.save(holder);
	}

	private void addSentProposalToAccount(String accountId, String proposalId) {
		ProposalsHolder holder = getProposalHolderByAccountId(accountId);

		holder.addSentProposal(proposalId);
		proposalsHolderRepository.save(holder);
	}

	private void removeNewProposalFromAccount(String accountId, String proposalId) {

	}

	private void removeSentProposalFromAccount(String accountId, String proposalId) {

	}

	private ProposalsHolder createProposalsHolderForAccount(String accountId) {
		ProposalsHolder holder = new ProposalsHolder();
		holder.setAccountId(accountId);

		return proposalsHolderRepository.save(holder);
	}

	public void addProposal(Proposal proposal) {
		// The user that created the proposal also created the Ad in the proposal
		String senderId = getSenderIdUsingAdId(proposal.getAdId());

		// The proposal contains the website id, and it contains the creator's id
		String recieverId = getRecieverIdUsingWebsiteId(proposal.getWebsiteId());

		if (senderId.equals(recieverId)) // you can't sent a proposal to your own website
			return;

		addSentProposalToAccount(senderId, proposal.getId());
		addNewProposalToAccount(recieverId, proposal.getId());
	}

	public ProposalsHolder getProposalHolderByAccountId(String accountId) {
		ProposalsHolder ph = proposalsHolderRepository.getByAccountId(accountId);
		return ph != null ? ph : createProposalsHolderForAccount(accountId);
	}

	private String getSenderIdUsingAdId(String adId) {
		return adService.getAccountIdUsingAdId(adId);
	}

	private String getRecieverIdUsingWebsiteId(String websiteId) {
		return websiteService.getAccountIdUsingWebsiteId(websiteId);
	}

}