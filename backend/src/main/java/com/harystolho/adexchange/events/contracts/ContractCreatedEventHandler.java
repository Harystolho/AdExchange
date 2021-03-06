package com.harystolho.adexchange.events.contracts;

import java.util.Arrays;

import org.springframework.stereotype.Service;

import com.harystolho.adexchange.events.EventDispatcher;
import com.harystolho.adexchange.events.Handler;
import com.harystolho.adexchange.events.contracts.events.ContractCreatedEvent;
import com.harystolho.adexchange.models.Contract.PaymentMethod;
import com.harystolho.adexchange.services.payment.ContractPaymentService;

@Service
public class ContractCreatedEventHandler extends AbstractContractEventHandler implements Handler<ContractCreatedEvent> {

	private ContractPaymentService contractPaymentService;

	public ContractCreatedEventHandler(EventDispatcher eventDispatcher, ContractPaymentService contractPaymentService) {
		super(eventDispatcher);
		this.contractPaymentService = contractPaymentService;

		eventDispatcher.registerHandler(ContractCreatedEvent.class, this);
	}

	@Override
	public void onEvent(ContractCreatedEvent event) {
		contractPaymentService.issueContractPayment(event.getContract().getId(), Arrays.asList(PaymentMethod.PAY_ONCE));
	}

}
