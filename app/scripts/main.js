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
    template_follow = $('#following').html(),
    current_time = Date.now(),
    render_about,
    render_header,
    render_org,
    render_photo,
    render_repo,
    render_follow,
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
    dateStr;

    render_about = _.template(template_about);

    render_follow = _.template(template_follow);

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

            repo_update = repo.updated_at;

            username = repo.owner.login;

            $('.repo_body').append(render_repo(repo))

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

  //month_text

  dateStr = month+" "+day+" "+year;
console.log(dateStr);

  fers = user_data.followers;

  flowing = user_data.following;

  $('.photo').append(render_photo(user_data));

  $('.about').append(render_about(user_data));

  $('.HeaderRight').append(render_header(user_data));

  $('.follow').append(render_follow(user_data));
});
