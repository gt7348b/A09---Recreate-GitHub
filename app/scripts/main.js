console.log('The Iron Yard Rocks');


var person_name,
    username,
    location,
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


repos.forEach(function(repo){

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

})
