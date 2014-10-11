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
