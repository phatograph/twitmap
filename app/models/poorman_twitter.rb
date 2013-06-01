class PoormanTwitter
  TWITTER_API_ENDPOINT = 'https://api.twitter.com/1.1'

  def initialize
    consumer_key = ENV['CONSUMER_KEY']
    consumer_secret = ENV['CONSUMER_SECRET']
    access_token = ENV['ACCESS_TOKEN']
    access_token_secret = ENV['ACCESS_TOKEN_SECRET']

    consumer = OAuth::Consumer.new(
      consumer_key,
      consumer_secret,
      {
        :site => "http://api.twitter.com",
        :scheme => :header
      }
    )

    token_hash = {
      :oauth_token => access_token,
      :oauth_token_secret => access_token_secret
    }

    @access_token = OAuth::AccessToken.from_hash(consumer, token_hash)
  end

  def home_timeline
    make_request({ :endpoint => "statuses/home_timeline.json" })
  end

  def followings(cursor)
    count = 100 # max 5000
    make_request({ :endpoint => "friends/ids.json?screen_name=phatograph&count=#{count}&cursor=#{cursor}" })
  end

  def users_lookup(user_id)
    make_request({ :endpoint => "users/lookup.json?user_id=#{user_id}" })
  end

  def statuses_update(status)
    make_request({
      :method => :post,
      :endpoint => "statuses/update.json",
      :data => { :status => status }
    })
  end

  def lists_ownerships(user_id)
    count = 1000
    make_request({ :endpoint => "lists/ownerships.json?user_id=#{user_id}&count=#{count}" })
  end

  def lists_members(list_id, cursor)
    puts "GET lists/members #{list_id} : #{cursor}"
    make_request({ :endpoint => "lists/members.json?list_id=#{list_id}&cursor=#{cursor}&include_entities=false&skip_status=true" })
  end

  private

  def make_request(options)
    options.reverse_merge!({
      :method => :get
    })

    res = @access_token.request(
      options[:method],
      "#{TWITTER_API_ENDPOINT}/#{options[:endpoint]}",
      options[:data]
    )

    # res.code
    # res.message
    # res.body
    JSON.parse(res.body)
  end
end
