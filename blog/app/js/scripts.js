function validateBlogPostSubmission()
{
    // Length more than 1
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

function test()
{
    
    alert("Cancel");
}


function search()
{
    var search_query = document.forms["search_bar"]["search_input"].value;
    //alert("Query: " + search_query);
    
    // validate the data, if valid then return true
    return true;
}