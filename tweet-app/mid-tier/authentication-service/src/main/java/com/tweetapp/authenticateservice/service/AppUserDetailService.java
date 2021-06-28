package com.tweetapp.authenticateservice.service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.tweetapp.authenticateservice.bean.User;
import com.tweetapp.authenticateservice.exception.Message;
import com.tweetapp.authenticateservice.repository.UserRepository;
import com.tweetapp.authenticateservice.security.AppUser;


@Service
public class AppUserDetailService implements UserDetailsService{
	
	private User user;
	@Autowired
	UserRepository userRepository;
	
	@Autowired
	MongoTemplate mongoTemplate;

	public AppUserDetailService(UserRepository userRepository) {
		super();
		this.userRepository = userRepository;
	}
	
	@Transactional
	public User getUserById(String loginId) {
		Query query = new Query(Criteria.where("loginId").is(loginId));
		user = mongoTemplate.findOne(query, User.class, "user");
		return user;
	}
	

	@Override
	public UserDetails loadUserByUsername(String loginId) throws UsernameNotFoundException {

//		List<User> user = userRepository.findAll();
//		boolean exist = false;
//		for (User user1 : user) {
//			if(user1.getEmailId().equals(userId)) {
//				AppUser usr = new AppUser(user1);
//				exist = true;
//				return usr;
//			}
//		}
//		if (exist) {
//			throw new UsernameNotFoundException(userId);
//		}
		user = getUserById(loginId);
		if(user != null) {
			AppUser usr = new AppUser(user);
			return usr;
		}else {
			throw new UsernameNotFoundException(loginId);
		}
	}
	
}
