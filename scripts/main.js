/**
 * Timeago is a jQuery plugin that makes it easy to support automatically
 * updating fuzzy timestamps (e.g. "4 minutes ago" or "about 1 day ago").
 *
 * @name timeago
 * @version 1.4.1
 * @requires jQuery v1.2.3+
 * @author Ryan McGeary
 * @license MIT License - http://www.opensource.org/licenses/mit-license.php
 *
 * For usage and examples, visit:
 * http://timeago.yarp.com/
 *
 * Copyright (c) 2008-2013, Ryan McGeary (ryan -[at]- mcgeary [*dot*] org)
 */

(function (factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['jquery'], factory);
  } else {
    // Browser globals
    factory(jQuery);
  }
}(function ($) {
  $.timeago = function(timestamp) {
    if (timestamp instanceof Date) {
      return inWords(timestamp);
    } else if (typeof timestamp === "string") {
      return inWords($.timeago.parse(timestamp));
    } else if (typeof timestamp === "number") {
      return inWords(new Date(timestamp));
    } else {
      return inWords($.timeago.datetime(timestamp));
    }
  };
  var $t = $.timeago;

  $.extend($.timeago, {
    settings: {
      refreshMillis: 60000,
      allowPast: true,
      allowFuture: false,
      localeTitle: false,
      cutoff: 0,
      strings: {
        prefixAgo: null,
        prefixFromNow: null,
        suffixAgo: "ago",
        suffixFromNow: "from now",
        inPast: 'any moment now',
        seconds: "less than a minute",
        minute: "about a minute",
        minutes: "%d minutes",
        hour: "about an hour",
        hours: "about %d hours",
        day: "a day",
        days: "%d days",
        month: "about a month",
        months: "%d months",
        year: "about a year",
        years: "%d years",
        wordSeparator: " ",
        numbers: []
      }
    },

    inWords: function(distanceMillis) {
      if(!this.settings.allowPast && ! this.settings.allowFuture) {
          throw 'timeago allowPast and allowFuture settings can not both be set to false.';
      }

      var $l = this.settings.strings;
      var prefix = $l.prefixAgo;
      var suffix = $l.suffixAgo;
      if (this.settings.allowFuture) {
        if (distanceMillis < 0) {
          prefix = $l.prefixFromNow;
          suffix = $l.suffixFromNow;
        }
      }

      if(!this.settings.allowPast && distanceMillis >= 0) {
        return this.settings.strings.inPast;
      }

      var seconds = Math.abs(distanceMillis) / 1000;
      var minutes = seconds / 60;
      var hours = minutes / 60;
      var days = hours / 24;
      var years = days / 365;

      function substitute(stringOrFunction, number) {
        var string = $.isFunction(stringOrFunction) ? stringOrFunction(number, distanceMillis) : stringOrFunction;
        var value = ($l.numbers && $l.numbers[number]) || number;
        return string.replace(/%d/i, value);
      }

      var words = seconds < 45 && substitute($l.seconds, Math.round(seconds)) ||
        seconds < 90 && substitute($l.minute, 1) ||
        minutes < 45 && substitute($l.minutes, Math.round(minutes)) ||
        minutes < 90 && substitute($l.hour, 1) ||
        hours < 24 && substitute($l.hours, Math.round(hours)) ||
        hours < 42 && substitute($l.day, 1) ||
        days < 30 && substitute($l.days, Math.round(days)) ||
        days < 45 && substitute($l.month, 1) ||
        days < 365 && substitute($l.months, Math.round(days / 30)) ||
        years < 1.5 && substitute($l.year, 1) ||
        substitute($l.years, Math.round(years));

      var separator = $l.wordSeparator || "";
      if ($l.wordSeparator === undefined) { separator = " "; }
      return $.trim([prefix, words, suffix].join(separator));
    },

    parse: function(iso8601) {
      var s = $.trim(iso8601);
      s = s.replace(/\.\d+/,""); // remove milliseconds
      s = s.replace(/-/,"/").replace(/-/,"/");
      s = s.replace(/T/," ").replace(/Z/," UTC");
      s = s.replace(/([\+\-]\d\d)\:?(\d\d)/," $1$2"); // -04:00 -> -0400
      s = s.replace(/([\+\-]\d\d)$/," $100"); // +09 -> +0900
      return new Date(s);
    },
    datetime: function(elem) {
      var iso8601 = $t.isTime(elem) ? $(elem).attr("datetime") : $(elem).attr("title");
      return $t.parse(iso8601);
    },
    isTime: function(elem) {
      // jQuery's `is()` doesn't play well with HTML5 in IE
      return $(elem).get(0).tagName.toLowerCase() === "time"; // $(elem).is("time");
    }
  });

  // functions that can be called via $(el).timeago('action')
  // init is default when no action is given
  // functions are called with context of a single element
  var functions = {
    init: function(){
      var refresh_el = $.proxy(refresh, this);
      refresh_el();
      var $s = $t.settings;
      if ($s.refreshMillis > 0) {
        this._timeagoInterval = setInterval(refresh_el, $s.refreshMillis);
      }
    },
    update: function(time){
      var parsedTime = $t.parse(time);
      $(this).data('timeago', { datetime: parsedTime });
      if($t.settings.localeTitle) $(this).attr("title", parsedTime.toLocaleString());
      refresh.apply(this);
    },
    updateFromDOM: function(){
      $(this).data('timeago', { datetime: $t.parse( $t.isTime(this) ? $(this).attr("datetime") : $(this).attr("title") ) });
      refresh.apply(this);
    },
    dispose: function () {
      if (this._timeagoInterval) {
        window.clearInterval(this._timeagoInterval);
        this._timeagoInterval = null;
      }
    }
  };

  $.fn.timeago = function(action, options) {
    var fn = action ? functions[action] : functions.init;
    if(!fn){
      throw new Error("Unknown function name '"+ action +"' for timeago");
    }
    // each over objects here and call the requested function
    this.each(function(){
      fn.call(this, options);
    });
    return this;
  };

  function refresh() {
    var data = prepareData(this);
    var $s = $t.settings;

    if (!isNaN(data.datetime)) {
      if ( $s.cutoff == 0 || Math.abs(distance(data.datetime)) < $s.cutoff) {
        $(this).text(inWords(data.datetime));
      }
    }
    return this;
  }

  function prepareData(element) {
    element = $(element);
    if (!element.data("timeago")) {
      element.data("timeago", { datetime: $t.datetime(element) });
      var text = $.trim(element.text());
      if ($t.settings.localeTitle) {
        element.attr("title", element.data('timeago').datetime.toLocaleString());
      } else if (text.length > 0 && !($t.isTime(element) && element.attr("title"))) {
        element.attr("title", text);
      }
    }
    return element.data("timeago");
  }

  function inWords(date) {
    return $t.inWords(distance(date));
  }

  function distance(date) {
    return (new Date().getTime() - date.getTime());
  }

  // fix for IE6 suckage
  document.createElement("abbr");
  document.createElement("time");
}));

