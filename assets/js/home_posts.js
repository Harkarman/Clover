{
  //method to submit form data for new post using AJAX
  let createPost = function () {
    let newPostForm = $("#new-post-form");

    newPostForm.submit(function (e) {
      e.preventDefault();

      $.ajax({
        type: "POST", //suspect
        url: "/posts/create",
        data: newPostForm.serialize(),
        success: function (data) {
          let newPost = newPostDOM(data.data.post); //suspect
          $("#posts-list-container>ul").prepend(newPost);
          deletePost($(" .delete-post-button", newPost));

          new PostComments(data.data.post._id);

          // enable toggle like functionality on new post
          new ToggleLike($(" .toggle-like-button", newPost));

          //Solution to Noty in AJAX here:
          //https://stackoverflow.com/questions/30736229/jquery-how-use-noty-plugin-in-ajax-function
          new Noty({
            theme: "relax",
            text: "Post created!",
            type: "success",
            layout: "topRight",
            timeout: 1500,
          }).show();
        },
        error: function (error) {
          console.log(error.responseText);
        },
      });
    });
  };

  // method to create a post in DOM
  let newPostDOM = function (post) {
    return $(`<li id="post-${post._id}">
                    <p>                        
                        <small>
                            <a class="delete-post-button" href="/posts/destroy/${post._id}">
                            <i class="fas fa-trash-alt"></i></a>
                        </small>
                          ${post.content}
                          <br>
                        <small>
                          ${post.user.name}
                        </small>
                        <br>
                        <small>
                          <a
                            class="toggle-like-button"
                            data-likes="0"
                            href="/likes/toggle/?id=${post._id}&type=Post"
                          >
                            0 Likes
                          </a>
                        </small>
                    </p>
                    <div class="post-comments">                        
                            <form id="post-${post._id}-comments-form" action="/comments/create" method="POST">
                                <input type="text" name="content" placeholder="Type Here to add comment..." required>
                                <input type="hidden" name="post" value="${post._id}" >
                                <input type="submit" value="Add Comment">
                            </form>         
                        <div class="post-comments-list">
                            <ul id="post-comments-${post._id}">   
                            </ul>
                        </div>
                    </div> 
                </li>`);
  };

  // method to delete post from DOM
  let deletePost = function (deleteLink) {
    $(deleteLink).click(function (e) {
      e.preventDefault();
      $.ajax({
        type: "GET",
        url: $(deleteLink).prop("href"),
        success: function (data) {
          $(`#post-${data.data.post_id}`).remove();
          new Noty({
            theme: "relax",
            text: "Post deleted",
            type: "success",
            layout: "topRight",
            timeout: 1500,
          }).show();
        },
        error: function (error) {
          console.log(error.responseText);
        },
      });
    });
  };

  // Extend Ajax to delete links on existing posts (on page reload), and not just the new posts.
  let convertPostsToAjax = function () {
    $("#posts-list-container>ul>li").each(function () {
      let self = $(this);
      let deleteButton = $(" .delete-post-button", self);
      deletePost(deleteButton);

      // get the post id by splitting id attribute
      let postId = self.prop("id").split("-")[1];
      new PostComments(postId);
    });
  };

  createPost();
  convertPostsToAjax();
}
