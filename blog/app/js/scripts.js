function validateBlogPostSubmission()
{
    // Length more than 1
    var title = document.forms["add_blog_post"]["title"].value;
    var titleFiltered; // keep removing special characters from first position
    // Length more than 1
    var content;
    // At least 1 individual tag
    var tags;
    var tagArray = [];
    // Only 1 category
    // not needed, form going to be a drop down selection.
    var validCategories = ["technology", "automotive", "sports", "business", "misc"];
    var category;
    // Length more than 1
    var author;


    if(title.length < 2)
    {
        alert("Error: Please enter a valid title");
        return false;
    }
    else if(content.length < 2)
    {
        alert("Error: Please enter some valid content");
        return false;
    }
    else if (tagArray.length < 1)
    {
        alert("Error: Please enter at least one tag");
        return false;
    }
    //else if(!validCategories.contains(category.toLowerCase()))
    {
        alert("Error: Please choose a valid category");
        return false;
    }
    var x = true;
    if (x)
    {
        alert("Data is not valid | TITLE: " + title);
        return false;
    }
}

function test()
{
    
    alert("hi");
}


function search()
{
    var search_query = document.forms["search_bar"]["search_input"].value;
    alert("Query: " + search_query);
    
    // validate the data, if valid then return true
    return true;
}