package com.tweetapp.tweetservice.controller;

import java.util.List;


import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.tweetapp.tweetservice.bean.ReplyTweet;
import com.tweetapp.tweetservice.bean.Tweet;
import com.tweetapp.tweetservice.dto.LikeCountDto;
import com.tweetapp.tweetservice.dto.TweetDto;
import com.tweetapp.tweetservice.exception.Message;
import com.tweetapp.tweetservice.kafka.Producer;
import com.tweetapp.tweetservice.service.TweetService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;

/**
 * @author Nithya T
 *
 */
@RestController
@RequestMapping("/api/v1.0/tweets")
@CrossOrigin(origins = "http://localhost:3000")
public class TweetController {

	public static final Logger LOGGER = LoggerFactory.getLogger(TweetController.class);
	@Autowired
	public TweetService tweetService;

//	@Autowired
	public Producer producer;

	public TweetController(TweetService tweetService, Producer producer) {
		super();
		this.tweetService = tweetService;
		this.producer = producer;
	}

	@Operation(summary = "This is to fetch list of Tweets posted by users from db")
	@ApiResponses(value = {
			@ApiResponse(responseCode = "200", description = "Fetched all users tweets from Db", content = {
					@Content(mediaType = "application/json") }),
			@ApiResponse(responseCode = "500", description = "Currently service is not available", content = @Content) })
	@GetMapping("/all")
	public List<Tweet> getAllTweets() {
		LOGGER.info("Inside All Tweets");
		return tweetService.getAllTweets();
	}

	@Operation(summary = "This is to fetch all tweets posted by current loggedIn user based on loginId from db")
	@ApiResponses(value = {
			@ApiResponse(responseCode = "200", description = "Fetched loggedIn user tweets from Db", content = {
					@Content(mediaType = "application/json") }),
			@ApiResponse(responseCode = "500", description = "Currently service is not available", content = @Content) })
	@GetMapping("/find/{loginId}")
	public List<Tweet> getAllTweetsById(@PathVariable String loginId) {
		LOGGER.info("Inside Find Tweet By User");
		return tweetService.getAllTweetsById(loginId);
	}

	@Operation(summary = "This is to fetch particular tweet posted by current loggedIn user based on loginId from db")
	@ApiResponses(value = {
			@ApiResponse(responseCode = "200", description = "Fetched loggedIn user tweet from Db", content = {
					@Content(mediaType = "application/json") }),
			@ApiResponse(responseCode = "500", description = "Currently service is not available", content = @Content) })
	@GetMapping("/{id}")
	public Tweet getTweetById(@PathVariable String id) {
		LOGGER.info("Inside Find Tweet By Id");
		return tweetService.getTweetById(id);
	}

	@Operation(summary = "This is to insert new tweet posted by current loggedIn user in db")
	@ApiResponses(value = {
			@ApiResponse(responseCode = "200", description = "Tweet posted successfully", content = {
					@Content(mediaType = "application/json") }),
			@ApiResponse(responseCode = "500", description = "Currently service is not available", content = @Content) })
	@PostMapping("/add")
	public TweetDto postTweet(@RequestBody Tweet tweet) {
//		producer.sendMessage(tweet.getMessage());
		LOGGER.info("Inside Post Tweet By User");
		return tweetService.postTweet(tweet);
	}

	@Operation(summary = "This is to update post like/unlike for that loginId in db")
	@ApiResponses(value = {
			@ApiResponse(responseCode = "200", description = "Post likes updated successfully", content = {
					@Content(mediaType = "application/json") }),
			@ApiResponse(responseCode = "401", description = "Tweet not found", content = @Content),
			@ApiResponse(responseCode = "500", description = "Currently service is not available", content = @Content) })
	@PutMapping("/{loginId}/like/{id}")
	public Tweet likeTweetUpdate(@RequestBody LikeCountDto likeCount, @PathVariable("loginId") String loginId,
			@PathVariable("id") String id) {
		LOGGER.info("Inside Put like By User");
		return tweetService.likeTweetUpdate(likeCount, loginId, id);
	}

	@Operation(summary = "This is to update post for that loginId in db")
	@ApiResponses(value = {
			@ApiResponse(responseCode = "200", description = "Post updated successfully", content = {
					@Content(mediaType = "application/json") }),
			@ApiResponse(responseCode = "401", description = "Tweet not found", content = @Content),
			@ApiResponse(responseCode = "500", description = "Currently service is not available", content = @Content) })
	@PutMapping("/{loginId}/update/{id}")
	public Tweet updateTweet(@RequestBody Tweet tweet, @PathVariable("loginId") String loginId,
			@PathVariable("id") String id) {
//		producer.sendMessage(tweet.getMessage());
		LOGGER.info("Inside Update Tweet Msg id :{} by login id: {} ", id, loginId);
		return tweetService.updateTweet(tweet, loginId, id);
	}

	@Operation(summary = "This is to reply message by current logged in user for tweet posted by some user/that loggedIn user in db")
	@ApiResponses(value = {
			@ApiResponse(responseCode = "200", description = "Reply Message posted successfully", content = {
					@Content(mediaType = "application/json") }),
			@ApiResponse(responseCode = "500", description = "Currently service is not available", content = @Content) })
	@PostMapping("/reply/{id}")
	public Tweet replyPostTweet(@RequestBody ReplyTweet replytweet, @PathVariable("id") String id) {
//		producer.sendMessage(replytweet.getRepliedMessage());
		LOGGER.info("Inside Reply Tweet By Other User");
		return tweetService.replyPostTweet(replytweet, replytweet.getLoginId(), id);
	}

	@Operation(summary = "This is to delete tweet by current loggedIn user from db")
	@ApiResponses(value = {
			@ApiResponse(responseCode = "200", description = "Tweet deleted successfully", content = {
					@Content(mediaType = "application/json") }),
			@ApiResponse(responseCode = "500", description = "Currently service is not available", content = @Content) })
	@DeleteMapping("/{loginId}/delete/{id}")
	public Message deleteTweet(@PathVariable("loginId") String loginId, @PathVariable("id") String id) {
		LOGGER.info("Inside Delete Tweet: {} by loginId: {}", id, loginId);
		return tweetService.deleteTweet(loginId, id);
	}

}
