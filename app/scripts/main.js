console.log('The Iron Yard Rocks');


var api_repo,
    api_user,
    api_star,
    template_repo,
    template_photo,
    template_header,
    template_org,
    template_follow,
    person_name,
    username,
    loc,
    join,
    repo_title,
    repo_update,
    repo_desc,
    repo_bar,
    repo_url,
    repo_star,
    repo_lang,
    repo_fork,
    photo_url,
    orgs;

//.getJSON('repo').done()
          var repotemp= $('#repositories').html();

          var render = _.template(repotemp);

          var test = repos.forEach(function(repo){

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

            username = repo.owner.login;

          //  $('.repo_body').append(render(repo))

          })

  username = userinfo.login;

  person_name = userinfo.name;

  photo = userinfo.avatar_url;

  loc = userinfo.location;

  join = userinfo.created_at;
