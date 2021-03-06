package com.harystolho.adexchange.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestAttribute;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.harystolho.adexchange.models.Contract;
import com.harystolho.adexchange.services.ContractService;
import com.harystolho.adexchange.services.ServiceResponse;
import com.harystolho.adexchange.utils.AEUtils;

@RestController
@CrossOrigin(origins = AEUtils.corsOrigin)
public class ContractController {

	private ContractService contractService;

	@Autowired
	public ContractController(ContractService contractService) {
		this.contractService = contractService;
	}

	@GetMapping("/api/v1/contracts/me")
	/**
	 * @param owner if TRUE only returns the contracts that were accepted by the
	 *              user
	 */
	public ResponseEntity<Object> getContracts(@RequestAttribute("ae.accountId") String accountId,
			@RequestParam(defaultValue = "false") String owner, @RequestParam(defaultValue = "") String embed) {

		ServiceResponse<List<Contract>> response = null;

		if (owner.equals("true")) {
			response = contractService.getContractsForUserWebisites(accountId);
		} else {
			response = contractService.getContractsByAccountId(accountId, embed);
		}

		response.getReponse().forEach((contract) -> {
			if (contract.getAcceptorId().equals(accountId)) { // If the user is the acceptor
				contract.setCreatorContractName(null);
			} else {
				contract.setAcceptorContractName(null);
			}
		});

		return ResponseEntity.status(HttpStatus.OK).body(response.getReponse());
	}

	@GetMapping("/api/v1/contracts/{id}")
	public ResponseEntity<Object> getContractById(@RequestAttribute("ae.accountId") String accountId,
			@PathVariable String id) {

		ServiceResponse<Contract> response = contractService.getContractById(accountId, id);

		switch (response.getErrorType()) {
		case UNAUTHORIZED:
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
		default:
			return ResponseEntity.status(HttpStatus.OK).body(response.getReponse());
		}

	}

	/*
	 * @GetMapping("/api/v1/contracts/batch") public ResponseEntity<Object>
	 * getContractsById(@RequestAttribute("ae.accountId") String accountId, String
	 * ids) {
	 * 
	 * ServiceResponse<List<Contract>> response =
	 * contractService.getContractsById(accountId, ids);
	 * 
	 * return ResponseEntity.status(HttpStatus.OK).body(response.getReponse()); }
	 */

	@PatchMapping("/api/v1/contracts/{id}")
	public ResponseEntity<Object> updateContract(@RequestAttribute("ae.accountId") String accountId,
			@PathVariable String id, String name) {

		ServiceResponse<Contract> response = contractService.updateContract(accountId, id, name);

		switch (response.getErrorType()) {
		case UNAUTHORIZED:
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
		case FAIL:
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response.getFullMessage());
		default:
			return ResponseEntity.status(HttpStatus.OK).body(response.getReponse());
		}
	}

	@DeleteMapping("/api/v1/contracts/{id}")
	public ResponseEntity<Object> deleteContract(@RequestAttribute("ae.accountId") String accountId,
			@PathVariable String id) {

		ServiceResponse<Contract> response = contractService.deleteContractForUser(accountId, id);

		switch (response.getErrorType()) {
		case OK:
			return ResponseEntity.status(HttpStatus.NO_CONTENT).body(response.getReponse());
		case UNAUTHORIZED:
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
		default:
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response.getFullMessage());
		}
	}
}
