package com.tweetapp.tweetservice.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.CollectionUtils;

import com.tweetapp.tweetservice.bean.ReplyTweet;
import com.tweetapp.tweetservice.bean.Tweet;
import com.tweetapp.tweetservice.dto.LikeCountDto;
import com.tweetapp.tweetservice.dto.TweetDto;
import com.tweetapp.tweetservice.exception.Message;
import com.tweetapp.tweetservice.exception.TweetNotFoundException;
import com.tweetapp.tweetservice.repository.TweetRepository;

/**
 * @author Nithya T 
 */
@Service
public class TweetService {

	@Autowired
	public TweetRepository tweetRepository;

	@Autowired
	MongoTemplate mongoTemplate;

	@Transactional
	public List<Tweet> getAllTweets() {
//		List<Tweet> tweets = mongoTemplate.findAll(Tweet.class, "tweets");
		List<Tweet> tweets = tweetRepository.findAll(Sort.by(Sort.Direction.DESC, "postDTTM"));
		return tweets;
	}

	@Transactional
	public List<Tweet> getAllTweetsById(String loginId) throws TweetNotFoundException {
		Query query = new Query(Criteria.where("loginId").is(loginId));
		List<Tweet> tweets = mongoTemplate.find(query, Tweet.class, "tweets");
		if(CollectionUtils.isEmpty(tweets)) {
			throw new TweetNotFoundException("Tweet not found");
		}
		return tweets;
	}

	@Transactional
	public TweetDto postTweet(Tweet tweet) {
		UUID uuid = UUID.randomUUID();
		String uuidAsString = uuid.toString();
		tweet.set_id(uuidAsString);
		tweet.setPostDTTM(LocalDateTime.now());
		mongoTemplate.save(tweet, "tweets");
		return new TweetDto(uuidAsString, "Tweet inserted successfully");
	}

	@Transactional
	public Tweet getTweetById(String id) {
		Query query = new Query(Criteria.where("_id").is(id));
		Tweet tweet = mongoTemplate.findOne(query, Tweet.class, "tweets");
		return tweet;
	}

	@Transactional
	public Tweet replyPostTweet(ReplyTweet replyTweet, String loginId, String id) {
		Tweet tweet = getTweetById(id);
		UUID uuid = UUID.randomUUID();
		String uuidAsString = uuid.toString();
		replyTweet.setId(uuidAsString);
		replyTweet.setRepliedDTTM(LocalDateTime.now());
		replyTweet.setLoginId(loginId);
		tweet.getReplyTweets().add(replyTweet);
		mongoTemplate.save(tweet, "tweets");
		return tweet;
	}

	@Transactional
	public Tweet updateTweet(Tweet tweet, String loginId, String id) {
		Tweet oldtweet = getTweetById(id);
		if (oldtweet != null) {
			tweet.setPostDTTM(LocalDateTime.now());
			mongoTemplate.save(tweet,"tweets");
			return tweet;
		}else {
			return oldtweet;
		}
	}

	@Transactional
	public Message deleteTweet(String loginId, String id) {
		Query query = new Query(Criteria.where("_id").is(id).andOperator(Criteria.where("loginId").is(loginId)));
		Tweet tweet = mongoTemplate.findOne(query, Tweet.class, "tweets");
		if (tweet != null) {
			tweetRepository.deleteById(id);
			return new Message("Tweet Deleted Successfully");
		} else {
			return new Message("No Tweet found");
		}
	}

	@Transactional
	public Tweet likeTweetUpdate(LikeCountDto likeCount, String loginId, String id) {
		Query query = new Query(Criteria.where("_id").is(id));
		Tweet oldtweet = mongoTemplate.findOne(query, Tweet.class, "tweets");
		oldtweet.setPostLikeCount(likeCount.getCount());
		mongoTemplate.save(oldtweet);
		return oldtweet;
	}

}