console.log('The Iron Yard Rocks');


var api_repo = 'https://api.github.com/users/gt7348b/repos',
    api_user = 'https://api.github.com/users/gt7348b',
    api_org = 'https://api.github.com/users/gt7348b/orgs',
    api_starred = 'https://api.github.com/users/gt7348b/starred',
    template_about = $('#about').html(),
    template_repo = $('#repositories').html(),
    template_photo = $('#sideid').html(),
    template_header = $('#header_right').html(),
    template_org = $('#organization').html(),
    template_following = $('#following').html(),
    template_followers = $('#followers').html(),
    template_starred = $('#starred').html(),
    current_time = Date.now(),
    render_about,
    render_header,
    render_org,
    render_photo,
    render_repo,
    render_following,
    render_follwers,
    render_starred,
    person_name,
    username,
    loc,
    join,
    join_day,
    fers,
    flowing,
    repo_title,
    repo_update,
    repo_desc,
    repo_bar,
    repo_url,
    repo_star,
    repo_lang,
    repo_fork,
    photo_url,
    orgs,
    date,
    day,
    year,
    month,
    monthtxt,
    dateStr,
    stars,
    link;

    render_about = _.template(template_about);

    render_following = _.template(template_following);

    render_followers = _.template(template_followers);

    render_starred = _.template(template_starred);

    render_header = _.template(template_header);

    render_org = _.template(template_org)

    render_photo = _.template(template_photo);

    render_repo = _.template(template_repo);

$.getJSON(api_org).done( function(org_data){

          org_data.forEach(function(o){

            orgs = o.avatar_url;

            $('.org_img').append(render_org(o));

          })
        });

$.getJSON(api_starred).done( function(star_data){

            stars = star_data.length;

            $('.star').append(render_starred(star_data));

        });


$.getJSON(api_repo).done( function(repo_data){

          repo_data.forEach(function(repo){

            //console.log(repo.name);

            repo_title = repo.name;

            //console.log(repo.updated_at);

            //console.log(repo.description);

            repo_desc = repo.description;

            //console.log(repo.svn_url);

            repo_url = repo.svn_url;

            //console.log(repo.language);

            repo_lang = repo.language;

            repo_star = repo.stargazers_count;

            repo_fork = repo.forks_count;

            // console.log(repo.updated_at);
            // console.log('updated above push below')
            // console.log(repo.pushed_at);

            repo_update = $.timeago(new Date(repo.pushed_at));

            username = repo.owner.login;

            // console.log(repo.html_url);

            link = repo.html_url;

            $('.repo_body').append(render_repo(repo));

          })
        });


$.getJSON(api_user).done( function(user_data){


  username = user_data.login;

  person_name = user_data.name;

  photo = user_data.avatar_url;

  loc = user_data.location;

  join = user_data.created_at;

  date = new Date(join);
  day = date.getDate();
  year = date.getFullYear();
  month = date.getMonth()+1;

  if (month === 9) {
    monthtxt = "Sep";
  } else {monthtxt = month;};

  console.log (monthtxt);

  dateStr = monthtxt+" "+day+" "+year;
console.log(dateStr);

  fers = user_data.followers;

  flowing = user_data.following;

  $('.photo').append(render_photo(user_data));

  $('.about').append(render_about(user_data));

  $('.header_right').append(render_header(user_data));

  $('.flow').append(render_following(user_data));

  $('.flowers').append(render_followers(user_data));
});
