console.log('The Iron Yard Rocks');


var api_repo = 'https://api.github.com/users/gt7348b/repos',
    api_user = 'https://api.github.com/users/gt7348b',
    api_org = 'https://api.github.com/users/gt7348b/orgs',
    api_starred = 'https://api.github.com/users/gt7348b/starred',
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

    template_repo = $('#repositories').html();

var render = _.template(template_repo);

$.getJSON(api_repo).done( function(repo_data){

          repo_data.forEach(function(repo){

            console.log(repo.name);

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
        })

  username = userinfo.login;

  person_name = userinfo.name;

  photo = userinfo.avatar_url;

  loc = userinfo.location;

  join = userinfo.created_at;
