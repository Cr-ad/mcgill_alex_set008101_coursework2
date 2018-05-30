function validateBlogPostSubmission()
{
    var category = document.forms["add_blog_post"]["category"].value;
    var title = document.forms["add_blog_post"]["title"].value;
    var maxTitleLength = 60;
    if(category === "default")
    {
        alert("Please select a category");
        return false;
    }
    else if(title.length > maxTitleLength)
    {
        alert("Title has too many characters ("+title.length+"). Limit: " + maxTitleLength);
        return false;
    }
    else
    {
        return true;
    }
    
}

// Redirect the browser to the homepage of the website
function homepage()
{
    window.location.href = '/';
}


function search()
{
    var search_query = document.forms["search_bar"]["search_input"].value;
    return true;
}