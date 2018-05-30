// Send AJAX delete request
$(document).ready(function(){
    // On click listener for the delete button
    $('#delete_button').on('click', function(e){
        // Get the ID of the current article
        const id = $('#delete_button').data("id");
        $.ajax({
            type: 'DELETE',
            url: '/articles/delete/'+id,
            success: function(response){
                alert('Article has been removed.');
                // Redirect user to homepage
                window.location.href='/';
            },
            error: function(err){
                console.log(err);
            }
        })
    }); 
});