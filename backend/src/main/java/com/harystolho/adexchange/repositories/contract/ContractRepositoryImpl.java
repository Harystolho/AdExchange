package com.harystolho.adexchange.repositories.contract;

import java.util.Collection;
import java.util.List;

import org.springframework.data.mongodb.core.MongoOperations;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;

import com.harystolho.adexchange.models.Contract;

@Service
public class ContractRepositoryImpl implements ContractRepository {

	private MongoOperations mongoOperations;

	public ContractRepositoryImpl(MongoOperations mongoOperations) {
		this.mongoOperations = mongoOperations;
	}

	@Override
	public Contract save(Contract contract) {
		return mongoOperations.save(contract);
	}

	@Override
	public Contract getById(String id) {
		Query query = Query.query(Criteria.where("_id").is(id));
		return mongoOperations.findOne(query, Contract.class);
	}

	@Override
	public List<Contract> getByAccountId(String accountId) {
		Query query = Query.query(new Criteria().orOperator(Criteria.where("creatorId").is(accountId),
				Criteria.where("acceptorId").is(accountId)));
		return mongoOperations.find(query, Contract.class);
	}

	@Override
	public List<Contract> getManyById(Collection<String> ids) {
		Query query = Query.query(Criteria.where("_id").in(ids));
		return mongoOperations.find(query, Contract.class);
	}

	@Override
	public List<Contract> getByAcceptorId(String accountId) {
		Query query = Query.query(Criteria.where("acceptorId").is(accountId));
		return mongoOperations.find(query, Contract.class);
	}

	@Override
	public void removeById(String id) {
		Query query = Query.query(Criteria.where("_id").is(id));
		mongoOperations.remove(query, Contract.class);
	}

}
