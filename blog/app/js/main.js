$(document).ready(function(){
    $('#delete_button').on('click', function(e){
        //$target = $(e.target);
        //console.log($target.attr('data-id'));
        const id = $('#delete_button').data("id");
        $.ajax({
            type: 'DELETE',
            url: '/articles/delete/'+id,
            success: function(response){
                alert('Article has been removed.');
                window.location.href='/';
            },
            error: function(err){
                console.log(err);
            }
        })
    }); 
});
