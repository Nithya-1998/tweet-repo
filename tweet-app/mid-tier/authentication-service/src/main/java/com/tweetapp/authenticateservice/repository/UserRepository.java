package com.tweetapp.authenticateservice.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.config.EnableMongoRepositories;
import org.springframework.stereotype.Repository;

import com.tweetapp.authenticateservice.bean.User;


/**
 * @author Nithya T
 *
 */
@EnableMongoRepositories
@Repository
public interface UserRepository extends MongoRepository<User, String>{
	
	
}
